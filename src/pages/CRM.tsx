import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Activity,
  AlertTriangle,
  UserPlus,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabase/client'

const PIPELINE_STAGES = [
  { id: 'lead', title: 'Novo Lead', color: 'border-blue-200 bg-blue-50/50' },
  { id: 'triage', title: 'Triagem', color: 'border-purple-200 bg-purple-50/50' },
  { id: 'scheduled', title: 'Consulta Agendada', color: 'border-orange-200 bg-orange-50/50' },
  { id: 'return', title: 'Retorno', color: 'border-pink-200 bg-pink-50/50' },
  { id: 'treatment', title: 'Em Tratamento', color: 'border-yellow-200 bg-yellow-50/50' },
  { id: 'post_op', title: 'Pós-Procedimento', color: 'border-green-200 bg-green-50/50' },
  { id: 'consulting', title: 'Consultoria', color: 'border-indigo-200 bg-indigo-50/50' },
]

export default function CRM() {
  const { currentUser, team } = useUser()
  const [deals, setDeals] = useState<any[]>([])
  const [attendantFilter, setAttendantFilter] = useState('all')

  const attendants = team.filter((u) => u.role === 'operational')

  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase.from('deals').select('*')
      if (data) setDeals(data)
    }
    fetchDeals()
    const channel = supabase
      .channel('crm_deals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, fetchDeals)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('dealId')
    if (!dealId) return
    setDeals((curr) => curr.map((d) => (d.id === dealId ? { ...d, stage: stageId } : d)))
    await supabase.from('deals').update({ stage: stageId }).eq('id', dealId)
  }

  const handleAssignAttendant = async (dealId: string, attendantId: string) => {
    setDeals((curr) => curr.map((d) => (d.id === dealId ? { ...d, attendant_id: attendantId } : d)))
    await supabase.from('deals').update({ attendant_id: attendantId }).eq('id', dealId)
  }

  const visibleDeals = deals.filter(
    (deal) => attendantFilter === 'all' || deal.attendant_id === attendantFilter,
  )
  const visibleStages =
    currentUser.role === 'clinical'
      ? PIPELINE_STAGES.filter((s) =>
          ['scheduled', 'return', 'treatment', 'post_op'].includes(s.id),
        )
      : PIPELINE_STAGES

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jornada Médica Especializada</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {currentUser.role === 'clinical'
              ? 'Acompanhamento dos pacientes agendados e em tratamento.'
              : 'Gerencie o pipeline de pacientes, focando na conversão e acompanhamento.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {currentUser.role !== 'clinical' && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={attendantFilter} onValueChange={setAttendantFilter}>
                <SelectTrigger className="w-[160px] border-none bg-transparent shadow-none focus:ring-0">
                  <SelectValue placeholder="Atendente Humano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Atendentes</SelectItem>
                  {attendants.map((att) => (
                    <SelectItem key={att.id} value={att.id}>
                      {att.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pb-4">
        <div className="flex gap-6 h-full min-w-max animate-fade-in">
          {visibleStages.map((stage) => {
            const stageDeals = visibleDeals.filter((deal) => deal.stage === stage.id)
            return (
              <div
                key={stage.id}
                className="flex flex-col w-80 shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={
                  currentUser.role !== 'clinical' ? (e) => handleDrop(e, stage.id) : undefined
                }
              >
                <div
                  className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg border ${stage.color} dark:bg-muted/20 dark:border-border`}
                >
                  <h3 className="font-semibold text-sm">{stage.title}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-background shadow-sm text-xs font-medium px-2"
                  >
                    {stageDeals.length}
                  </Badge>
                </div>
                <div className="flex-1 flex flex-col gap-3 min-h-[200px] rounded-xl bg-muted/30 p-2 border border-dashed border-transparent hover:border-border/50 transition-colors">
                  {stageDeals.map((deal) => {
                    const attendantUser = attendants.find((a) => a.id === deal.attendant_id)
                    return (
                      <Card
                        key={deal.id}
                        draggable={currentUser.role !== 'clinical'}
                        onDragStart={
                          currentUser.role !== 'clinical'
                            ? (e) => handleDragStart(e, deal.id)
                            : undefined
                        }
                        className={cn(
                          'cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative border-border/50 bg-card',
                          currentUser.role === 'clinical' && 'cursor-default active:cursor-default',
                        )}
                      >
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={deal.avatar_url} />
                                <AvatarFallback>{deal.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm leading-none truncate max-w-[140px]">
                                {deal.name}
                              </span>
                            </div>
                            {currentUser.role !== 'clinical' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel className="text-xs">
                                    Atribuir Atendente
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {attendants.map((att) => (
                                    <DropdownMenuItem
                                      key={att.id}
                                      onClick={() => handleAssignAttendant(deal.id, att.id)}
                                    >
                                      <Avatar className="w-4 h-4 mr-2">
                                        <AvatarImage src={att.avatar_url} />
                                      </Avatar>
                                      {att.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {deal.procedure_name}
                          </p>
                          <div className="flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3 mr-1" /> {deal.phone || 'Sem contato'}
                            </div>
                            {currentUser.role !== 'clinical' ? (
                              attendantUser ? (
                                <div className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={attendantUser.avatar_url} />
                                  </Avatar>
                                  <span className="text-[10px]">{attendantUser.name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  <span className="text-[10px]">Sem Atendente</span>
                                </div>
                              )
                            ) : (
                              <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-md cursor-pointer hover:bg-primary/20">
                                <Activity className="w-3 h-3 mr-0.5" /> Ficha
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-sm text-muted-foreground/50 border border-dashed rounded-lg">
                      Arraste pacientes para cá
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
