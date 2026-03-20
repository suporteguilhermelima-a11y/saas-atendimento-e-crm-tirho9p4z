import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Bot,
  CheckCheck,
  MoreVertical,
  Phone,
  Info,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CHATS = [
  {
    id: 1,
    name: 'Mariana Silva',
    msg: 'Gostaria de agendar uma avaliação...',
    time: '10:42',
    unread: 2,
    status: 'Novo Lead',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  {
    id: 2,
    name: 'Carlos Santos',
    msg: 'Qual o valor da consulta?',
    time: '09:15',
    unread: 0,
    status: 'Triagem',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
  },
  {
    id: 3,
    name: 'Ana Oliveira',
    msg: 'Obrigada pelo retorno da receita!',
    time: 'Ontem',
    unread: 0,
    status: 'Pós-Procedimento',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
  },
]

const MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Olá! Bem-vindo ao Atendimento Laisa Chimello. Especialistas em sua melhor versão. Como podemos te ajudar hoje?',
    time: '10:40',
    isBot: true,
  },
  { id: 2, sender: 'user', text: 'Gostaria de agendar uma avaliação facial.', time: '10:41' },
  {
    id: 3,
    sender: 'bot',
    text: 'Perfeito! Estamos transferindo você para nossa recepção.',
    time: '10:41',
    isBot: true,
  },
  { id: 4, sender: 'user', text: 'Ok, no aguardo.', time: '10:42' },
]

export default function Conversas() {
  const [activeTab, setActiveTab] = useState('Todos')
  const [selectedChat, setSelectedChat] = useState<number | null>(1)

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 md:-m-6 lg:-m-8 border rounded-xl overflow-hidden bg-background shadow-sm animate-fade-in-up">
      {/* Left Sidebar - Chat List */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 flex flex-col border-r bg-muted/20',
          selectedChat ? 'hidden md:flex' : 'flex',
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Recepção de Contatos</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar pacientes..." className="pl-9 bg-background" />
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 hide-scrollbar">
            {['Todos', 'Triagem', 'Agendados', 'Pós'].map((tab) => (
              <Badge
                key={tab}
                variant={activeTab === tab ? 'default' : 'secondary'}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Badge>
            ))}
          </div>
        </div>
        <ScrollArea className="flex-1">
          {CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                'flex items-start gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                selectedChat === chat.id && 'bg-muted',
              )}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">{chat.name}</span>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{chat.msg}</div>
              </div>
              {chat.unread > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium shrink-0">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Middle - Active Chat */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden -ml-2"
                onClick={() => setSelectedChat(null)}
              >
                <Search className="w-5 h-5 rotate-90" /> {/* Simulating back arrow */}
              </Button>
              <Avatar>
                <AvatarImage src={CHATS.find((c) => c.id === selectedChat)?.avatar} />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">
                  {CHATS.find((c) => c.id === selectedChat)?.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Info className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 lg:p-6 bg-[#f0f2f5] dark:bg-muted/10">
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex justify-center">
                <span className="text-xs bg-background/80 px-3 py-1 rounded-full text-muted-foreground shadow-sm">
                  Hoje
                </span>
              </div>
              {MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.sender === 'user' ? 'justify-start' : 'justify-end')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm relative',
                      msg.sender === 'user'
                        ? 'bg-background border rounded-tl-none'
                        : 'bg-[#d9fdd3] dark:bg-primary/20 text-foreground rounded-tr-none',
                    )}
                  >
                    {msg.isBot && (
                      <Bot className="w-3 h-3 absolute -left-4 top-2 text-muted-foreground" />
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-muted-foreground/80">{msg.time}</span>
                      {msg.sender !== 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 lg:p-4 bg-background border-t">
            <div className="flex items-center gap-2 max-w-3xl mx-auto bg-muted/50 rounded-full pr-2 pl-4 py-1.5 focus-within:ring-1 focus-within:ring-primary transition-shadow">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
              >
                <Smile className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Digite sua mensagem de retorno..."
                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-0"
              />
              <Button size="icon" className="shrink-0 rounded-full h-9 w-9">
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-muted/10">
          <MessageSquare className="w-16 h-16 text-muted mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground">Selecione uma conversa</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Escolha um paciente na lista ao lado para iniciar o atendimento.
          </p>
        </div>
      )}

      {/* Right Sidebar - Contact Info */}
      <div className="w-72 border-l bg-background hidden lg:flex flex-col">
        <div className="h-16 border-b flex items-center px-4">
          <h3 className="font-medium">Ficha do Paciente</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarImage src={CHATS.find((c) => c.id === selectedChat)?.avatar} />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <h4 className="font-semibold text-lg">
              {CHATS.find((c) => c.id === selectedChat)?.name}
            </h4>
            <p className="text-sm text-muted-foreground">+55 11 99999-1111</p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Etiqueta Médica
              </h5>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"
                >
                  Avaliação
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none"
                >
                  Botox
                </Badge>
                <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                  +
                </Button>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Jornada (Funil)
              </h5>
              <select
                defaultValue="triage"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="lead">Novo Lead</option>
                <option value="triage">Triagem</option>
                <option value="scheduled">Consulta Agendada</option>
                <option value="treatment">Em Tratamento</option>
                <option value="post_op">Pós-Procedimento</option>
              </select>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Observações Clínicas
              </h5>
              <textarea
                className="w-full text-sm border rounded-md px-3 py-2 bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary resize-none min-h-[100px]"
                placeholder="Adicione notas sobre o histórico do paciente..."
                defaultValue="Paciente relata interesse em rejuvenescimento facial. Sem alergias conhecidas."
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
