import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('suporte.guilhermelima@gmail.com')
  const [password, setPassword] = useState('securepassword123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/', { replace: true })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Atendimento CRM</CardTitle>
          <CardDescription>Faça login para acessar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 space-y-2 text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p className="font-semibold text-foreground">Usuários de Teste:</p>
            <ul className="space-y-1">
              <li
                className="cursor-pointer hover:text-primary"
                onClick={() => setEmail('suporte.guilhermelima@gmail.com')}
              >
                Admin: suporte.guilhermelima@gmail.com
              </li>
              <li
                className="cursor-pointer hover:text-primary"
                onClick={() => setEmail('laisa@example.com')}
              >
                Dra. Laisa: laisa@example.com
              </li>
              <li
                className="cursor-pointer hover:text-primary"
                onClick={() => setEmail('ana@example.com')}
              >
                Ana (Operacional): ana@example.com
              </li>
              <li
                className="cursor-pointer hover:text-primary"
                onClick={() => setEmail('paola@example.com')}
              >
                Dra. Paola (Clínica): paola@example.com
              </li>
            </ul>
            <p className="pt-2">
              Senha para todos: <strong>securepassword123</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
