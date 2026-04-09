import { useEffect, useState } from 'react'
import { Plus, Bot, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAgents, createAgent, updateAgent, deleteAgent, AIAgent } from '@/services/ai_agents'
import { AgentForm } from '@/components/agents/AgentForm'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function Agentes() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const loadAgents = async () => {
    try {
      setLoading(true)
      const data = await getAgents()
      setAgents(data || [])
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao carregar bots', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true)
      if (editingAgent) {
        await updateAgent(editingAgent.id, data)
        toast({ title: 'Bot atualizado com sucesso' })
      } else {
        await createAgent(data)
        toast({ title: 'Bot criado com sucesso' })
      }
      setDialogOpen(false)
      loadAgents()
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao salvar bot', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setSubmitting(true)
      await deleteAgent(deleteId)
      toast({ title: 'Bot excluído com sucesso' })
      loadAgents()
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao excluir bot', variant: 'destructive' })
    } finally {
      setDeleteId(null)
      setSubmitting(false)
    }
  }

  const openEdit = (agent: AIAgent) => {
    setEditingAgent(agent)
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingAgent(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentes de IA</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os bots de inteligência artificial do seu atendimento.
          </p>
        </div>
        <Button size="lg" onClick={openCreate}>
          <Plus className="w-5 h-5 mr-2" /> Novo Bot
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAgent ? 'Editar Bot' : 'Criar Novo Bot'}</DialogTitle>
          </DialogHeader>
          <AgentForm initialData={editingAgent} onSubmit={handleSubmit} isLoading={submitting} />
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Carregando bots...
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20 border-dashed">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum bot configurado</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Crie seu primeiro agente de IA para automatizar o atendimento e responder aos seus
            clientes 24/7.
          </p>
          <Button onClick={openCreate}>Criar Primeiro Bot</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="flex flex-col border-muted/60 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={agent.is_active ? 'default' : 'secondary'}
                      className="pointer-events-none"
                    >
                      {agent.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => openEdit(agent)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Editar Bot
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(agent.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir Bot
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 h-10" title={agent.system_prompt}>
                  {agent.system_prompt}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto border-t bg-muted/10 pt-3 pb-3 text-xs text-muted-foreground flex justify-between items-center">
                <span>Criado em {new Date(agent.created_at).toLocaleDateString()}</span>
                {agent.gemini_api_key && (
                  <span
                    className="text-primary/70 flex items-center gap-1"
                    title="Chave API Personalizada configurada"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70"></div> API Key
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O bot será excluído permanentemente e as conexões que
              o utilizam ficarão sem resposta automática.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
