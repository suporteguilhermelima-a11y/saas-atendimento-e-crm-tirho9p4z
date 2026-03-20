import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Users,
  Activity,
  TrendingUp,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react'

const chartData = [
  { date: '01/10', triagens: 40, consultas: 24 },
  { date: '02/10', triagens: 30, consultas: 13 },
  { date: '03/10', triagens: 20, consultas: 18 },
  { date: '04/10', triagens: 27, consultas: 39 },
  { date: '05/10', triagens: 18, consultas: 28 },
  { date: '06/10', triagens: 23, consultas: 38 },
  { date: '07/10', triagens: 34, consultas: 43 },
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel da Clínica</h1>
        <p className="text-primary mt-2 font-medium text-lg">
          Conquiste sua melhor versão com acompanhamento médico especializado.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Visão geral do volume de atendimentos e agendamentos de pacientes.
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
            title: 'Taxa de Conversão (Agendamentos)',
            value: '32.4%',
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
            <CardTitle>Volume de Atendimentos vs Agendamentos</CardTitle>
            <CardDescription>
              Comparativo de leads em triagem e consultas efetivadas nos últimos 7 dias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                triagens: { label: 'Em Triagem', color: 'hsl(var(--chart-1))' },
                consultas: { label: 'Consultas Agendadas', color: 'hsl(var(--chart-2))' },
              }}
              className="h-[300px]"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTriagens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-triagens)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-triagens)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-consultas)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-consultas)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="triagens"
                  stroke="var(--color-triagens)"
                  fillOpacity={1}
                  fill="url(#colorTriagens)"
                />
                <Area
                  type="monotone"
                  dataKey="consultas"
                  stroke="var(--color-consultas)"
                  fillOpacity={1}
                  fill="url(#colorConsultas)"
                />
              </AreaChart>
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
