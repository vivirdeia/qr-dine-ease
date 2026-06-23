export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      automation_run_logs: {
        Row: {
          action_type: string | null
          created_at: string
          detail: Json
          id: string
          node_id: string | null
          run_id: string
          status: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          detail?: Json
          id?: string
          node_id?: string | null
          run_id: string
          status: string
        }
        Update: {
          action_type?: string | null
          created_at?: string
          detail?: Json
          id?: string
          node_id?: string | null
          run_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_run_logs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "automation_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          automation_id: string
          cancel_reason: string | null
          context: Json
          created_at: string
          current_node_id: string | null
          finished_at: string | null
          id: string
          last_error: string | null
          lead_id: string
          locked_at: string | null
          next_run_at: string
          retries: number
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          automation_id: string
          cancel_reason?: string | null
          context?: Json
          created_at?: string
          current_node_id?: string | null
          finished_at?: string | null
          id?: string
          last_error?: string | null
          lead_id: string
          locked_at?: string | null
          next_run_at?: string
          retries?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          automation_id?: string
          cancel_reason?: string | null
          context?: Json
          created_at?: string
          current_node_id?: string | null
          finished_at?: string | null
          id?: string
          last_error?: string | null
          lead_id?: string
          locked_at?: string | null
          next_run_at?: string
          retries?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          cancel_on_reply: boolean
          created_at: string
          created_by: string | null
          description: string | null
          graph: Json
          id: string
          name: string
          quiet_hours: Json
          status: string
          trigger_config: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          cancel_on_reply?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          graph?: Json
          id?: string
          name: string
          quiet_hours?: Json
          status?: string
          trigger_config?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          cancel_on_reply?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          graph?: Json
          id?: string
          name?: string
          quiet_hours?: Json
          status?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      deletion_log: {
        Row: {
          created_at: string
          deleted_by: string | null
          deleted_by_email: string | null
          files_removed: number
          id: string
          lead_email_hash: string | null
          lead_id: string
          reason: string | null
          wa_messages_removed: number
        }
        Insert: {
          created_at?: string
          deleted_by?: string | null
          deleted_by_email?: string | null
          files_removed?: number
          id?: string
          lead_email_hash?: string | null
          lead_id: string
          reason?: string | null
          wa_messages_removed?: number
        }
        Update: {
          created_at?: string
          deleted_by?: string | null
          deleted_by_email?: string | null
          files_removed?: number
          id?: string
          lead_email_hash?: string | null
          lead_id?: string
          reason?: string | null
          wa_messages_removed?: number
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      lead_answers: {
        Row: {
          answers: Json
          created_at: string
          form_key: string
          id: string
          lead_id: string
          quiz_version: string | null
          score: number | null
        }
        Insert: {
          answers: Json
          created_at?: string
          form_key: string
          id?: string
          lead_id: string
          quiz_version?: string | null
          score?: number | null
        }
        Update: {
          answers?: Json
          created_at?: string
          form_key?: string
          id?: string
          lead_id?: string
          quiz_version?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_answers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          lead_id: string
          payload: Json | null
          type: string
          utm: Json | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          lead_id: string
          payload?: Json | null
          type: string
          utm?: Json | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          lead_id?: string
          payload?: Json | null
          type?: string
          utm?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_files: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          kind: string
          lead_id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          kind?: string
          lead_id: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          kind?: string
          lead_id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_files_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_stage_history: {
        Row: {
          created_at: string
          from_stage_id: string | null
          id: string
          lead_id: string
          moved_by: string | null
          to_stage_id: string | null
        }
        Insert: {
          created_at?: string
          from_stage_id?: string | null
          id?: string
          lead_id: string
          moved_by?: string | null
          to_stage_id?: string | null
        }
        Update: {
          created_at?: string
          from_stage_id?: string | null
          id?: string
          lead_id?: string
          moved_by?: string | null
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_stage_history_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_stage_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_stage_history_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          consent: boolean | null
          consent_at: string | null
          created_at: string
          disqualified: boolean
          disqualify_reason: string | null
          email: string | null
          fbc: string | null
          fbclid: string | null
          fbp: string | null
          first_landing_page: string | null
          first_utm: Json | null
          full_name: string | null
          gclid: string | null
          id: string
          ip_hash: string | null
          last_utm: Json | null
          phone: string | null
          phone_prefix: string | null
          programa: string | null
          referrer: string | null
          source_form: string | null
          stage_id: string | null
          status: string
          updated_at: string
          user_agent: string | null
          vacante_interes: string | null
        }
        Insert: {
          assigned_to?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          disqualified?: boolean
          disqualify_reason?: string | null
          email?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_landing_page?: string | null
          first_utm?: Json | null
          full_name?: string | null
          gclid?: string | null
          id?: string
          ip_hash?: string | null
          last_utm?: Json | null
          phone?: string | null
          phone_prefix?: string | null
          programa?: string | null
          referrer?: string | null
          source_form?: string | null
          stage_id?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          vacante_interes?: string | null
        }
        Update: {
          assigned_to?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          disqualified?: boolean
          disqualify_reason?: string | null
          email?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          first_landing_page?: string | null
          first_utm?: Json | null
          full_name?: string | null
          gclid?: string | null
          id?: string
          ip_hash?: string | null
          last_utm?: Json | null
          phone?: string | null
          phone_prefix?: string | null
          programa?: string | null
          referrer?: string | null
          source_form?: string | null
          stage_id?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          vacante_interes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          is_terminal: boolean
          is_won: boolean
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_terminal?: boolean
          is_won?: boolean
          name: string
          position: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_terminal?: boolean
          is_won?: boolean
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wa_conversations: {
        Row: {
          ai_enabled: boolean
          assigned_to: string | null
          created_at: string
          id: string
          last_inbound_at: string | null
          last_message_at: string | null
          lead_id: string | null
          phone_normalized: string
          profile_name: string | null
          status: string
          unread_count: number
          updated_at: string
          wa_id: string | null
        }
        Insert: {
          ai_enabled?: boolean
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_inbound_at?: string | null
          last_message_at?: string | null
          lead_id?: string | null
          phone_normalized: string
          profile_name?: string | null
          status?: string
          unread_count?: number
          updated_at?: string
          wa_id?: string | null
        }
        Update: {
          ai_enabled?: boolean
          assigned_to?: string | null
          created_at?: string
          id?: string
          last_inbound_at?: string | null
          last_message_at?: string | null
          lead_id?: string | null
          phone_normalized?: string
          profile_name?: string | null
          status?: string
          unread_count?: number
          updated_at?: string
          wa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wa_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          direction: string
          error: string | null
          id: string
          media_mime: string | null
          media_path: string | null
          media_size: number | null
          sent_by: string | null
          status: string
          transcription: string | null
          transcription_status: string | null
          type: string
          wa_message_id: string | null
          wa_timestamp: string | null
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          direction: string
          error?: string | null
          id?: string
          media_mime?: string | null
          media_path?: string | null
          media_size?: number | null
          sent_by?: string | null
          status?: string
          transcription?: string | null
          transcription_status?: string | null
          type: string
          wa_message_id?: string | null
          wa_timestamp?: string | null
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          direction?: string
          error?: string | null
          id?: string
          media_mime?: string | null
          media_path?: string | null
          media_size?: number | null
          sent_by?: string | null
          status?: string
          transcription?: string | null
          transcription_status?: string | null
          type?: string
          wa_message_id?: string | null
          wa_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wa_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "wa_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analytics_attribution: {
        Args: { _from: string; _mode?: string; _to: string }
        Returns: Json
      }
      analytics_capi_health: {
        Args: { _from: string; _to: string }
        Returns: Json
      }
      analytics_forms: { Args: { _from: string; _to: string }; Returns: Json }
      analytics_funnel: { Args: { _from: string; _to: string }; Returns: Json }
      analytics_guard: { Args: never; Returns: undefined }
      analytics_guard_admin: { Args: never; Returns: undefined }
      analytics_overview: {
        Args: { _from: string; _to: string }
        Returns: Json
      }
      analytics_quality: { Args: { _from: string; _to: string }; Returns: Json }
      analytics_stage_times: {
        Args: { _from: string; _to: string }
        Returns: Json
      }
      automation_claim_due: {
        Args: { _limit?: number }
        Returns: {
          automation_id: string
          cancel_reason: string | null
          context: Json
          created_at: string
          current_node_id: string | null
          finished_at: string | null
          id: string
          last_error: string | null
          lead_id: string
          locked_at: string | null
          next_run_at: string
          retries: number
          started_at: string | null
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "automation_runs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      automation_recover_stuck: { Args: never; Returns: number }
      automations_count_wa_today: {
        Args: { _lead_id: string }
        Returns: number
      }
      find_phone_duplicates_for: {
        Args: { _lead_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          phone_prefix: string
        }[]
      }
      find_phone_duplicates_in: {
        Args: { _ids: string[] }
        Returns: {
          duplicate_count: number
          id: string
        }[]
      }
      has_any_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_phone: {
        Args: { _phone: string; _prefix: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member", "viewer"],
    },
  },
} as const
