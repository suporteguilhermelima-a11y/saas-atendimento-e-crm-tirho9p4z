import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

const conversionData = {
  all: [
    { d: '10/10', t: 30, a: 15 },
    { d: '11/10', t: 35, a: 18 },
    { d: '12/10', t: 40, a: 22 },
    { d: '13/10', t: 32, a: 16 },
    { d: '14/10', t: 45, a: 25 },
    { d: '15/10', t: 42, a: 21 },
    { d: '16/10', t: 50, a: 28 },
  ],
  laisa: [
    { d: '10/10', t: 12, a: 6 },
    { d: '11/10', t: 14, a: 8 },
    { d: '12/10', t: 16, a: 9 },
    { d: '13/10', t: 10, a: 5 },
    { d: '14/10', t: 18, a: 10 },
    { d: '15/10', t: 15, a: 7 },
    { d: '16/10', t: 20, a: 11 },
  ],
  paola: [
    { d: '10/10', t: 8, a: 4 },
    { d: '11/10', t: 10, a: 5 },
    { d: '12/10', t: 12, a: 6 },
    { d: '13/10', t: 9, a: 4 },
    { d: '14/10', t: 14, a: 7 },
    { d: '15/10', t: 12, a: 6 },
    { d: '16/10', t: 15, a: 8 },
  ],
  beatriz: [
    { d: '10/10', t: 5, a: 2 },
    { d: '11/10', t: 6, a: 3 },
    { d: '12/10', t: 5, a: 3 },
    { d: '13/10', t: 4, a: 2 },
    { d: '14/10', t: 7, a: 4 },
    { d: '15/10', t: 6, a: 3 },
    { d: '16/10', t: 8, a: 4 },
  ],
  ana: [
    { d: '10/10', t: 3, a: 2 },
    { d: '11/10', t: 3, a: 1 },
    { d: '12/10', t: 4, a: 2 },
    { d: '13/10', t: 5, a: 2 },
    { d: '14/10', t: 4, a: 2 },
    { d: '15/10', t: 6, a: 3 },
    { d: '16/10', t: 5, a: 2 },
  ],
  natalia: [
    { d: '10/10', t: 2, a: 1 },
    { d: '11/10', t: 2, a: 1 },
    { d: '12/10', t: 3, a: 2 },
    { d: '13/10', t: 4, a: 3 },
    { d: '14/10', t: 2, a: 2 },
    { d: '15/10', t: 3, a: 2 },
    { d: '16/10', t: 2, a: 1 },
  ],
}

const rankingData = [
  {
    id: 'laisa',
    name: 'Dra. Laisa Chimello',
    role: 'Médica',
    leads: 105,
    agendadas: 56,
    conv: 53.3,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=24',
  },
  {
    id: 'paola',
    name: 'Dra. Paola',
    role: 'Médica',
    leads: 80,
    agendadas: 40,
    conv: 50.0,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=28',
  },
  {
    id: 'beatriz',
    name: 'Beatriz',
    role: 'Gerente',
    leads: 41,
    agendadas: 21,
    conv: 51.2,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=25',
  },
  {
    id: 'ana',
    name: 'Ana',
    role: 'Comercial',
    leads: 30,
    agendadas: 14,
    conv: 46.6,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=26',
  },
  {
    id: 'natalia',
    name: 'Natalia',
    role: 'Secretária',
    leads: 18,
    agendadas: 12,
    conv: 66.6,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=27',
  },
]

const recentLeads = [
  { id: 1, name: 'Mariana S.', phone: '+55 11 99999-1111', status: 'Novo Lead', time: 'Há 5 min' },
  { id: 2, name: 'Carlos S.', phone: '+55 21 98888-2222', status: 'Triagem', time: 'Há 15 min' },
  { id: 3, name: 'Juliana C.', phone: '+55 31 97777-3333', status: 'Agendada', time: 'Há 1 hora' },
]

const clinicalAppointments = [
  {
    id: 1,
    patient: 'Mariana Silva',
    time: '14:00',
    type: 'Avaliação Facial',
    status: 'Confirmada',
  },
  {
    id: 2,
    patient: 'Roberto Costa',
    time: '15:30',
    type: 'Revisão Pós-Botox',
    status: 'Aguardando',
  },
  {
    id: 3,
    patient: 'Ana Oliveira',
    time: '16:45',
    type: 'Protocolo de Pele',
    status: 'Confirmada',
  },
  { id: 4, patient: 'João Souza', time: '17:30', type: 'Retorno', status: 'Atrasado' },
]

export default function Index() {
  const { currentUser } = useUser()
  const [spec, setSpec] = useState('all')

  if (currentUser.role === 'operational') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fade-in">
        <Activity className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-3xl font-bold">Olá, {currentUser.name}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sua interface é otimizada para o atendimento de pacientes. Utilize o menu lateral ou
          inferior para acessar as Conversas ou o CRM e dar andamento aos leads.
        </p>
      </div>
    )
  }

  if (currentUser.role === 'clinical') {
    return (
      <div className="space-y-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Agenda Clínica - {currentUser.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Visão otimizada de agendamentos e prontuários para o corpo clínico.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes Hoje
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Próximo Atendimento
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14:00</div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Próximos Pacientes</CardTitle>
            <CardDescription>Acompanhe os próximos horários da sua agenda hoje.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinicalAppointments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.time}</TableCell>
                    <TableCell>{row.patient}</TableCell>
                    <TableCell className="text-muted-foreground">{row.type}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          row.status === 'Confirmada'
                            ? 'default'
                            : row.status === 'Aguardando'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin View
  const currentChartData = conversionData[spec as keyof typeof conversionData] || conversionData.all
  const totalTriagens = currentChartData.reduce((acc, curr) => acc + curr.t, 0)
  const totalAgendadas = currentChartData.reduce((acc, curr) => acc + curr.a, 0)
  const currentConv =
    totalTriagens > 0 ? ((totalAgendadas / totalTriagens) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Painel de Gestão - {currentUser.name}
        </h1>
        <p className="text-primary mt-2 font-medium text-lg">
          Conquiste sua melhor versão com acompanhamento médico especializado.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Visão administrativa completa do desempenho e volume de agendamentos da clínica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Atendimentos (Hoje)',
            value: '234',
            icon: MessageSquare,
            trend: '+15% esta semana',
          },
          { title: 'Novos Pacientes (Leads)', value: '68', icon: Users, trend: '+8% vs ontem' },
          {
            title: 'Consultas Agendadas',
            value: '42',
            icon: CalendarDays,
            trend: 'Para os próximos 7 dias',
          },
          { title: 'Taxa de Conversão', value: '51.2%', icon: TrendingUp, trend: '+4.5% este mês' },
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
                <SelectValue placeholder="Membro da Equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda a Equipe</SelectItem>
                <SelectItem value="laisa">Dra. Laisa Chimello</SelectItem>
                <SelectItem value="paola">Dra. Paola</SelectItem>
                <SelectItem value="beatriz">Beatriz</SelectItem>
                <SelectItem value="ana">Ana</SelectItem>
                <SelectItem value="natalia">Natalia</SelectItem>
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
              Comparativo de desempenho na conversão de Triagem para Consulta Agendada por membro da
              equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro da Equipe</TableHead>
                  <TableHead>Função</TableHead>
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
                        <AvatarImage src={row.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {row.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {row.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.role}</TableCell>
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
