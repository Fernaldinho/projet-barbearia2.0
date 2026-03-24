import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * KIRVANO WEBHOOK HANDLER
 * 
 * Este webhook processa notificações de pagamento do Kirvano.
 * Ele espera o ID da empresa (company_id) nos parâmetros de metadados ou
 * tenta encontrar a empresa pelo e-mail do cliente.
 */

serve(async (req) => {
  try {
    const payload = await req.json()
    const { event, data } = payload

    // Log para depuração
    console.log(`Recebido evento do Kirvano: ${event}`, JSON.stringify(data))

    // Inicializar Supabase com Service Role (pula RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Identificar a Empresa (Company)
    // Tenta primeiro via metadata (se você configurar para passar o company_id no checkout)
    // Caso contrário, usa o e-mail do cliente
    let companyId = data.metadata?.company_id || data.custom_fields?.company_id
    const customerEmail = data.customer?.email

    if (!companyId && customerEmail) {
      const { data: company, error: findError } = await supabase
        .from('companies')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (!findError && company) {
        companyId = company.id
      }
    }

    if (!companyId) {
      console.error("Empresa não identificada para este pagamento.")
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 })
    }

    // 2. Processar Eventos
    switch (event) {
      case 'order.paid':
      case 'sale.completed': {
        const amount = data.total_price || data.price || 0
        const planType = 'pro' // Valor padrão. Pode ser extraído do data.product.name

        // Registrar a fatura
        await supabase.from('invoices').insert({
          company_id: companyId,
          external_id: data.id,
          amount: amount,
          status: 'paid',
          description: `Assinatura: ${data.product?.name || 'Kirvano Pro'}`,
          customer_email: customerEmail,
          payment_method: data.payment_method
        })

        // Atualizar o plano da empresa
        await supabase.from('companies').update({
          plan: planType,
          subscription_id: data.subscription_id || data.id,
          subscription_status: 'active'
        }).eq('id', companyId)

        break
      }

      case 'subscription.canceled':
      case 'order.refunded': {
        // Voltar para o plano gratuito
        await supabase.from('companies').update({
          plan: 'free',
          subscription_status: 'inactive'
        }).eq('id', companyId)

        // Marcar fatura como estornada se for reembolso
        if (event === 'order.refunded') {
          await supabase.from('invoices')
            .update({ status: 'cancelled' })
            .eq('external_id', data.id)
        }
        break
      }

      default:
        console.log(`Evento ignorado: ${event}`)
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
