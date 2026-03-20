import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, MoreHorizontal, Calendar, Activity, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const PIPELINE_STAGES = [
  { id: 'lead', title: 'Novo Lead', color: 'border-blue-200 bg-blue-50/50' },
  { id: 'triage', title: 'Triagem', color: 'border-purple-200 bg-purple-50/50' },
  { id: 'scheduled', title: 'Consulta Agendada', color: 'border-orange-200 bg-orange-50/50' },
  { id: 'return', title: 'Retorno', color: 'border-pink-200 bg-pink-50/50' },
  { id: 'treatment', title: 'Em Tratamento', color: 'border-yellow-200 bg-yellow-50/50' },
  { id: 'post_op', title: 'Pós-Procedimento', color: 'border-green-200 bg-green-50/50' },
  { id: 'consulting', title: 'Consultoria', color: 'border-indigo-200 bg-indigo-50/50' },
]

const INITIAL_DEALS = [
  {
    id: 1,
    stage: 'lead',
    name: 'Mariana Silva',
    procedure: 'Avaliação Facial',
    date: 'Hoje',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    hoursInStage: 2,
  },
  {
    id: 2,
    stage: 'lead',
    name: 'João Souza',
    procedure: 'Tratamento Capilar',
    date: 'Ontem',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=5',
    hoursInStage: 24,
  },
  {
    id: 3,
    stage: 'triage',
    name: 'Carlos Santos',
    procedure: 'Dúvidas Botox',
    date: '3 dias atrás',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    hoursInStage: 54, // Triggers alert (> 48h)
  },
  {
    id: 6,
    stage: 'triage',
    name: 'Fernanda Lima',
    procedure: 'Avaliação',
    date: 'Hoje',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=8',
    hoursInStage: 12,
  },
  {
    id: 4,
    stage: 'scheduled',
    name: 'Beatriz Almeida',
    procedure: 'Preenchimento',
    date: 'Dia 15/10 - 14h',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=12',
    hoursInStage: 10,
  },
  {
    id: 7,
    stage: 'return',
    name: 'Roberto Costa',
    procedure: 'Revisão Pós-Botox',
    date: 'Semana que vem',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=15',
    hoursInStage: 5,
  },
  {
    id: 5,
    stage: 'treatment',
    name: 'Ana Oliveira',
    procedure: 'Protocolo de Pele',
    date: 'Em andamento',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    hoursInStage: 120,
  },
]

export default function CRM() {
  const [deals, setDeals] = useState(INITIAL_DEALS)

  const handleDragStart = (e: React.DragEvent, dealId: number) => {
    e.dataTransfer.setData('dealId', dealId.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const dealIdStr = e.dataTransfer.getData('dealId')
    if (!dealIdStr) return
    const dealId = parseInt(dealIdStr, 10)

    setDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: stageId, hoursInStage: 0 } : deal,
      ),
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jornada Médica Especializada</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o pipeline de pacientes, focando na conversão e acompanhamento.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Visualização em Lista
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Novo Prontuário
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pb-4">
        <div className="flex gap-6 h-full min-w-max animate-fade-in">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage.id)

            return (
              <div
                key={stage.id}
                className="flex flex-col w-80 shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
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
                    // Logic for Recovery Alerts
                    const isStagnant = deal.stage === 'triage' && deal.hoursInStage > 48

                    return (
                      <Card
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className={cn(
                          'cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative',
                          isStagnant
                            ? 'border-destructive/60 shadow-sm bg-destructive/5'
                            : 'border-border/50 bg-card',
                        )}
                      >
                        {isStagnant && (
                          <div className="absolute -top-2.5 -right-2 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm animate-pulse z-10">
                            <AlertTriangle className="w-3 h-3" /> &gt;48h Retido
                          </div>
                        )}
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={deal.avatar} />
                                <AvatarFallback>{deal.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm leading-none">{deal.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{deal.procedure}</p>

                          <div className="flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3 mr-1" />
                              {deal.date}
                            </div>
                            <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-md">
                              <Activity className="w-3 h-3 mr-0.5" />
                              Ficha
                            </div>
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
