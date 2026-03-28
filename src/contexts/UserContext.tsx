import { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'admin' | 'operational' | 'clinical'

export type User = {
  id: string
  name: string
  role: Role
  title: string
  avatar: string
}

export const TEAM: User[] = [
  {
    id: 'laisa',
    name: 'Dra. Laisa Chimello',
    role: 'admin',
    title: 'Médica / Admin',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=24',
  },
  {
    id: 'beatriz',
    name: 'Beatriz',
    role: 'admin',
    title: 'Gerente',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=25',
  },
  {
    id: 'ana',
    name: 'Ana',
    role: 'operational',
    title: 'Gerente Comercial',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=26',
  },
  {
    id: 'natalia',
    name: 'Natalia',
    role: 'operational',
    title: 'Secretária',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=27',
  },
  {
    id: 'paola',
    name: 'Dra. Paola',
    role: 'clinical',
    title: 'Médica',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=28',
  },
]

type UserContextType = {
  currentUser: User
  setCurrentUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(TEAM[0])
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
