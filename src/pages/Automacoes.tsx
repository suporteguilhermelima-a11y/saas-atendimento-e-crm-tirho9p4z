import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Activity,
  MessageSquare,
  Clock,
  ArrowRight,
  Link,
  Plus,
  CalendarDays,
  Copy,
} from 'lucide-react'

const WORKFLOWS = [
  {
    id: 1,
    name: 'Confirmação de Consulta',
    desc: 'Dispara mensagem automática via WhatsApp 24h antes da consulta médica agendada.',
    active: true,
    stats: '850 envios (95% confirmados)',
    webhook: 'https://api.laisachimello.com/wh/confirm',
    steps: [
      {
        type: 'trigger',
        icon: CalendarDays,
        text: 'Webhook Recebido',
        sub: 'Evento: consulta.proxima',
      },
      { type: 'action', icon: Clock, text: 'Aguardar', sub: 'Imediato' },
      {
        type: 'action',
        icon: MessageSquare,
        text: 'Enviar WhatsApp',
        sub: 'Template: confirmacao_v2',
      },
    ],
  },
  {
    id: 2,
    name: 'Retorno (Acompanhamento)',
    desc: 'Notifica pacientes que precisam agendar retorno médico com a Dra. Laisa Chimello.',
    active: true,
    stats: '120 envios (40% retornaram)',
    webhook: 'https://api.laisachimello.com/wh/retorno',
    steps: [
      {
        type: 'trigger',
        icon: Activity,
        text: 'Webhook Recebido',
        sub: 'Evento: paciente.retorno_vencido',
      },
      {
        type: 'action',
        icon: MessageSquare,
        text: 'Enviar WhatsApp',
        sub: 'Template: agendar_retorno',
      },
    ],
  },
  {
    id: 3,
    name: 'Lembrete de Revisão de Procedimento',
    desc: 'Alerta para revisão estética após o período determinado (ex: 15 dias pós-botox).',
    active: false,
    stats: '0 envios (Pausado)',
    webhook: 'https://api.laisachimello.com/wh/revisao',
    steps: [
      {
        type: 'trigger',
        icon: Activity,
        text: 'Webhook Recebido',
        sub: 'Evento: proc.revisao_pendente',
      },
      {
        type: 'action',
        icon: MessageSquare,
        text: 'Enviar WhatsApp',
        sub: 'Template: revisao_estetica',
      },
    ],
  },
]

export default function Automacoes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hub de Automação & Webhooks</h1>
          <p className="text-muted-foreground mt-1">
            Configure gatilhos e integrações para lembretes de consultas e pós-procedimentos.
          </p>
        </div>
        <Button size="lg">
          <Plus className="w-5 h-5 mr-2" /> Novo Fluxo Médico
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
                  <Activity className="w-5 h-5" />
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
                        <Link className="w-3 h-3 ml-0.5" />
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

              <div className="space-y-4 mt-auto pt-4 border-t">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Endpoint de Gatilho (Webhook)
                  </span>
                  <div className="bg-muted/50 rounded-md p-2 mt-1.5 flex items-center justify-between text-xs font-mono text-muted-foreground border border-border/50">
                    <span className="truncate mr-2">{flow.webhook}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 hover:bg-background"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
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
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
