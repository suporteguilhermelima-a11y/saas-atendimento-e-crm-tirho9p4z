import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type AIAgent = Database['public']['Tables']['ai_agents']['Row']
export type AIAgentInsert = Database['public']['Tables']['ai_agents']['Insert']
export type AIAgentUpdate = Database['public']['Tables']['ai_agents']['Update']

export const getAgents = async () => {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createAgent = async (agent: Omit<AIAgentInsert, 'user_id'>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not found')

  const { data, error } = await supabase
    .from('ai_agents')
    .insert({ ...agent, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateAgent = async (id: string, agent: AIAgentUpdate) => {
  const { data, error } = await supabase
    .from('ai_agents')
    .update(agent)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteAgent = async (id: string) => {
  const { error } = await supabase.from('ai_agents').delete().eq('id', id)

  if (error) throw error
  return true
}
