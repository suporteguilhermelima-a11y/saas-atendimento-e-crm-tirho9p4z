import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  MessageSquare,
  Users,
  Activity,
  TrendingUp,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react'

const conversionData = {
  all: [
    { d: '10/10', t: 12, a: 4 },
    { d: '11/10', t: 15, a: 6 },
    { d: '12/10', t: 18, a: 8 },
    { d: '13/10', t: 14, a: 5 },
    { d: '14/10', t: 22, a: 10 },
    { d: '15/10', t: 20, a: 9 },
    { d: '16/10', t: 25, a: 12 },
  ],
  laisa: [
    { d: '10/10', t: 6, a: 3 },
    { d: '11/10', t: 8, a: 4 },
    { d: '12/10', t: 10, a: 5 },
    { d: '13/10', t: 7, a: 3 },
    { d: '14/10', t: 12, a: 6 },
    { d: '15/10', t: 10, a: 5 },
    { d: '16/10', t: 14, a: 7 },
  ],
  carlos: [
    { d: '10/10', t: 4, a: 1 },
    { d: '11/10', t: 5, a: 1 },
    { d: '12/10', t: 6, a: 2 },
    { d: '13/10', t: 4, a: 1 },
    { d: '14/10', t: 6, a: 2 },
    { d: '15/10', t: 5, a: 2 },
    { d: '16/10', t: 7, a: 3 },
  ],
  ana: [
    { d: '10/10', t: 2, a: 0 },
    { d: '11/10', t: 2, a: 1 },
    { d: '12/10', t: 2, a: 1 },
    { d: '13/10', t: 3, a: 1 },
    { d: '14/10', t: 4, a: 2 },
    { d: '15/10', t: 5, a: 2 },
    { d: '16/10', t: 4, a: 2 },
  ],
}

const rankingData = [
  { id: 'laisa', name: 'Dra. Laisa Chimello', leads: 67, agendadas: 33, conv: 49.2 },
  { id: 'ana', name: 'Dra. Ana P.', leads: 22, agendadas: 9, conv: 40.9 },
  { id: 'carlos', name: 'Dr. Carlos M.', leads: 37, agendadas: 12, conv: 32.4 },
]

const recentLeads = [
  { id: 1, name: 'Mariana S.', phone: '+55 11 99999-1111', status: 'Novo Lead', time: 'Há 5 min' },
  { id: 2, name: 'Carlos S.', phone: '+55 21 98888-2222', status: 'Triagem', time: 'Há 15 min' },
  { id: 3, name: 'Juliana C.', phone: '+55 31 97777-3333', status: 'Agendada', time: 'Há 1 hora' },
]

export default function Index() {
  const [spec, setSpec] = useState('all')
  const currentChartData = conversionData[spec as keyof typeof conversionData]

  const totalTriagens = currentChartData.reduce((acc, curr) => acc + curr.t, 0)
  const totalAgendadas = currentChartData.reduce((acc, curr) => acc + curr.a, 0)
  const currentConv =
    totalTriagens > 0 ? ((totalAgendadas / totalTriagens) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Atendimento Laisa Chimello
        </h1>
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
          { title: 'Taxa de Conversão', value: '42.8%', icon: TrendingUp, trend: '+5.1% este mês' },
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <CardTitle>Conversão: Triagem → Agendamento</CardTitle>
              <CardDescription>
                Desempenho de conversão de leads avaliados na triagem.
              </CardDescription>
            </div>
            <Select value={spec} onValueChange={setSpec}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Especialista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Especialistas</SelectItem>
                <SelectItem value="laisa">Dra. Laisa Chimello</SelectItem>
                <SelectItem value="ana">Dra. Ana P.</SelectItem>
                <SelectItem value="carlos">Dr. Carlos M.</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <p className="text-3xl font-bold text-foreground">{totalTriagens}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Triagens
                </p>
              </div>
              <div className="w-px bg-border my-2 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-foreground">{totalAgendadas}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Agendadas
                </p>
              </div>
              <div className="w-px bg-border my-2 hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-primary">{currentConv}%</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Conversão
                </p>
              </div>
            </div>

            <ChartContainer
              config={{
                t: { label: 'Triagem', color: 'hsl(var(--chart-1))' },
                a: { label: 'Agendada', color: 'hsl(var(--chart-2))' },
              }}
              className="h-[250px] w-full"
            >
              <BarChart
                data={currentChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="t" fill="var(--color-t)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="a" fill="var(--color-a)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Últimos Contatos</CardTitle>
            <CardDescription>Pacientes recentes aguardando retorno da recepção.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-7">
          <CardHeader>
            <CardTitle>Ranking de Conversão da Equipe</CardTitle>
            <CardDescription>
              Comparativo de desempenho na conversão de Triagem para Consulta Agendada por
              especialista.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Especialista</TableHead>
                  <TableHead className="text-right">Leads Triados</TableHead>
                  <TableHead className="text-right">Consultas Agendadas</TableHead>
                  <TableHead className="text-right">Taxa de Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">
                          {row.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {row.name}
                    </TableCell>
                    <TableCell className="text-right">{row.leads}</TableCell>
                    <TableCell className="text-right">{row.agendadas}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {row.conv}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
