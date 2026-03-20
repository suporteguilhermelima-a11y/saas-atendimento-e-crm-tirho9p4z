import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, MoreHorizontal, Calendar, DollarSign } from 'lucide-react'

const PIPELINE_STAGES = [
  { id: 'lead', title: 'Novos Leads', color: 'border-blue-200 bg-blue-50/50', count: 3 },
  { id: 'contact', title: 'Contato Inicial', color: 'border-purple-200 bg-purple-50/50', count: 2 },
  {
    id: 'proposal',
    title: 'Proposta Enviada',
    color: 'border-orange-200 bg-orange-50/50',
    count: 1,
  },
  { id: 'negotiation', title: 'Negociação', color: 'border-yellow-200 bg-yellow-50/50', count: 2 },
  { id: 'won', title: 'Fechado (Ganho)', color: 'border-green-200 bg-green-50/50', count: 4 },
]

const DEALS = [
  {
    id: 1,
    stage: 'lead',
    name: 'Mariana Silva',
    company: 'TechCorp',
    value: 'R$ 1.500',
    date: 'Hoje',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  {
    id: 2,
    stage: 'lead',
    name: 'João Souza',
    company: 'Padaria Central',
    value: 'R$ 800',
    date: 'Ontem',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=5',
  },
  {
    id: 3,
    stage: 'contact',
    name: 'Carlos Santos',
    company: 'Consultoria CS',
    value: 'R$ 3.200',
    date: '2 dias atrás',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
  },
  {
    id: 4,
    stage: 'proposal',
    name: 'Empresa Alpha',
    company: 'Alpha SA',
    value: 'R$ 12.000',
    date: '5 dias atrás',
    avatar: 'https://img.usecurling.com/i?q=alpha',
  },
  {
    id: 5,
    stage: 'negotiation',
    name: 'Ana Oliveira',
    company: 'Moda Fashion',
    value: 'R$ 2.400',
    date: '1 semana',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
  },
]

export default function CRM() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funil de Vendas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie oportunidades e arraste os cards pelos estágios.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Visualização em Lista
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pb-4">
        <div className="flex gap-6 h-full min-w-max animate-fade-in">
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage.id} className="flex flex-col w-80 shrink-0">
              <div
                className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg border ${stage.color} dark:bg-muted/20 dark:border-border`}
              >
                <h3 className="font-semibold text-sm">{stage.title}</h3>
                <Badge
                  variant="secondary"
                  className="bg-background shadow-sm text-xs font-medium px-2"
                >
                  {stage.count}
                </Badge>
              </div>

              <div className="flex-1 flex flex-col gap-3 min-h-[200px] rounded-xl bg-muted/30 p-2 border border-dashed border-transparent hover:border-border transition-colors">
                {DEALS.filter((deal) => deal.stage === stage.id).map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border border-border/50 group"
                  >
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
                      <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>

                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3 mr-1" />
                          {deal.date}
                        </div>
                        <div className="flex items-center text-green-700 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {deal.value}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Empty State placeholder */}
                {DEALS.filter((deal) => deal.stage === stage.id).length === 0 && (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground/50 border border-dashed rounded-lg">
                    Nenhum card
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
