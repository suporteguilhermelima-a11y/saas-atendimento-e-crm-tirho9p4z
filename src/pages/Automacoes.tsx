import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Zap, MessageSquare, Clock, ArrowRight, Play, Plus, MoreVertical } from 'lucide-react'

const WORKFLOWS = [
  {
    id: 1,
    name: 'Boas-vindas Lead Novo',
    desc: 'Envia mensagem inicial quando um contato chega pela primeira vez.',
    active: true,
    stats: '1.2k envios (98% sucesso)',
    steps: [
      {
        type: 'trigger',
        icon: MessageSquare,
        text: 'Mensagem Recebida',
        sub: 'Palavra-chave: "olá", "quero"',
      },
      { type: 'action', icon: Clock, text: 'Aguardar', sub: '1 minuto' },
      { type: 'action', icon: Zap, text: 'Enviar Template', sub: 'Template: boas_vindas_v1' },
    ],
  },
  {
    id: 2,
    name: 'Recuperação de Carrinho',
    desc: 'Dispara 2h após abandono no e-commerce integrado.',
    active: true,
    stats: '340 envios (12% conversão)',
    steps: [
      { type: 'trigger', icon: Zap, text: 'Webhook Recebido', sub: 'Evento: cart_abandoned' },
      {
        type: 'action',
        icon: MessageSquare,
        text: 'Enviar Mensagem',
        sub: '"Esqueceu algo no carrinho?"',
      },
    ],
  },
  {
    id: 3,
    name: 'Qualificação Automática (Bot)',
    desc: 'Faz 3 perguntas antes de transferir para o atendente humano.',
    active: false,
    stats: '0 envios (Pausado)',
    steps: [
      { type: 'trigger', icon: MessageSquare, text: 'Tag Adicionada', sub: 'Tag: "qualificar"' },
      { type: 'action', icon: Zap, text: 'Iniciar Fluxo Bot', sub: 'Fluxo: Lead_Qualify' },
    ],
  },
]

export default function Automacoes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automações & Bot</h1>
          <p className="text-muted-foreground mt-1">
            Crie fluxos de trabalho para automatizar seu atendimento.
          </p>
        </div>
        <Button size="lg">
          <Plus className="w-5 h-5 mr-2" /> Novo Fluxo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
        {WORKFLOWS.map((flow) => (
          <Card
            key={flow.id}
            className="flex flex-col border-muted/60 hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {flow.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch checked={flow.active} />
                </div>
              </div>
              <CardTitle className="text-lg">{flow.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{flow.desc}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-3 relative">
                {/* Visual line connecting steps */}
                <div className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-border z-0"></div>

                {flow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border
                      ${step.type === 'trigger' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-background border-border text-muted-foreground'}`}
                    >
                      {step.type === 'trigger' ? (
                        <Play className="w-3 h-3 ml-0.5" />
                      ) : (
                        <ArrowRight className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{step.text}</p>
                      <p className="text-[11px] text-muted-foreground">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t">
                <Badge
                  variant="outline"
                  className="font-normal text-xs text-muted-foreground bg-transparent"
                >
                  {flow.stats}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary h-8 px-2 hover:bg-primary/10"
                >
                  Editar Lógica
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
