import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

async function processAiResponse(
  userId: string,
  contactId: string,
  supabaseUrl: string,
  supabaseKey: string,
) {
  console.log(
    `[AI Handler] Starting processAiResponse for userId: ${userId}, contactId: ${contactId}`,
  )
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: contact, error: contactError } = await supabase
      .from('whatsapp_contacts')
      .select('ai_agent_id, remote_jid')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      console.error(
        `[AI Handler] Exiting: Contact not found or error loading (contactId: ${contactId}). Error:`,
        contactError,
      )
      return
    }

    if (!contact.ai_agent_id) {
      console.log(
        `[AI Handler] Exiting: AI agent is disabled by default for contact ${contactId}. No ai_agent_id assigned.`,
      )
      return
    }

    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', contact.ai_agent_id)
      .eq('is_active', true)
      .single()

    if (agentError || !agent) return

    const apiKey = agent.gemini_api_key || Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) return

    const { data: messages } = await supabase
      .from('whatsapp_messages')
      .select('text, from_me')
      .eq('contact_id', contactId)
      .order('timestamp', { ascending: false })
      .limit(12)

    if (!messages || messages.length === 0) return

    const history = messages
      .reverse()
      .map((m) => `${m.from_me ? 'Me' : 'Contact'}: ${m.text}`)
      .join('\n')

    const prompt = `
System Instructions:
${agent.system_prompt}

You are acting as "Me" in the following conversation.
Read the conversation history carefully.
Respond ONLY with the exact text of your next reply. Do not use quotes, explanations, or the prefix "Me:".

CONVERSATION HISTORY:
${history}
`

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const aiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    })

    if (!aiRes.ok) return

    const aiData = await aiRes.json()
    const responseText = aiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!responseText) return

    const { data: integration } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!integration || !integration.instance_name) return

    const evoUrlRaw = integration.evolution_api_url || Deno.env.get('EVOLUTION_API_URL') || ''
    const evoUrl = evoUrlRaw.replace(/\/$/, '')
    const evoKey = integration.evolution_api_key || Deno.env.get('EVOLUTION_API_KEY') || ''
    const isZapi =
      evoUrlRaw.includes('z-api.io') || !evoUrlRaw.startsWith('http') || evoUrlRaw.includes('zapi')

    let sendRes
    let result
    let messageId

    if (isZapi) {
      const clientToken = evoUrlRaw.startsWith('http') ? '' : evoUrlRaw
      const baseUrl = evoUrlRaw.startsWith('http')
        ? evoUrl
        : `https://api.z-api.io/instances/${integration.instance_name}/token/${evoKey}`
      const cleanPhone = contact.remote_jid.replace('@s.whatsapp.net', '')

      const headers: any = { 'Content-Type': 'application/json' }
      if (clientToken) headers['Client-Token'] = clientToken

      sendRes = await fetch(`${baseUrl}/send-text`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone: cleanPhone, message: responseText }),
      })

      if (!sendRes.ok) {
        console.error(`[AI Handler] Failed to send via Z-API:`, await sendRes.text())
        return
      }
      result = await sendRes.json()
      messageId = result.messageId || result.id || crypto.randomUUID()
    } else {
      sendRes = await fetch(`${evoUrl}/message/sendText/${integration.instance_name}`, {
        method: 'POST',
        headers: { apikey: evoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: contact.remote_jid, text: responseText }),
      })

      if (!sendRes.ok) {
        console.error(`[AI Handler] Failed to send via Evolution API:`, await sendRes.text())
        return
      }
      result = await sendRes.json()
      messageId = result?.key?.id || result?.id || crypto.randomUUID()
    }

    await supabase.from('whatsapp_messages').upsert(
      {
        user_id: userId,
        contact_id: contactId,
        message_id: messageId,
        from_me: true,
        text: responseText,
        type: 'text',
        timestamp: new Date().toISOString(),
        raw: result,
      },
      { onConflict: 'user_id,message_id' },
    )

    await supabase
      .from('whatsapp_contacts')
      .update({ pipeline_stage: 'Em Conversa', last_message_at: new Date().toISOString() })
      .eq('id', contactId)

    console.log(`[AI Handler] Successfully auto-responded to contact ${contactId}`)
  } catch (error) {
    console.error('[AI Handler] Unhandled exception in processAiResponse:', error)
  }
}

