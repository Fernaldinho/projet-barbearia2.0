import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * KIRVANO WEBHOOK HANDLER (DEBUG VER 3)
 */

serve(async (req) => {
  try {
    const payload = await req.json()
    const event = payload.event
    const data = payload

    console.log(`[Webhook] Evento: ${event} | Cliente: ${payload.customer?.email}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Identificar a Empresa
    let companyId = data.metadata?.company_id || data.custom_fields?.company_id
    const customerEmail = data.customer?.email

    if (!companyId && customerEmail) {
      console.log(`[Webhook] Buscando empresa por email: ${customerEmail}`)
      const { data: company, error: findError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('email', customerEmail)
        .limit(1)
        .maybeSingle()

      if (findError) {
        console.error(`[Webhook] Erro ao buscar empresa: ${findError.message}`)
      } else if (company) {
        companyId = company.id
        console.log(`[Webhook] Empresa encontrada: ${company.name} (${companyId})`)
      } else {
        console.log(`[Webhook] Nenhuma empresa encontrada para o email: ${customerEmail}`)
      }
    }

    if (!companyId) {
      return new Response(JSON.stringify({ 
        error: "Company not found", 
        email: customerEmail,
        payload_preview: JSON.stringify(data).substring(0, 100)
      }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    }

    const successEvents = ['SALE_APPROVED', 'order.paid', 'sale.completed']
    const cancelEvents = ['subscription.canceled', 'order.refunded', 'SALE_REFUNDED', 'SALE_CANCELED']

    let resultMsg = "Evento processado"

    if (successEvents.includes(event)) {
      const priceStr = data.total_price || "0"
      const amountStr = String(priceStr).replace(/[^\d,.-]/g, '').replace(',', '.')
      const amount = parseFloat(amountStr) || 0

      console.log(`[Webhook] Registrando venda approved. Valor: ${amount}`)

      // Registrar a fatura
      const { error: invError } = await supabase.from('invoices').insert({
        company_id: companyId,
        external_id: String(data.sale_id || data.id),
        amount: amount,
        status: 'paid',
        description: `Assinatura: ${data.products?.[0]?.name || 'Plano PRO'}`,
        customer_email: customerEmail,
        payment_method: data.payment_method || data.payment?.method
      })

      if (invError) {
        console.error(`[Webhook] Erro ao inserir fatura: ${invError.message}`)
        resultMsg = `Erro na fatura: ${invError.message}`
      }

      // Atualizar o plano para "pro"
      const { error: compError } = await supabase.from('companies').update({
        plan: 'pro',
        subscription_id: String(data.subscription_id || data.sale_id || data.id),
        subscription_status: 'active'
      }).eq('id', companyId)

      if (compError) {
        console.error(`[Webhook] Erro ao atualizar empresa: ${compError.message}`)
        resultMsg = `Erro na empresa: ${compError.message}`
      } else {
        resultMsg = "Plano PRO ativado com sucesso!"
        console.log(`[Webhook] Plano PRO ativado para empresa ${companyId}`)
      }

    } else if (cancelEvents.includes(event)) {
      await supabase.from('companies').update({
        plan: 'free',
        subscription_status: 'inactive'
      }).eq('id', companyId)

      if (event === 'SALE_REFUNDED' || event === 'order.refunded') {
        await supabase.from('invoices')
          .update({ status: 'cancelled' })
          .eq('external_id', String(data.sale_id || data.id))
      }
      resultMsg = "Assinatura cancelada/estornada"
    } else {
      console.log(`[Webhook] Evento ignorado: ${event}`)
      resultMsg = `Evento ${event} ignorado`
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: resultMsg,
      company_id: companyId,
      event: event
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error(`[Webhook] Erro fatal: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
