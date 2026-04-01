import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { contactId, text } = await req.json()
    if (!contactId || !text) throw new Error('Missing contactId or text')

    const { data: integration } = await supabaseClient
      .from('user_integrations')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (!integration || !integration.instance_name)
      throw new Error('Integration not found or not connected')

    const evoUrlRaw = integration.evolution_api_url || Deno.env.get('EVOLUTION_API_URL') || ''
    const evoKey = integration.evolution_api_key || Deno.env.get('EVOLUTION_API_KEY') || ''

    const { data: contact } = await supabaseClient
      .from('whatsapp_contacts')
      .select('remote_jid')
      .eq('id', contactId)
      .eq('user_id', user.id)
      .single()
    if (!contact || !contact.remote_jid) throw new Error('Contact not found')

    const isZapi =
      typeof evoUrlRaw === 'string' &&
      (evoUrlRaw.includes('z-api.io') ||
        !evoUrlRaw.startsWith('http') ||
        evoUrlRaw.includes('zapi'))
    let messageId
    let result

    if (isZapi) {
      const clientToken = evoUrlRaw.startsWith('http') ? '' : evoUrlRaw
      const baseUrl = evoUrlRaw.startsWith('http')
        ? evoUrlRaw.replace(/\/$/, '')
        : `https://api.z-api.io/instances/${integration.instance_name}/token/${evoKey}`
      const headers: any = { 'Content-Type': 'application/json' }
      if (clientToken) headers['Client-Token'] = clientToken

      const cleanPhone = contact.remote_jid.replace('@s.whatsapp.net', '')
      const response = await fetch(`${baseUrl}/send-text`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone: cleanPhone, message: text }),
      })

      if (!response.ok) throw new Error(`Z-API error: ${await response.text()}`)
      result = await response.json()
      messageId = result.messageId || result.id || crypto.randomUUID()
    } else {
      const evoUrl = evoUrlRaw.replace(/\/$/, '')
      const response = await fetch(`${evoUrl}/message/sendText/${integration.instance_name}`, {
        method: 'POST',
        headers: { apikey: evoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: contact.remote_jid, text: text }),
      })

      if (!response.ok) throw new Error(`Evolution API error: ${await response.text()}`)
      result = await response.json()
      messageId = result?.key?.id || result?.id || crypto.randomUUID()
    }

    const timestamp = new Date().toISOString()
    await supabaseClient.from('whatsapp_messages').upsert(
      {
        user_id: user.id,
        contact_id: contactId,
        message_id: messageId,
        from_me: true,
        text: text,
        type: 'text',
        timestamp: timestamp,
        raw: result,
      },
      { onConflict: 'user_id,message_id' },
    )

    await supabaseClient
      .from('whatsapp_contacts')
      .update({ pipeline_stage: 'Em Conversa', last_message_at: timestamp })
      .eq('id', contactId)

    return new Response(JSON.stringify({ success: true, messageId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
