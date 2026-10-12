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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      approved_instructor_emails: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_super_admin: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_super_admin?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_super_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "approved_instructor_emails_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          lab_session_id: string
          message_text: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lab_session_id: string
          message_text: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lab_session_id?: string
          message_text?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_lab_session_id_fkey"
            columns: ["lab_session_id"]
            isOneToOne: false
            referencedRelation: "lab_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_sessions: {
        Row: {
          created_at: string
          current_state: Json
          ended_at: string | null
          ended_by: string | null
          id: string
          is_active: boolean
          practical_id: string
          started_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_state?: Json
          ended_at?: string | null
          ended_by?: string | null
          id?: string
          is_active?: boolean
          practical_id: string
          started_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_state?: Json
          ended_at?: string | null
          ended_by?: string | null
          id?: string
          is_active?: boolean
          practical_id?: string
          started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_sessions_ended_by_fkey"
            columns: ["ended_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_sessions_practical_id_fkey"
            columns: ["practical_id"]
            isOneToOne: true
            referencedRelation: "practicals"
            referencedColumns: ["id"]
          },
        ]
      }
      practical_members: {
        Row: {
          practical_id: string
          registered_at: string
          student_id: string
        }
        Insert: {
          practical_id: string
          registered_at?: string
          student_id: string
        }
        Update: {
          practical_id?: string
          registered_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practical_members_practical_id_fkey"
            columns: ["practical_id"]
            isOneToOne: false
            referencedRelation: "practicals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practical_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practicals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          instructor_id: string
          lab_topic: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: Database["public"]["Enums"]["practical_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          instructor_id: string
          lab_topic?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: Database["public"]["Enums"]["practical_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string
          lab_topic?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: Database["public"]["Enums"]["practical_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicals_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_email: string | null
          academic_id: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          academic_email?: string | null
          academic_id?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          academic_email?: string | null
          academic_id?: string | null
          created_at?: string
          department?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "instructor"
      practical_status: "scheduled" | "live" | "ended"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "instructor"],
      practical_status: ["scheduled", "live", "ended"],
    },
  },
} as const
