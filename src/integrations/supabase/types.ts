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
      action_items: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean
          priority: string | null
          project_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          priority?: string | null
          project_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          priority?: string | null
          project_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      business_members: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_id: string
          city: string | null
          created_at: string
          email: string | null
          id: string
          is_passive: boolean | null
          name: string
          ownership_percentage: number | null
          role: Database["public"]["Enums"]["business_role"]
          ssn_last_four: string | null
          state: string | null
          updated_at: string
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_passive?: boolean | null
          name: string
          ownership_percentage?: number | null
          role: Database["public"]["Enums"]["business_role"]
          ssn_last_four?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_passive?: boolean | null
          name?: string
          ownership_percentage?: number | null
          role?: Database["public"]["Enums"]["business_role"]
          ssn_last_four?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          ein: string | null
          formation_date: string | null
          id: string
          is_active: boolean | null
          name: string
          state: string | null
          structure: Database["public"]["Enums"]["business_structure"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ein?: string | null
          formation_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          state?: string | null
          structure: Database["public"]["Enums"]["business_structure"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ein?: string | null
          formation_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          state?: string | null
          structure?: Database["public"]["Enums"]["business_structure"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      disability_tax_rules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          rule_key: string
          rule_value: number
          tax_year: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          rule_key: string
          rule_value: number
          tax_year?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          rule_key?: string
          rule_value?: number
          tax_year?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      irwe_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          examples: string[] | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          examples?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          examples?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      monthly_vine_income: {
        Row: {
          brand_items_etv: number
          broken_items_etv: number
          countable_income: number
          created_at: string
          gross_etv: number
          id: string
          irwe_deductions: number
          is_twp_month: boolean
          month: number
          non_brand_items_etv: number
          notes: string | null
          updated_at: string
          user_id: string
          value_adjustment: number
          year: number
        }
        Insert: {
          brand_items_etv?: number
          broken_items_etv?: number
          countable_income?: number
          created_at?: string
          gross_etv?: number
          id?: string
          irwe_deductions?: number
          is_twp_month?: boolean
          month: number
          non_brand_items_etv?: number
          notes?: string | null
          updated_at?: string
          user_id: string
          value_adjustment?: number
          year: number
        }
        Update: {
          brand_items_etv?: number
          broken_items_etv?: number
          countable_income?: number
          created_at?: string
          gross_etv?: number
          id?: string
          irwe_deductions?: number
          is_twp_month?: boolean
          month?: number
          non_brand_items_etv?: number
          notes?: string | null
          updated_at?: string
          user_id?: string
          value_adjustment?: number
          year?: number
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
      products_review_insights: {
        Row: {
          asin: string | null
          category: string | null
          created_at: string
          created_by: string | null
          disposition: string | null
          donated_to: string | null
          donation_receipt_number: string | null
          etv: number
          id: string
          is_brand: boolean
          manager_hours_spent: number | null
          notes: string | null
          order_date: string
          photos: string[] | null
          pricing_notes: string | null
          product_name: string
          reduced_basis: number | null
          reduction_percentage: number | null
          review_published: boolean | null
          review_url: string | null
          sale_price_to_rmr: number | null
          testing_complete_date: string | null
          testing_start_date: string | null
          transfer_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asin?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          disposition?: string | null
          donated_to?: string | null
          donation_receipt_number?: string | null
          etv?: number
          id?: string
          is_brand?: boolean
          manager_hours_spent?: number | null
          notes?: string | null
          order_date: string
          photos?: string[] | null
          pricing_notes?: string | null
          product_name: string
          reduced_basis?: number | null
          reduction_percentage?: number | null
          review_published?: boolean | null
          review_url?: string | null
          sale_price_to_rmr?: number | null
          testing_complete_date?: string | null
          testing_start_date?: string | null
          transfer_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asin?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          disposition?: string | null
          donated_to?: string | null
          donation_receipt_number?: string | null
          etv?: number
          id?: string
          is_brand?: boolean
          manager_hours_spent?: number | null
          notes?: string | null
          order_date?: string
          photos?: string[] | null
          pricing_notes?: string | null
          product_name?: string
          reduced_basis?: number | null
          reduction_percentage?: number | null
          review_published?: boolean | null
          review_url?: string | null
          sale_price_to_rmr?: number | null
          testing_complete_date?: string | null
          testing_start_date?: string | null
          transfer_date?: string | null
          updated_at?: string
          user_id?: string
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
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          price_id: string | null
          processed_at: string
          product_id: string | null
          status: string | null
          stripe_event_id: string
          subscription_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          price_id?: string | null
          processed_at?: string
          product_id?: string | null
          status?: string | null
          stripe_event_id: string
          subscription_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          price_id?: string | null
          processed_at?: string
          product_id?: string | null
          status?: string | null
          stripe_event_id?: string
          subscription_id?: string | null
        }
        Relationships: []
      }
      tax_forms: {
        Row: {
          business_id: string | null
          completed_at: string | null
          created_at: string
          form_data: Json | null
          form_type: string
          id: string
          member_id: string | null
          status: string | null
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          completed_at?: string | null
          created_at?: string
          form_data?: Json | null
          form_type: string
          id?: string
          member_id?: string | null
          status?: string | null
          tax_year: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          completed_at?: string | null
          created_at?: string
          form_data?: Json | null
          form_type?: string
          id?: string
          member_id?: string | null
          status?: string | null
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_forms_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_forms_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "business_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_disability_profiles: {
        Row: {
          created_at: string
          disability_notes: string | null
          disability_type: string | null
          epe_start_date: string | null
          id: string
          in_epe_period: boolean
          monthly_ssdi_amount: number | null
          monthly_ssi_amount: number | null
          receives_ssdi: boolean
          receives_ssi: boolean
          twp_months_used: number
          twp_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disability_notes?: string | null
          disability_type?: string | null
          epe_start_date?: string | null
          id?: string
          in_epe_period?: boolean
          monthly_ssdi_amount?: number | null
          monthly_ssi_amount?: number | null
          receives_ssdi?: boolean
          receives_ssi?: boolean
          twp_months_used?: number
          twp_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disability_notes?: string | null
          disability_type?: string | null
          epe_start_date?: string | null
          id?: string
          in_epe_period?: boolean
          monthly_ssdi_amount?: number | null
          monthly_ssi_amount?: number | null
          receives_ssdi?: boolean
          receives_ssi?: boolean
          twp_months_used?: number
          twp_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_irwe_expenses: {
        Row: {
          category_id: string | null
          created_at: string
          doctor_verified: boolean
          end_date: string | null
          expense_name: string
          id: string
          is_recurring: boolean
          monthly_amount: number
          notes: string | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          doctor_verified?: boolean
          end_date?: string | null
          expense_name: string
          id?: string
          is_recurring?: boolean
          monthly_amount?: number
          notes?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          doctor_verified?: boolean
          end_date?: string | null
          expense_name?: string
          id?: string
          is_recurring?: boolean
          monthly_amount?: number
          notes?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_irwe_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "irwe_categories"
            referencedColumns: ["id"]
          },
        ]
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
      business_role: "owner" | "partner" | "employee" | "contractor"
      business_structure:
        | "sole_proprietor"
        | "single_member_llc"
        | "llc_s_corp"
        | "partnership"
        | "c_corp"
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
      business_role: ["owner", "partner", "employee", "contractor"],
      business_structure: [
        "sole_proprietor",
        "single_member_llc",
        "llc_s_corp",
        "partnership",
        "c_corp",
      ],
    },
  },
} as const
