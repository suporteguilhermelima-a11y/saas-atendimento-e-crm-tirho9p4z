import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Search, Copy, Check, FileText, Plus } from 'lucide-react'

const TEMPLATES = [
  {
    id: 1,
    title: 'Confirmação de Consulta - Padrão',
    category: 'Confirmação de Consulta',
    content:
      'Olá, {nome_paciente}!\n\nPassando para confirmar sua consulta com a {especialista} amanhã, {data}, às {hora}.\n\nPor favor, responda com "SIM" para confirmar ou "NÃO" para reagendar.',
  },
  {
    id: 2,
    title: 'Lembrete de Retorno Mensal',
    category: 'Lembrete de Retorno',
    content:
      'Olá, {nome_paciente}!\n\nJá faz um tempinho desde a sua última visita à ATENDIMENTO LL. Que tal agendarmos seu retorno para acompanhamento do tratamento?\n\nPodemos marcar para a próxima semana?',
  },
  {
    id: 3,
    title: 'Revisão Pós-Botox (15 dias)',
    category: 'Revisão de Procedimento',
    content:
      'Oi, {nome_paciente}!\n\nHoje completamos 15 dias do seu procedimento de Botox. Como estão os resultados? Para garantirmos o efeito perfeito, gostaríamos de agendar sua consulta de revisão.\n\nQual o melhor horário para você?',
  },
  {
    id: 4,
    title: 'Boas-vindas - Novo Lead',
    category: 'Boas-vindas',
    content:
      'Olá! Bem-vindo(a) à ATENDIMENTO LL.\n\nSomos especialistas em realçar sua melhor versão. Como podemos te ajudar hoje? Você gostaria de agendar uma avaliação?',
  },
  {
    id: 5,
    title: 'Pré-Procedimento de Pele',
    category: 'Confirmação de Consulta',
    content:
      'Olá, {nome_paciente}!\n\nSua sessão de limpeza de pele profunda é amanhã às {hora}. Lembre-se de não usar ácidos esta noite e vir com o rosto livre de maquiagem pesada.\n\nNos vemos em breve!',
  },
]

const CATEGORIES = [
  'Todas',
  'Confirmação de Consulta',
  'Lembrete de Retorno',
  'Revisão de Procedimento',
  'Boas-vindas',
]

export default function Templates() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: 'Mensagem Copiada',
      description: 'O template foi copiado para a área de transferência.',
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'Todas' || t.category === activeCategory
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6 flex flex-col h-full animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates de Mensagem</h1>
          <p className="text-muted-foreground mt-1">
            Biblioteca de respostas padronizadas para agilizar a comunicação via WhatsApp.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Novo Template
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou palavra-chave..."
            className="pl-9 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'secondary'}
              className="cursor-pointer whitespace-nowrap text-sm py-1.5"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="flex flex-col group hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {template.category}
                </Badge>
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground whitespace-pre-wrap font-mono relative">
                {template.content}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t mt-auto">
              <Button
                variant="ghost"
                className={`w-full justify-between hover:bg-primary/10 hover:text-primary ${copiedId === template.id ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : ''}`}
                onClick={() => handleCopy(template.id, template.content)}
              >
                <span>{copiedId === template.id ? 'Copiado!' : 'Copiar Mensagem'}</span>
                {copiedId === template.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum template encontrado</p>
            <p className="text-sm">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  )
}
