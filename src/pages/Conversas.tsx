import { useEffect, useState, useRef } from 'react'
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
  Phone,
  Info,
  MessageSquare,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabase/client'

export default function Conversas() {
  const { currentUser, team } = useUser()
  const [activeTab, setActiveTab] = useState('Todos')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const attendants = team.filter((u) => u.role === 'operational')

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase
        .from('deals')
        .select('*')
        .order('updated_at', { ascending: false })
      if (data) setChats(data)
    }
    fetchChats()
    const channel = supabase
      .channel('deals_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, fetchChats)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!selectedChat) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('deal_id', selectedChat)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
    fetchMessages()
    const channel = supabase
      .channel('msgs_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `deal_id=eq.${selectedChat}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Prevent duplicated optimistic messages when realtime hits
            if (
              prev.some(
                (m) =>
                  m.id === payload.new.id ||
                  // Prevent duplication if the exact same message was sent very recently (within 30s)
                  ((m.text || '').trim() === (payload.new.text || '').trim() &&
                    m.sender_type === payload.new.sender_type &&
                    Math.abs(
                      new Date(m.created_at).getTime() - new Date(payload.new.created_at).getTime(),
                    ) < 120000),
              )
            )
              return prev
            return [...prev, payload.new]
          })
          setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedChat])

  const handleSend = async () => {
    if (!inputText.trim() || !selectedChat) return
    const text = inputText
    setInputText('')

    // Create an ID so we can match it in Realtime and avoid duplicates
    const messageId = crypto.randomUUID()

    // Optimistic UI
    const tempMsg = {
      id: messageId,
      deal_id: selectedChat,
      sender_type: 'attendant',
      sender_id: currentUser.id,
      text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    // Insert with the SAME ID we just generated so realtime ignores it safely
    await supabase
      .from('messages')
      .insert({
        id: messageId,
        deal_id: selectedChat,
        sender_type: 'attendant',
        sender_id: currentUser.id,
        text,
      })

    const { error } = await supabase.functions.invoke('evolution-send', {
      body: { deal_id: selectedChat, text },
    })
    if (error) {
      console.error('Failed to send message via Evolution:', error)
    }
  }

  const activeChatDetails = chats.find((c) => c.id === selectedChat)
  const filteredChats = chats.filter(
    (c) =>
      activeTab === 'Todos' ||
      (activeTab === 'Triagem' && c.stage === 'triage') ||
      (activeTab === 'Agendados' && c.stage === 'scheduled') ||
      (activeTab === 'Pós' && c.stage === 'post_op'),
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 md:-m-6 lg:-m-8 border rounded-xl overflow-hidden bg-background shadow-sm animate-fade-in-up">
      {/* Left Sidebar */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 flex flex-col border-r bg-muted/20',
          selectedChat ? 'hidden md:flex' : 'flex',
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Recepção de Contatos</h2>
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
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                'flex items-start gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                selectedChat === chat.id && 'bg-muted',
              )}
            >
              <Avatar>
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback>{chat.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">{chat.name}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {chat.phone || 'Novo Contato'}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Middle */}
      {selectedChat && activeChatDetails ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden -ml-2"
                onClick={() => setSelectedChat(null)}
              >
                <Search className="w-5 h-5 rotate-90" />
              </Button>
              <Avatar>
                <AvatarImage src={activeChatDetails.avatar_url} />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{activeChatDetails.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 lg:p-6 bg-[#f0f2f5] dark:bg-muted/10">
            <div className="space-y-4 max-w-3xl mx-auto pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender_type === 'user' ? 'justify-start' : 'justify-end',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm relative',
                      msg.sender_type === 'user'
                        ? 'bg-background border rounded-tl-none'
                        : 'bg-[#d9fdd3] dark:bg-primary/20 text-foreground rounded-tr-none',
                    )}
                  >
                    {msg.sender_type === 'bot' && (
                      <Bot className="w-3 h-3 absolute -left-4 top-2 text-muted-foreground" />
                    )}
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-3 lg:p-4 bg-background border-t">
            <div className="flex items-center gap-2 max-w-3xl mx-auto bg-muted/50 rounded-full pr-2 pl-4 py-1.5">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Responder como ${currentUser.name}...`}
                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-0"
              />
              <Button size="icon" onClick={handleSend} className="shrink-0 rounded-full h-9 w-9">
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-muted/10">
          <MessageSquare className="w-16 h-16 text-muted mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground">Selecione uma conversa</h3>
        </div>
      )}

      {/* Right Sidebar */}
      <div className="w-72 border-l bg-background hidden lg:flex flex-col">
        <div className="h-16 border-b flex items-center px-4">
          <h3 className="font-medium">Ficha do Paciente</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarImage src={activeChatDetails?.avatar_url} />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <h4 className="font-semibold text-lg">{activeChatDetails?.name}</h4>
            <p className="text-sm text-muted-foreground">{activeChatDetails?.phone}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Atendente Humano
              </h5>
              <Select
                value={activeChatDetails?.attendant_id || ''}
                onValueChange={(val) =>
                  supabase
                    .from('deals')
                    .update({ attendant_id: val })
                    .eq('id', activeChatDetails?.id)
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {attendants.map((att) => (
                    <SelectItem key={att.id} value={att.id}>
                      {att.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Jornada (Funil)
              </h5>
              <Select
                value={activeChatDetails?.stage || 'lead'}
                onValueChange={(val) =>
                  supabase.from('deals').update({ stage: val }).eq('id', activeChatDetails?.id)
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Novo Lead</SelectItem>
                  <SelectItem value="triage">Triagem</SelectItem>
                  <SelectItem value="scheduled">Consulta Agendada</SelectItem>
                  <SelectItem value="post_op">Pós-Procedimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
