import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'operational' | 'clinical'

export interface UserProfile {
  id: string
  name: string
  role: UserRole
  avatar_url?: string
  email?: string
}

export const TEAM: UserProfile[] = []

interface UserContextType {
  currentUser: UserProfile
  setCurrentUser: (user: UserProfile) => void
  team: UserProfile[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [team, setTeam] = useState<UserProfile[]>([])

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setCurrentUser({
              id: data.id,
              name: data.name,
              role: data.role as UserRole,
              avatar_url: data.avatar_url || '',
              email: data.email,
            })
          }
        })
      supabase
        .from('profiles')
        .select('*')
        .then(({ data }) => {
          if (data) {
            setTeam(
              data.map((p) => ({
                id: p.id,
                name: p.name,
                role: p.role as UserRole,
                avatar_url: p.avatar_url || '',
                email: p.email,
              })),
            )
          }
        })
    } else {
      setCurrentUser(null)
      setTeam([])
    }
  }, [user])

  const defaultUser: UserProfile = { id: '0', name: 'Carregando...', role: 'operational' }

  return (
    <UserContext.Provider value={{ currentUser: currentUser || defaultUser, setCurrentUser, team }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
