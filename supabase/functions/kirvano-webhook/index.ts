import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * KIRVANO WEBHOOK HANDLER (FIXED)
 */

serve(async (req) => {
  try {
    const payload = await req.json()
    
    // No Kirvano, o payload costuma vir diretamente no corpo da requisição
    const event = payload.event
    const data = payload // O root é a data no Kirvano

    console.log(`Recebido evento do Kirvano: ${event}`, JSON.stringify(data))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Identificar a Empresa
    // Tenta via metadata, custom_fields ou e-mail do cliente
    let companyId = data.metadata?.company_id || data.custom_fields?.company_id
    const customerEmail = data.customer?.email

    if (!companyId && customerEmail) {
      const { data: company, error: findError } = await supabase
        .from('companies')
        .select('id')
        .eq('email', customerEmail)
        .limit(1)
        .maybeSingle()

      if (!findError && company) {
        companyId = company.id
      }
    }

    if (!companyId) {
      console.error("Empresa não identificada para o e-mail:", customerEmail)
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 })
    }

    // 2. Processar Eventos
    const successEvents = ['SALE_APPROVED', 'order.paid', 'sale.completed']
    const cancelEvents = ['subscription.canceled', 'order.refunded', 'SALE_REFUNDED', 'SALE_CANCELED']

    if (successEvents.includes(event)) {
      // Limpar o preço (Kirvano manda "R$ 1,00")
      const priceStr = data.total_price || "0"
      const amount = parseFloat(priceStr.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0

      // Registrar a fatura
      await supabase.from('invoices').insert({
        company_id: companyId,
        external_id: data.sale_id || data.id,
        amount: amount,
        status: 'paid',
        description: `Assinatura: ${data.products?.[0]?.name || 'Plano PRO'}`,
        customer_email: customerEmail,
        payment_method: data.payment_method || data.payment?.method
      })

      // Atualizar o plano para "pro"
      await supabase.from('companies').update({
        plan: 'pro',
        subscription_id: data.subscription_id || data.sale_id || data.id,
        subscription_status: 'active'
      }).eq('id', companyId)

    } else if (cancelEvents.includes(event)) {
      await supabase.from('companies').update({
        plan: 'free',
        subscription_status: 'inactive'
      }).eq('id', companyId)

      if (event === 'SALE_REFUNDED' || event === 'order.refunded') {
        await supabase.from('invoices')
          .update({ status: 'cancelled' })
          .eq('external_id', data.sale_id || data.id)
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error(`Erro ao processar webhook: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
