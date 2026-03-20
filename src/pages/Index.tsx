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
import { MessageSquare, Users, Zap, TrendingUp, ArrowUpRight } from 'lucide-react'

const chartData = [
  { date: '01/10', recebidas: 400, enviadas: 240 },
  { date: '02/10', recebidas: 300, enviadas: 139 },
  { date: '03/10', recebidas: 200, enviadas: 980 },
  { date: '04/10', recebidas: 278, enviadas: 390 },
  { date: '05/10', recebidas: 189, enviadas: 480 },
  { date: '06/10', recebidas: 239, enviadas: 380 },
  { date: '07/10', recebidas: 349, enviadas: 430 },
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
    status: 'Em Atendimento',
    time: 'Há 15 min',
  },
  {
    id: 3,
    name: 'Empresa X (João)',
    phone: '+55 31 97777-3333',
    status: 'Qualificado',
    time: 'Há 1 hora',
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    phone: '+55 41 96666-4444',
    status: 'Novo Lead',
    time: 'Há 2 horas',
  },
]

export default function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu atendimento e vendas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total de Conversas',
            value: '1.248',
            icon: MessageSquare,
            trend: '+12% esta semana',
          },
          { title: 'Novos Leads (Hoje)', value: '42', icon: Users, trend: '+4% vs ontem' },
          { title: 'Automações Ativas', value: '12', icon: Zap, trend: '89% de sucesso' },
          { title: 'Taxa de Conversão', value: '18.4%', icon: TrendingUp, trend: '+2.1% este mês' },
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
            <CardTitle>Volume de Mensagens</CardTitle>
            <CardDescription>
              Comparativo de mensagens enviadas e recebidas nos últimos 7 dias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                recebidas: { label: 'Recebidas', color: 'hsl(var(--chart-1))' },
                enviadas: { label: 'Enviadas', color: 'hsl(var(--chart-2))' },
              }}
              className="h-[300px]"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecebidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-recebidas)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-recebidas)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnviadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-enviadas)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-enviadas)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="recebidas"
                  stroke="var(--color-recebidas)"
                  fillOpacity={1}
                  fill="url(#colorRecebidas)"
                />
                <Area
                  type="monotone"
                  dataKey="enviadas"
                  stroke="var(--color-enviadas)"
                  fillOpacity={1}
                  fill="url(#colorEnviadas)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Últimos contatos capturados via WhatsApp.</CardDescription>
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
