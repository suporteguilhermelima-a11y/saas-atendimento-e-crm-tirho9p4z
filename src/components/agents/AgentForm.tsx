import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { AIAgent, AIAgentInsert } from '@/services/ai_agents'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const agentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  system_prompt: z.string().min(1, 'Instruções da IA são obrigatórias'),
  gemini_api_key: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

type AgentFormValues = z.infer<typeof agentSchema>

interface AgentFormProps {
  initialData?: AIAgent | null
  onSubmit: (data: AIAgentInsert) => Promise<void>
  isLoading?: boolean
}

export function AgentForm({ initialData, onSubmit, isLoading }: AgentFormProps) {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: initialData?.name || '',
      system_prompt: initialData?.system_prompt || '',
      gemini_api_key: initialData?.gemini_api_key || '',
      is_active: initialData?.is_active ?? true,
    },
  })

  const handleSubmit = async (values: AgentFormValues) => {
    const payload = {
      ...values,
      gemini_api_key: values.gemini_api_key?.trim() || null,
    }
    await onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Bot</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Bot de Vendas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="system_prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções (System Prompt)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Você é um assistente de vendas da clínica. Seja educado, tire dúvidas sobre procedimentos e agende consultas..."
                  className="min-h-[150px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Defina a personalidade, as regras e o conhecimento do seu bot.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gemini_api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave da API Gemini (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Se deixado em branco, o bot usará a chave padrão do sistema (se disponível).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">Bot Ativo</FormLabel>
                <FormDescription>
                  Quando ativo, o bot responderá automaticamente às mensagens recebidas.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Bot'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
