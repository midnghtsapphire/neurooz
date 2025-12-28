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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      income_sources: {
        Row: {
          created_at: string
          employer_ein: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          payer_tin: string | null
          platform_type: string | null
          source_name: string
          source_type: string
          updated_at: string
          user_id: string
          year_ended: number | null
          year_started: number | null
        }
        Insert: {
          created_at?: string
          employer_ein?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          payer_tin?: string | null
          platform_type?: string | null
          source_name: string
          source_type: string
          updated_at?: string
          user_id: string
          year_ended?: number | null
          year_started?: number | null
        }
        Update: {
          created_at?: string
          employer_ein?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          payer_tin?: string | null
          platform_type?: string | null
          source_name?: string
          source_type?: string
          updated_at?: string
          user_id?: string
          year_ended?: number | null
          year_started?: number | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          created_at: string
          description: string
          display_order: number
          features: string[]
          id: string
          name: string
          price: number
          recommended: boolean
          roi_max: number
          roi_min: number
          savings_max: number
          savings_min: number
          updated_at: string
          yearly_price: number
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          features?: string[]
          id: string
          name: string
          price?: number
          recommended?: boolean
          roi_max?: number
          roi_min?: number
          savings_max?: number
          savings_min?: number
          updated_at?: string
          yearly_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          id?: string
          name?: string
          price?: number
          recommended?: boolean
          roi_max?: number
          roi_min?: number
          savings_max?: number
          savings_min?: number
          updated_at?: string
          yearly_price?: number
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
          role?: Database["public"]["Enums"]["app_role"]
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
      user_tax_profiles: {
        Row: {
          created_at: string
          filing_status: string | null
          has_1099_income: boolean | null
          has_passive_income: boolean | null
          has_ssdi: boolean | null
          has_w2_income: boolean | null
          hearing_impaired: boolean | null
          high_contrast_mode: boolean | null
          id: string
          preferred_font_size: string | null
          tax_profile_type: string
          updated_at: string
          user_id: string
          vision_impaired: boolean | null
        }
        Insert: {
          created_at?: string
          filing_status?: string | null
          has_1099_income?: boolean | null
          has_passive_income?: boolean | null
          has_ssdi?: boolean | null
          has_w2_income?: boolean | null
          hearing_impaired?: boolean | null
          high_contrast_mode?: boolean | null
          id?: string
          preferred_font_size?: string | null
          tax_profile_type?: string
          updated_at?: string
          user_id: string
          vision_impaired?: boolean | null
        }
        Update: {
          created_at?: string
          filing_status?: string | null
          has_1099_income?: boolean | null
          has_passive_income?: boolean | null
          has_ssdi?: boolean | null
          has_w2_income?: boolean | null
          hearing_impaired?: boolean | null
          high_contrast_mode?: boolean | null
          id?: string
          preferred_font_size?: string | null
          tax_profile_type?: string
          updated_at?: string
          user_id?: string
          vision_impaired?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "managing_member" | "passive_member"
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
      app_role: ["admin", "managing_member", "passive_member"],
    },
  },
} as const
