import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { message_id, deal_id, text } = await req.json()

    if (!deal_id || !text) {
      throw new Error('deal_id and text are required')
    }

    const { data: deal, error: dealError } = await supabase.from('deals').select('phone').eq('id', deal_id).single()
    
    if (dealError) throw dealError

    if (deal && deal.phone) {
      let evoUrl = Deno.env.get('EVOLUTION_API_URL')
      let evoKey = Deno.env.get('EVOLUTION_API_KEY')
      let instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'crm'

      const { data: integ } = await supabase
        .from('user_integrations')
        .select('evolution_api_url, evolution_api_key, instance_name')
        .not('instance_name', 'is', null)
        .limit(1)
        .maybeSingle()

      if (integ) {
        if (integ.evolution_api_url) evoUrl = integ.evolution_api_url
        if (integ.evolution_api_key) evoKey = integ.evolution_api_key
        if (integ.instance_name) instanceName = integ.instance_name
      }

      const adaptaSkip = Deno.env.get('EVOLUTION-ADAPTASKIP')
      if (adaptaSkip) {
        if (adaptaSkip.startsWith('{')) {
          try {
            const parsed = JSON.parse(adaptaSkip)
            evoUrl = parsed.url || parsed.apiUrl || evoUrl
            evoKey = parsed.apiKey || parsed.apikey || parsed.globalapikey || evoKey
            instanceName = parsed.instanceName || parsed.instance || instanceName
          } catch(e) {}
        } else if (adaptaSkip.includes(',')) {
           const parts = adaptaSkip.split(',')
           if (parts[0].startsWith('http')) {
               evoUrl = parts[0].trim()
               evoKey = parts[1]?.trim() || evoKey
               instanceName = parts[2]?.trim() || instanceName
           } else {
               evoKey = parts[0].trim()
           }
        } else if (adaptaSkip.includes('|')) {
           const parts = adaptaSkip.split('|')
           if (parts[0].startsWith('http')) {
               evoUrl = parts[0].trim()
               evoKey = parts[1]?.trim() || evoKey
               instanceName = parts[2]?.trim() || instanceName
           } else {
               evoKey = parts[0].trim()
           }
        } else if (adaptaSkip.startsWith('http')) {
            evoUrl = adaptaSkip
        } else {
            evoKey = adaptaSkip
        }
      }

      if (!evoUrl || !evoKey) {
        const errorMsg = `Variáveis da Evolution API não configuradas. URL: ${!!evoUrl}, Key: ${!!evoKey}`
        console.warn(errorMsg)
        if (message_id) {
            await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
        }
        throw new Error(errorMsg)
      }

      let cleanPhone = deal.phone.replace(/\D/g, '')
      if (cleanPhone.length === 10 || cleanPhone.length === 11) {
        cleanPhone = `55${cleanPhone}`
      }

      const cleanUrl = evoUrl.replace(/\/$/, '')
      let fetchUrl = `${cleanUrl}/message/sendText/${instanceName}`

      const payload = {
        number: cleanPhone,
        text: text,
        textMessage: {
          text: text
        },
        options: {
          delay: 1200,
          presence: "composing",
          linkPreview: false
        }
      }

      const getHeaders = () => ({
        'Content-Type': 'application/json',
        'apikey': evoKey as string,
        'Authorization': `Bearer ${evoKey}`,
        'globalapikey': evoKey as string
      })

      let response = await fetch(fetchUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      })
      
      // Fallback if instance name is wrong or endpoint not found (common config issue)
      if (!response.ok && (response.status === 404 || response.status === 403 || response.status === 400 || response.status === 500)) {
        try {
          const instancesRes = await fetch(`${cleanUrl}/instance/fetchInstances`, {
            method: 'GET',
            headers: getHeaders()
          })
          
          if (instancesRes.ok) {
            const instances = await instancesRes.json()
            if (Array.isArray(instances) && instances.length > 0) {
              let targetInstance = instances.find((i: any) => 
                i.connectionStatus === 'open' || 
                i.state === 'open' || 
                i.status === 'open' || 
                i.status === 'CONNECTED'
              )
              if (!targetInstance) targetInstance = instances[0]
              
              const newInstanceName = targetInstance.instanceName || targetInstance.name || targetInstance.instance?.instanceName
              if (newInstanceName && newInstanceName !== instanceName) {
                instanceName = newInstanceName
                fetchUrl = `${cleanUrl}/message/sendText/${instanceName}`
                
                // Retry
                response = await fetch(fetchUrl, {
                  method: 'POST',
                  headers: getHeaders(),
                  body: JSON.stringify(payload)
                })
              }
            }
          }
        } catch(e) {
          console.warn('Fallback fetchInstances failed:', e)
        }
      }

      if (!response.ok) {
        const errorPayload = await response.text()
        console.error(`Evolution API error (${response.status}):`, errorPayload, 'URL:', fetchUrl)
        if (message_id) {
          await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
        }
        throw new Error(`Falha ao enviar via Evolution API: ${response.status} - ${errorPayload}`)
      } else {
        const resData = await response.json()
        const waMessageId = resData?.key?.id || resData?.message?.key?.id || resData?.id || resData?.messageId
        
        if (message_id) {
          await supabase.from('messages').update({ 
            wa_message_id: waMessageId, 
            status: 'sent' 
          }).eq('id', message_id)
        }
      }
    } else {
      if (message_id) {
        await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
      }
      throw new Error('Deal não encontrado ou sem número de telefone.')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error('Send error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
