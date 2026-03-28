import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UserProvider } from '@/contexts/UserContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import Conversas from './pages/Conversas'
import CRM from './pages/CRM'
import Automacoes from './pages/Automacoes'
import Templates from './pages/Templates'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/automacoes" element={<Automacoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </UserProvider>
  </BrowserRouter>
)

export default App
