import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  MessageSquare,
  Users,
  Activity,
  TrendingUp,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react'

const conversionChartData = [
  { date: '10/10', triagens: 12, agendadas: 4 },
  { date: '11/10', triagens: 15, agendadas: 6 },
  { date: '12/10', triagens: 18, agendadas: 8 },
  { date: '13/10', triagens: 14, agendadas: 5 },
  { date: '14/10', triagens: 22, agendadas: 10 },
  { date: '15/10', triagens: 20, agendadas: 9 },
  { date: '16/10', triagens: 25, agendadas: 12 },
]

const recentLeads = [
  {
    id: 1,
    name: 'Mariana Silva',
    phone: '+55 11 99999-1111',
    status: 'Novo Lead',
    time: 'Há 5 min',
  },
  {
    id: 2,
    name: 'Carlos Santos',
    phone: '+55 21 98888-2222',
    status: 'Triagem',
    time: 'Há 15 min',
  },
  {
    id: 3,
    name: 'Juliana Costa',
    phone: '+55 31 97777-3333',
    status: 'Agendada',
    time: 'Há 1 hora',
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    phone: '+55 41 96666-4444',
    status: 'Em Tratamento',
    time: 'Há 2 horas',
  },
]

export default function Index() {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ATENDIMENTO LL</h1>
        <p className="text-primary mt-2 font-medium text-lg">
          Conquiste sua melhor versão com acompanhamento médico especializado.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Painel de desempenho e volume de agendamentos da clínica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Atendimentos (Hoje)',
            value: '148',
            icon: MessageSquare,
            trend: '+12% esta semana',
          },
          { title: 'Novos Pacientes (Leads)', value: '42', icon: Users, trend: '+4% vs ontem' },
          {
            title: 'Consultas Agendadas',
            value: '28',
            icon: CalendarDays,
            trend: 'Para os próximos 7 dias',
          },
          {
            title: 'Taxa de Conversão',
            value: '42.8%',
            icon: TrendingUp,
            trend: '+5.1% este mês',
          },
        ].map((stat, i) => (
          <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className="grid gap-4 grid-cols-1 lg:grid-cols-7 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Conversão: Triagem → Consulta Agendada</CardTitle>
            <CardDescription>
              Desempenho de conversão de leads avaliados na triagem que efetivaram agendamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <p className="text-3xl font-bold text-foreground">126</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Leads em Triagem
                </p>
              </div>
              <div className="w-px bg-border my-2 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-foreground">54</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Consultas Agendadas
                </p>
              </div>
              <div className="w-px bg-border my-2 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-primary">42.8%</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Conversão Geral
                </p>
              </div>
            </div>

            <ChartContainer
              config={{
                triagens: { label: 'Em Triagem', color: 'hsl(var(--chart-1))' },
                agendadas: { label: 'Consulta Agendada', color: 'hsl(var(--chart-2))' },
              }}
              className="h-[250px] w-full"
            >
              <BarChart
                data={conversionChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="triagens" fill="var(--color-triagens)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agendadas" fill="var(--color-agendadas)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Últimos Contatos</CardTitle>
            <CardDescription>Pacientes recentes aguardando retorno da recepção.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 font-normal">
                      {lead.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{lead.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
