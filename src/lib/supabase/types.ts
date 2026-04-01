// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      ai_agents: {
        Row: {
          created_at: string
          gemini_api_key: string | null
          id: string
          is_active: boolean
          name: string
          system_prompt: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          is_active?: boolean
          name: string
          system_prompt: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          is_active?: boolean
          name?: string
          system_prompt?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_time: string
          created_at: string
          deal_id: string | null
          id: string
          patient_name: string
          procedure_type: string
          specialist_id: string | null
          status: string
        }
        Insert: {
          appointment_time: string
          created_at?: string
          deal_id?: string | null
          id?: string
          patient_name: string
          procedure_type: string
          specialist_id?: string | null
          status?: string
        }
        Update: {
          appointment_time?: string
          created_at?: string
          deal_id?: string | null
          id?: string
          patient_name?: string
          procedure_type?: string
          specialist_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_specialist_id_fkey'
            columns: ['specialist_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      automations: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          stats: string | null
          webhook_url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          stats?: string | null
          webhook_url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          stats?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      contact_identity: {
        Row: {
          canonical_phone: string | null
          created_at: string
          display_name: string | null
          id: string
          instance_id: string | null
          lid_jid: string | null
          phone_jid: string | null
          user_id: string | null
        }
        Insert: {
          canonical_phone?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instance_id?: string | null
          lid_jid?: string | null
          phone_jid?: string | null
          user_id?: string | null
        }
        Update: {
          canonical_phone?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instance_id?: string | null
          lid_jid?: string | null
          phone_jid?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contact_identity_instance_id_fkey'
            columns: ['instance_id']
            isOneToOne: false
            referencedRelation: 'user_integrations'
            referencedColumns: ['id']
          },
        ]
      }
      deals: {
        Row: {
          attendant_id: string | null
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          procedure_name: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          attendant_id?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          procedure_name?: string | null
          stage?: string
          updated_at?: string
        }
        Update: {
          attendant_id?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          procedure_name?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_attendant_id_fkey'
            columns: ['attendant_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string | null
          id: string
          processed_items: number | null
          status: string | null
          total_items: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_items?: number | null
          status?: string | null
          total_items?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_items?: number | null
          status?: string | null
          total_items?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          data: string
          descricao: string | null
          id: string
          lead_id: string | null
          tipo: string
          user_id: string | null
        }
        Insert: {
          data?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          tipo: string
          user_id?: string | null
        }
        Update: {
          data?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          tipo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interactions_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          contato: string
          created_at: string
          created_by: string | null
          email: string | null
          empresa: string
          id: string
          origem: string | null
          segmento: string | null
          status: string
          tamanho: string | null
          telefone: string | null
        }
        Insert: {
          contato: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          empresa: string
          id?: string
          origem?: string | null
          segmento?: string | null
          status?: string
          tamanho?: string | null
          telefone?: string | null
        }
        Update: {
          contato?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          empresa?: string
          id?: string
          origem?: string | null
          segmento?: string | null
          status?: string
          tamanho?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'leads_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          is_read: boolean | null
          sender_id: string | null
          sender_type: string
          status: string | null
          text: string
          wa_message_id: string | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type: string
          status?: string | null
          text: string
          wa_message_id?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type?: string
          status?: string | null
          text?: string
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: Database['public']['Enums']['user_role']
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role?: Database['public']['Enums']['user_role']
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database['public']['Enums']['user_role']
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          created_by: string | null
          descricao: string | null
          id: string
          itens: Json | null
          lead_id: string | null
          observacoes: string | null
          status: string | null
          titulo: string
          validade: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          observacoes?: string | null
          status?: string | null
          titulo: string
          validade?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          observacoes?: string | null
          status?: string | null
          titulo?: string
          validade?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'proposals_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proposals_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      tasks: {
        Row: {
          descricao: string | null
          id: string
          lead_id: string | null
          prazo: string | null
          status: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          lead_id?: string | null
          prazo?: string | null
          status?: string | null
          titulo: string
          user_id?: string | null
        }
        Update: {
          descricao?: string | null
          id?: string
          lead_id?: string | null
          prazo?: string | null
          status?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      templates: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          created_at: string | null
          evolution_api_key: string | null
          evolution_api_url: string | null
          id: string
          instance_name: string | null
          is_setup_completed: boolean
          is_webhook_enabled: boolean
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_setup_completed?: boolean
          is_webhook_enabled?: boolean
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_setup_completed?: boolean
          is_webhook_enabled?: boolean
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          name: string | null
          role: string
        }
        Insert: {
          email?: string | null
          id: string
          name?: string | null
          role?: string
        }
        Update: {
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      whatsapp_contacts: {
        Row: {
          ai_agent_id: string | null
          ai_analysis_summary: string | null
          classification: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          phone_number: string | null
          profile_picture_url: string | null
          push_name: string | null
          remote_jid: string
          score: number | null
          user_id: string
        }
        Insert: {
          ai_agent_id?: string | null
          ai_analysis_summary?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid: string
          score?: number | null
          user_id: string
        }
        Update: {
          ai_agent_id?: string | null
          ai_analysis_summary?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_contacts_ai_agent_id_fkey'
            columns: ['ai_agent_id']
            isOneToOne: false
            referencedRelation: 'ai_agents'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          contact_id: string | null
          created_at: string | null
          from_me: boolean | null
          id: string
          message_id: string
          raw: Json | null
          text: string | null
          timestamp: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message_id: string
          raw?: Json | null
          text?: string | null
          timestamp?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message_id?: string
          raw?: Json | null
          text?: string | null
          timestamp?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_messages_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_contacts'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_or_manager: { Args: never; Returns: boolean }
      merge_whatsapp_contacts: {
        Args: {
          p_primary_contact_id: string
          p_secondary_contact_ids: string[]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: 'admin' | 'operational' | 'clinical'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ['admin', 'operational', 'clinical'],
    },
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ai_agents
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   name: text (not null)
//   system_prompt: text (not null)
//   gemini_api_key: text (nullable)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: appointments
//   id: uuid (not null, default: gen_random_uuid())
//   deal_id: uuid (nullable)
//   patient_name: text (not null)
//   appointment_time: timestamp with time zone (not null)
//   procedure_type: text (not null)
//   status: text (not null, default: 'Aguardando'::text)
//   specialist_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: automations
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   active: boolean (nullable, default: false)
//   webhook_url: text (nullable)
//   stats: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: contact_identity
//   id: uuid (not null, default: gen_random_uuid())
//   instance_id: uuid (nullable)
//   user_id: uuid (nullable)
//   canonical_phone: text (nullable)
//   phone_jid: text (nullable)
//   lid_jid: text (nullable)
//   display_name: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: deals
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   phone: text (nullable)
//   procedure_name: text (nullable)
//   stage: text (not null, default: 'lead'::text)
//   attendant_id: uuid (nullable)
//   avatar_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: import_jobs
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   type: text (not null)
//   status: text (nullable, default: 'running'::text)
//   total_items: integer (nullable, default: 0)
//   processed_items: integer (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: interactions
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (nullable)
//   user_id: uuid (nullable, default: auth.uid())
//   tipo: text (not null)
//   descricao: text (nullable)
//   data: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   empresa: text (not null)
//   contato: text (not null)
//   email: text (nullable)
//   telefone: text (nullable)
//   segmento: text (nullable)
//   tamanho: text (nullable)
//   origem: text (nullable)
//   status: text (not null, default: 'Novo Lead'::text)
//   created_by: uuid (nullable, default: auth.uid())
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: messages
//   id: uuid (not null, default: gen_random_uuid())
//   deal_id: uuid (not null)
//   sender_type: text (not null)
//   sender_id: uuid (nullable)
//   text: text (not null)
//   is_read: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'sent'::text)
//   wa_message_id: text (nullable)
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   role: user_role (not null, default: 'operational'::user_role)
//   avatar_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: proposals
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (nullable)
//   titulo: text (not null)
//   valor: numeric (nullable)
//   status: text (nullable, default: 'draft'::text)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
//   created_by: uuid (nullable, default: auth.uid())
//   descricao: text (nullable)
//   observacoes: text (nullable)
//   validade: timestamp with time zone (nullable)
//   itens: jsonb (nullable, default: '[]'::jsonb)
// Table: tasks
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (nullable)
//   user_id: uuid (nullable, default: auth.uid())
//   titulo: text (not null)
//   descricao: text (nullable)
//   prazo: timestamp with time zone (nullable)
//   status: text (nullable, default: 'pending'::text)
// Table: templates
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   category: text (not null)
//   content: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: user_integrations
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   evolution_api_url: text (nullable)
//   evolution_api_key: text (nullable)
//   instance_name: text (nullable)
//   status: text (nullable, default: 'DISCONNECTED'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   is_setup_completed: boolean (not null, default: false)
//   is_webhook_enabled: boolean (not null, default: false)
// Table: users
//   id: uuid (not null)
//   role: text (not null, default: 'vendedor'::text)
//   email: text (nullable)
//   name: text (nullable)
// Table: whatsapp_contacts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   remote_jid: text (not null)
//   push_name: text (nullable)
//   profile_picture_url: text (nullable)
//   last_message_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   classification: text (nullable)
//   score: integer (nullable, default: 0)
//   ai_analysis_summary: text (nullable)
//   phone_number: text (nullable)
//   ai_agent_id: uuid (nullable)
// Table: whatsapp_messages
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   contact_id: uuid (nullable)
//   message_id: text (not null)
//   from_me: boolean (nullable, default: false)
//   text: text (nullable)
//   type: text (nullable)
//   timestamp: timestamp with time zone (nullable)
//   raw: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: ai_agents
//   PRIMARY KEY ai_agents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY ai_agents_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: appointments
//   FOREIGN KEY appointments_deal_id_fkey: FOREIGN KEY (deal_id) REFERENCES deals(id)
//   PRIMARY KEY appointments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY appointments_specialist_id_fkey: FOREIGN KEY (specialist_id) REFERENCES profiles(id)
// Table: automations
//   PRIMARY KEY automations_pkey: PRIMARY KEY (id)
// Table: contact_identity
//   FOREIGN KEY contact_identity_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES user_integrations(id) ON DELETE CASCADE
//   PRIMARY KEY contact_identity_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contact_identity_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: deals
//   FOREIGN KEY deals_attendant_id_fkey: FOREIGN KEY (attendant_id) REFERENCES profiles(id)
//   PRIMARY KEY deals_pkey: PRIMARY KEY (id)
// Table: import_jobs
//   PRIMARY KEY import_jobs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY import_jobs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: interactions
//   FOREIGN KEY interactions_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY interactions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY interactions_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)
// Table: leads
//   FOREIGN KEY leads_created_by_fkey: FOREIGN KEY (created_by) REFERENCES users(id)
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
// Table: messages
//   FOREIGN KEY messages_deal_id_fkey: FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
//   PRIMARY KEY messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY messages_sender_id_fkey: FOREIGN KEY (sender_id) REFERENCES profiles(id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: proposals
//   FOREIGN KEY proposals_created_by_fkey: FOREIGN KEY (created_by) REFERENCES users(id)
//   FOREIGN KEY proposals_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY proposals_pkey: PRIMARY KEY (id)
// Table: tasks
//   FOREIGN KEY tasks_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY tasks_pkey: PRIMARY KEY (id)
//   FOREIGN KEY tasks_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)
// Table: templates
//   PRIMARY KEY templates_pkey: PRIMARY KEY (id)
// Table: user_integrations
//   PRIMARY KEY user_integrations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_integrations_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_integrations_user_id_key: UNIQUE (user_id)
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
//   CHECK users_role_check: CHECK ((role = ANY (ARRAY['vendedor'::text, 'gerente'::text, 'admin'::text])))
// Table: whatsapp_contacts
//   FOREIGN KEY whatsapp_contacts_ai_agent_id_fkey: FOREIGN KEY (ai_agent_id) REFERENCES ai_agents(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_contacts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_contacts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE whatsapp_contacts_user_id_remote_jid_key: UNIQUE (user_id, remote_jid)
// Table: whatsapp_messages
//   FOREIGN KEY whatsapp_messages_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE CASCADE
//   PRIMARY KEY whatsapp_messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_messages_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE whatsapp_messages_user_id_message_id_key: UNIQUE (user_id, message_id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_agents
//   Policy "Users can manage their own ai agents" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: appointments
//   Policy "allow_all_appointments" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: automations
//   Policy "allow_all_automations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contact_identity
//   Policy "Users can manage their own contact identities" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: deals
//   Policy "allow_all_deals" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: import_jobs
//   Policy "Users can manage their own import jobs" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: interactions
//   Policy "Admins and Managers manage all interactions" (ALL, PERMISSIVE) roles={public}
//     USING: is_admin_or_manager()
//   Policy "Vendedores manage own interactions" (ALL, PERMISSIVE) roles={public}
//     USING: (user_id = auth.uid())
// Table: leads
//   Policy "Admins and Managers manage all leads" (ALL, PERMISSIVE) roles={public}
//     USING: is_admin_or_manager()
//   Policy "Vendedores delete own leads" (DELETE, PERMISSIVE) roles={public}
//     USING: (created_by = auth.uid())
//   Policy "Vendedores insert own leads" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (created_by = auth.uid())
//   Policy "Vendedores update own leads" (UPDATE, PERMISSIVE) roles={public}
//     USING: (created_by = auth.uid())
//   Policy "Vendedores view own leads" (SELECT, PERMISSIVE) roles={public}
//     USING: (created_by = auth.uid())
// Table: messages
//   Policy "allow_all_messages" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profiles
//   Policy "allow_all_profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: proposals
//   Policy "Admins and Managers manage all proposals" (ALL, PERMISSIVE) roles={public}
//     USING: is_admin_or_manager()
//   Policy "Users can delete their own proposals" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = created_by)
//   Policy "Users can insert their own proposals" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = created_by)
//   Policy "Users can update their own proposals" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = created_by)
//   Policy "Users can view all proposals" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Vendedores manage own proposals" (ALL, PERMISSIVE) roles={public}
//     USING: (created_by = auth.uid())
// Table: tasks
//   Policy "Admins and Managers manage all tasks" (ALL, PERMISSIVE) roles={public}
//     USING: is_admin_or_manager()
//   Policy "Vendedores manage own tasks" (ALL, PERMISSIVE) roles={public}
//     USING: (user_id = auth.uid())
// Table: templates
//   Policy "allow_all_templates" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: user_integrations
//   Policy "Users can manage their own integrations" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: users
//   Policy "Admins and Managers can view all profiles" (SELECT, PERMISSIVE) roles={public}
//     USING: is_admin_or_manager()
//   Policy "Admins can delete users" (DELETE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM users users_1   WHERE ((users_1.id = auth.uid()) AND (users_1.role = 'admin'::text))))
//   Policy "Admins can update users" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM users users_1   WHERE ((users_1.id = auth.uid()) AND (users_1.role = 'admin'::text))))
//   Policy "Users can view own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: whatsapp_contacts
//   Policy "Users can manage their own contacts" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: whatsapp_messages
//   Policy "Users can manage their own messages" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.users (id, role, email, name)
//     VALUES (
//       NEW.id,
//       'vendedor',
//       NEW.email,
//       NEW.raw_user_meta_data->>'name'
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION is_admin_or_manager()
//   CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     current_user_id uuid;
//   BEGIN
//     -- Get current user ID safely from the JWT claim
//     current_user_id := nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
//
//     -- If no user is logged in, return false
//     IF current_user_id IS NULL THEN
//       RETURN FALSE;
//     END IF;
//
//     -- Check role in users table
//     -- Since this function is SECURITY DEFINER, it runs with the privileges of the owner (postgres),
//     -- bypassing the RLS on the 'users' table which caused the recursion loop.
//     RETURN EXISTS (
//       SELECT 1 FROM users
//       WHERE id = current_user_id
//       AND role IN ('admin', 'gerente')
//     );
//   END;
//   $function$
//
// FUNCTION merge_whatsapp_contacts(uuid, uuid, uuid[])
//   CREATE OR REPLACE FUNCTION public.merge_whatsapp_contacts(p_user_id uuid, p_primary_contact_id uuid, p_secondary_contact_ids uuid[])
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       -- Re-assign messages to the primary contact
//       UPDATE public.whatsapp_messages
//       SET contact_id = p_primary_contact_id
//       WHERE user_id = p_user_id
//         AND contact_id = ANY(p_secondary_contact_ids);
//
//       -- Delete the secondary duplicate contacts
//       DELETE FROM public.whatsapp_contacts
//       WHERE user_id = p_user_id
//         AND id = ANY(p_secondary_contact_ids);
//   END;
//   $function$
//
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION sync_user_details()
//   CREATE OR REPLACE FUNCTION public.sync_user_details()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.users
//     SET email = NEW.email,
//         name = NEW.raw_user_meta_data->>'name'
//     WHERE id = NEW.id;
//     RETURN NEW;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: user_integrations
//   CREATE UNIQUE INDEX user_integrations_user_id_key ON public.user_integrations USING btree (user_id)
// Table: whatsapp_contacts
//   CREATE INDEX whatsapp_contacts_phone_number_idx ON public.whatsapp_contacts USING btree (user_id, phone_number)
//   CREATE UNIQUE INDEX whatsapp_contacts_user_id_remote_jid_key ON public.whatsapp_contacts USING btree (user_id, remote_jid)
// Table: whatsapp_messages
//   CREATE UNIQUE INDEX whatsapp_messages_user_id_message_id_key ON public.whatsapp_messages USING btree (user_id, message_id)