function extractCanonicalPhone(data: any): string | null {
  if (!data) return null
  const jidFields = ['remoteJid', 'jid']
  for (const field of jidFields) {
    const val = data[field]
    if (typeof val === 'string') {
      if (val.includes('@s.whatsapp.net')) {
        const extracted = val.split('@')[0]
        if (/^\d+$/.test(extracted)) return extracted
      }
      if (val.includes('@lid') || val.includes('@g.us') || val.includes('status@broadcast'))
        continue
    }
  }

  const phoneFields = ['phone', 'phoneNumber', 'wa_id', 'senderPn']
  for (const field of phoneFields) {
    const val = data[field]
    if (typeof val === 'string') {
      const digits = val.replace(/\D/g, '')
      if (digits.length >= 8) return digits
    } else if (typeof val === 'number') {
      const strVal = String(val)
      if (strVal.length >= 8) return strVal
    }
  }
  return null
}

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json()
    console.log('[WEBHOOK] INGRESS PAYLOAD:', JSON.stringify(payload))

    const isZapi = !!payload.instanceId
    const instanceName = payload.instance || payload.instanceId

    if (!instanceName) {
      console.log('[WEBHOOK] Ignored: No instance provided')
      return new Response('No instance provided', { status: 200 })
    }

    let event = payload.event?.toLowerCase()

    if (isZapi) {
      if (payload.messageId && payload.phone) {
        if (payload.status && payload.status !== 'RECEIVED') {
          event = 'messages.update'
        } else {
          event = 'messages.upsert'
        }
      } else if (payload.status === 'CONNECTED' || payload.status === 'DISCONNECTED') {
        event = 'connection.update'
        payload.data = { state: payload.status === 'CONNECTED' ? 'open' : 'close' }
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const cleanInstanceName = instanceName.trim()
    let { data: integ } = await supabase
      .from('user_integrations')
      .select('id, user_id')
      .ilike('instance_name', cleanInstanceName)
      .maybeSingle()

    if (!integ) {
      const { data: exactInteg } = await supabase
        .from('user_integrations')
        .select('id, user_id')
        .eq('instance_name', instanceName)
        .maybeSingle()
      integ = exactInteg
    }

    if (!integ) {
      console.log(`[WEBHOOK] Ignored: Integration not found for instance: ${instanceName}`)
      return new Response('Integration not found', { status: 200 })
    }
    const userId = integ.user_id

    if (event === 'connection.update') {
      const state = payload.data?.state
      if (state === 'open') {
        await supabase
          .from('user_integrations')
          .update({ status: 'CONNECTED' })
          .eq('user_id', userId)
      } else if (state === 'close') {
        await supabase
          .from('user_integrations')
          .update({ status: 'DISCONNECTED' })
          .eq('user_id', userId)
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (event === 'messages.update' && isZapi) {
      const statusMap: Record<string, string> = {
        SENT: 'sent',
        DELIVERED: 'delivered',
        READ: 'read',
        ERROR: 'error',
      }
      const mappedStatus = statusMap[payload.status]
      if (mappedStatus && payload.messageId) {
        await supabase
          .from('messages')
          .update({
            status: mappedStatus,
            is_read: mappedStatus === 'read',
          })
          .eq('wa_message_id', payload.messageId)
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    if (event === 'messages.upsert') {
      let msgObj: any, remoteJid, messageId, fromMe, pushName, canonicalPhone, type, text, timestamp

      if (isZapi) {
        msgObj = payload
        remoteJid = payload.phone?.includes('@') ? payload.phone : `${payload.phone}@s.whatsapp.net`
        messageId = payload.messageId
        fromMe = payload.fromMe || false
        pushName = payload.senderName || payload.chatName || 'Unknown'
        canonicalPhone = extractCanonicalPhone({ phone: payload.phone })
        type = payload.type?.toLowerCase() || 'text'
        text =
          payload.text?.message ||
          payload.audio?.caption ||
          payload.image?.caption ||
          payload.document?.caption ||
          payload.video?.caption ||
          (typeof payload.text === 'string' ? payload.text : '[Media/Unsupported]')
        timestamp = new Date(payload.momment || Date.now()).toISOString()

        if (payload.isGroup || remoteJid.includes('@g.us')) {
          console.log('[WEBHOOK] Ignored: Group message')
          return new Response('Ignored - Group', { status: 200 })
        }
      } else {
        msgObj = payload.data
        if (Array.isArray(msgObj)) msgObj = msgObj[0]
        else if (msgObj && Array.isArray(msgObj.messages)) msgObj = msgObj.messages[0]
        if (msgObj && !msgObj.key && msgObj.message && msgObj.message.key) msgObj = msgObj.message

        if (!msgObj) return new Response('No message data', { status: 200 })

        const key = msgObj.key || {}
        remoteJid = key.remoteJid || msgObj.remoteJid || msgObj.jid
        messageId = key.id || msgObj.id
        fromMe = key.fromMe !== undefined ? key.fromMe : msgObj.fromMe || false

        if (
          !remoteJid ||
          remoteJid === 'status@broadcast' ||
          remoteJid.includes('@g.us') ||
          !messageId
        ) {
          return new Response('Ignored', { status: 200 })
        }

        pushName = msgObj.pushName || msgObj.verifiedName || msgObj.name || 'Unknown'
        canonicalPhone = extractCanonicalPhone({ remoteJid, ...msgObj, ...key })

        type = 'text'
        text = '[Media/Unsupported]'

        const content = msgObj.message
        if (typeof content === 'string') text = content
        else if (content && typeof content === 'object') {
          text =
            content.conversation ||
            content.extendedTextMessage?.text ||
            content.imageMessage?.caption ||
            content.videoMessage?.caption ||
            content.documentMessage?.caption ||
            msgObj.text ||
            '[Media/Unsupported]'
          type = Object.keys(content).filter((k: string) => k !== 'messageContextInfo')[0] || 'text'
        } else if (msgObj.text) text = msgObj.text

        const ts = msgObj.messageTimestamp || msgObj.timestamp
        timestamp = new Date().toISOString()
        if (ts) {
          const numTs = typeof ts === 'string' ? parseInt(ts, 10) : ts
          if (numTs > 0)
            timestamp = new Date(numTs < 100000000000 ? numTs * 1000 : numTs).toISOString()
        }
      }

      let identity = null
      if (canonicalPhone) {
        const { data } = await supabase
          .from('contact_identity')
          .select('*')
          .eq('instance_id', integ.id)
          .eq('canonical_phone', canonicalPhone)
          .maybeSingle()
        identity = data
      }

      if (!identity && remoteJid) {
        const { data } = await supabase
          .from('contact_identity')
          .select('*')
          .eq('instance_id', integ.id)
          .or(`lid_jid.eq.${remoteJid},phone_jid.eq.${remoteJid}`)
          .limit(1)
          .maybeSingle()
        identity = data
      }

      if (!identity && canonicalPhone) {
        const phoneJid = remoteJid.includes('@s.whatsapp.net')
          ? remoteJid
          : `${canonicalPhone}@s.whatsapp.net`
        const lidJid = remoteJid.includes('@lid') ? remoteJid : null
        const { data: newId } = await supabase
          .from('contact_identity')
          .insert({
            instance_id: integ.id,
            user_id: userId,
            canonical_phone: canonicalPhone,
            phone_jid: phoneJid,
            lid_jid: lidJid,
            display_name: pushName,
          })
          .select()
          .single()
        identity = newId
      } else if (identity) {
        const updates: any = {}
        if (remoteJid.includes('@lid') && identity.lid_jid !== remoteJid)
          updates.lid_jid = remoteJid
        if (remoteJid.includes('@s.whatsapp.net') && identity.phone_jid !== remoteJid)
          updates.phone_jid = remoteJid
        if (Object.keys(updates).length > 0)
          await supabase.from('contact_identity').update(updates).eq('id', identity.id)
      }

      const effectivePhone = identity?.canonical_phone || canonicalPhone
      const effectiveJid =
        identity?.phone_jid || (effectivePhone ? `${effectivePhone}@s.whatsapp.net` : remoteJid)

      let { data: contact } = await supabase
        .from('whatsapp_contacts')
        .select('id, phone_number, push_name')
        .eq('user_id', userId)
        .eq('remote_jid', effectiveJid)
        .maybeSingle()

      if (!contact && effectivePhone) {
        const { data: contactByPhone } = await supabase
          .from('whatsapp_contacts')
          .select('id, phone_number, push_name')
          .eq('user_id', userId)
          .eq('phone_number', effectivePhone)
          .limit(1)
          .maybeSingle()
        if (contactByPhone) contact = contactByPhone
      }

      if (!contact && remoteJid !== effectiveJid) {
        const { data: contactByJid } = await supabase
          .from('whatsapp_contacts')
          .select('id, phone_number, push_name')
          .eq('user_id', userId)
          .eq('remote_jid', remoteJid)
          .limit(1)
          .maybeSingle()
        if (contactByJid) contact = contactByJid
      }

      if (!contact) {
        const { data: newContact } = await supabase
          .from('whatsapp_contacts')
          .insert({
            user_id: userId,
            remote_jid: effectiveJid,
            phone_number: effectivePhone,
            push_name: pushName,
            last_message_at: timestamp,
            pipeline_stage: 'Em Conversa',
          })
          .select('id, phone_number, push_name')
          .single()
        contact = newContact
      } else {
        const updatePayload: any = { last_message_at: timestamp, pipeline_stage: 'Em Conversa' }
        if (
          pushName &&
          pushName !== 'Unknown' &&
          (!contact.push_name || contact.push_name === 'Unknown' || /^\d+$/.test(contact.push_name))
        )
          updatePayload.push_name = pushName
        if (effectivePhone && !contact.phone_number) updatePayload.phone_number = effectivePhone
        if (Object.keys(updatePayload).length > 0)
          await supabase.from('whatsapp_contacts').update(updatePayload).eq('id', contact.id)
      }

      // --- START DEALS CRM SYNC ---
      let dealId = null
      if (effectivePhone) {
        let { data: deal } = await supabase
          .from('deals')
          .select('id, phone')
          .eq('phone', effectivePhone)
          .maybeSingle()

        if (!deal) {
          const cleanEffPhone = effectivePhone.replace(/\D/g, '')
          let ddd = '',
            last8 = ''
          if (cleanEffPhone.startsWith('55') && cleanEffPhone.length >= 12) {
            ddd = cleanEffPhone.substring(2, 4)
            last8 = cleanEffPhone.slice(-8)
          } else if (cleanEffPhone.length >= 10) {
            ddd = cleanEffPhone.substring(0, 2)
            last8 = cleanEffPhone.slice(-8)
          }

          if (ddd && last8) {
            const { data: possibleDeals } = await supabase
              .from('deals')
              .select('id, phone')
              .ilike('phone', `%${last8}%`)
              .limit(50)
            if (possibleDeals && possibleDeals.length > 0) {
              for (const pd of possibleDeals) {
                if (!pd.phone) continue
                const cleanDbPhone = pd.phone.replace(/\D/g, '')
                let dbDdd = '',
                  dbLast8 = ''
                if (cleanDbPhone.startsWith('55') && cleanDbPhone.length >= 12) {
                  dbDdd = cleanDbPhone.substring(2, 4)
                  dbLast8 = cleanDbPhone.slice(-8)
                } else if (cleanDbPhone.length >= 10) {
                  dbDdd = cleanDbPhone.substring(0, 2)
                  dbLast8 = cleanDbPhone.slice(-8)
                }
                if (ddd === dbDdd && last8 === dbLast8) {
                  deal = pd
                  break
                }
              }
            }
          }
        }

        if (deal) {
          dealId = deal.id
          await supabase
            .from('deals')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', deal.id)
        } else {
          const { data: newDeal } = await supabase
            .from('deals')
            .insert({
              name: pushName && pushName !== 'Unknown' ? pushName : effectivePhone,
              phone: effectivePhone,
              stage: 'lead',
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single()
          if (newDeal) dealId = newDeal.id
        }
      }

      if (dealId && messageId) {
        const { data: existingMsg } = await supabase
          .from('messages')
          .select('id')
          .eq('wa_message_id', messageId)
          .maybeSingle()
        if (!existingMsg) {
          await supabase.from('messages').insert({
            deal_id: dealId,
            sender_type: fromMe ? 'attendant' : 'user',
            text: text,
            wa_message_id: messageId,
            status: fromMe ? 'sent' : 'received',
            is_read: fromMe ? true : false,
          })
        }
      }
      // --- END DEALS CRM SYNC ---

      if (contact && messageId) {
        const { error: insertError } = await supabase.from('whatsapp_messages').upsert(
          {
            user_id: userId,
            contact_id: contact.id,
            message_id: messageId,
            from_me: fromMe,
            text: text,
            type: type,
            timestamp: timestamp,
            raw: msgObj,
          },
          { onConflict: 'user_id,message_id' },
        )

        if (
          !insertError &&
          !fromMe &&
          ['text', 'conversation', 'extendedTextMessage'].includes(type)
        ) {
          if (
            typeof (globalThis as any).EdgeRuntime !== 'undefined' &&
            typeof (globalThis as any).EdgeRuntime.waitUntil === 'function'
          ) {
            ;(globalThis as any).EdgeRuntime.waitUntil(
              processAiResponse(userId, contact.id, supabaseUrl, supabaseKey),
            )
          } else {
            processAiResponse(userId, contact.id, supabaseUrl, supabaseKey).catch(console.error)
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error)
    return new Response('Webhook Error', { status: 500 })
  }
})
