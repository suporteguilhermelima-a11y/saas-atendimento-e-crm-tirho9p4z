import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { UserProvider } from '@/contexts/UserContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import { ErrorBoundary } from './components/ErrorBoundary'
import Conversas from './pages/Conversas'
import CRM from './pages/CRM'
import Automacoes from './pages/Automacoes'
import Templates from './pages/Templates'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading)
    return <div className="flex h-screen items-center justify-center">Carregando permissões...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <UserProvider>
              <ErrorBoundary>
                <Layout />
              </ErrorBoundary>
            </UserProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Index />} />
        <Route path="/conversas" element={<Conversas />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/automacoes" element={<Automacoes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
