import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Layers,
  Activity,
  Settings,
  Search,
  Bell,
  Menu,
  FileText,
  UserCircle,
} from 'lucide-react'
import { useUser, TEAM, Role } from '@/contexts/UserContext'

type NavItem = {
  title: string
  url: string
  icon: any
  badge?: string
  roles: Role[]
}

const navItems: NavItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, roles: ['admin', 'clinical'] },
  {
    title: 'Atendimento',
    url: '/conversas',
    icon: MessageSquare,
    badge: '5',
    roles: ['admin', 'operational'],
  },
  {
    title: 'Jornada do Paciente',
    url: '/crm',
    icon: Layers,
    roles: ['admin', 'operational', 'clinical'],
  },
  {
    title: 'Pacientes',
    url: '/contatos',
    icon: Users,
    roles: ['admin', 'operational', 'clinical'],
  },
  { title: 'Templates', url: '/templates', icon: FileText, roles: ['admin', 'operational'] },
  { title: 'Automações', url: '/automacoes', icon: Activity, roles: ['admin'] },
  { title: 'Configurações', url: '/configuracoes', icon: Settings, roles: ['admin'] },
]

const bottomNavItems = [
  { title: 'Home', url: '/', icon: LayoutDashboard, roles: ['admin', 'clinical'] },
  {
    title: 'Chat',
    url: '/conversas',
    icon: MessageSquare,
    badge: '5',
    roles: ['admin', 'operational'],
  },
  { title: 'CRM', url: '/crm', icon: Layers, roles: ['admin', 'operational', 'clinical'] },
  { title: 'Auto', url: '/automacoes', icon: Activity, roles: ['admin'] },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useUser()

  const navItemsFiltered = navItems.filter((item) => item.roles.includes(currentUser.role))
  const bottomNavItemsFiltered = bottomNavItems.filter((item) =>
    item.roles.includes(currentUser.role),
  )

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="hidden md:flex">
        <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
          <div className="flex items-center gap-2 font-bold text-lg text-primary w-full">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Activity className="w-5 h-5 fill-current" />
            </div>
            <span className="truncate tracking-tight">Atendimento Laisa C.</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {navItemsFiltered.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6 z-10 sticky top-0">
          <div className="md:hidden flex items-center gap-2 font-bold text-sm text-primary mr-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <Activity className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <SidebarTrigger className="-ml-1" />
          </div>

          <div className="flex flex-1 items-center justify-between ml-auto md:ml-0">
            <div className="hidden md:flex items-center w-full max-w-sm relative ml-4">
              <Search className="absolute left-2.5 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Buscar pacientes, prontuários..."
                className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1 shadow-none h-9"
              />
            </div>

            <div className="flex items-center gap-3 md:gap-4 ml-auto">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50/50 border border-green-100 text-green-700 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Recepção Online
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} alt="Avatar" />
                      <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.title}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                    <UserCircle className="w-3 h-3" /> Alterar Visão (Demo)
                  </DropdownMenuLabel>
                  {TEAM.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u)
                        if (u.role === 'operational' && location.pathname === '/') {
                          navigate('/conversas')
                        }
                      }}
                      className={currentUser.id === u.id ? 'bg-muted' : ''}
                    >
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>{u.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{u.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{u.role}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil Profissional</DropdownMenuItem>
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem>Configurações da Clínica</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <SidebarTrigger>
                  <Menu className="w-6 h-6 text-foreground" />
                </SidebarTrigger>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 animate-fade-in pb-20 md:pb-8">
          <Outlet />
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around px-2 z-50 pb-safe">
          {bottomNavItemsFiltered.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-1 font-medium border-2 border-background">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SidebarInset>
    </SidebarProvider>
  )
}
