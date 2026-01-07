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
          blocked_by: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean
          is_setback: boolean | null
          kanban_status: string | null
          parent_id: string | null
          priority: string | null
          priority_score: number | null
          project_id: string | null
          setback_reason: string | null
          task_type: string | null
          title: string
          updated_at: string
          waiting_on: string | null
        }
        Insert: {
          blocked_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          is_setback?: boolean | null
          kanban_status?: string | null
          parent_id?: string | null
          priority?: string | null
          priority_score?: number | null
          project_id?: string | null
          setback_reason?: string | null
          task_type?: string | null
          title: string
          updated_at?: string
          waiting_on?: string | null
        }
        Update: {
          blocked_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          is_setback?: boolean | null
          kanban_status?: string | null
          parent_id?: string | null
          priority?: string | null
          priority_score?: number | null
          project_id?: string | null
          setback_reason?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string
          waiting_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_items_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      awareness_observations: {
        Row: {
          average_visits_to_notice: number | null
          created_at: string
          current_image_index: number
          fastest_notice: number | null
          id: string
          image_changed_at: string
          location: string
          noticed_at: string | null
          slowest_notice: number | null
          total_observations: number
          updated_at: string
          user_id: string
          visits_since_change: number
        }
        Insert: {
          average_visits_to_notice?: number | null
          created_at?: string
          current_image_index?: number
          fastest_notice?: number | null
          id?: string
          image_changed_at?: string
          location: string
          noticed_at?: string | null
          slowest_notice?: number | null
          total_observations?: number
          updated_at?: string
          user_id: string
          visits_since_change?: number
        }
        Update: {
          average_visits_to_notice?: number | null
          created_at?: string
          current_image_index?: number
          fastest_notice?: number | null
          id?: string
          image_changed_at?: string
          location?: string
          noticed_at?: string | null
          slowest_notice?: number | null
          total_observations?: number
          updated_at?: string
          user_id?: string
          visits_since_change?: number
        }
        Relationships: []
      }
      brain_dumps: {
        Row: {
          ai_action_items: Json | null
          ai_categories: Json | null
          ai_summary: string | null
          created_at: string
          document_urls: string[] | null
          id: string
          project_id: string | null
          raw_content: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_action_items?: Json | null
          ai_categories?: Json | null
          ai_summary?: string | null
          created_at?: string
          document_urls?: string[] | null
          id?: string
          project_id?: string | null
          raw_content: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_action_items?: Json | null
          ai_categories?: Json | null
          ai_summary?: string | null
          created_at?: string
          document_urls?: string[] | null
          id?: string
          project_id?: string | null
          raw_content?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_dumps_project_id_fkey"
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
          church_denomination: string | null
          created_at: string
          ein: string | null
          entity_type: string | null
          formation_date: string | null
          id: string
          is_501c3: boolean | null
          is_active: boolean | null
          name: string
          nonprofit_category: string | null
          state: string | null
          structure: Database["public"]["Enums"]["business_structure"]
          tax_classification: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          church_denomination?: string | null
          created_at?: string
          ein?: string | null
          entity_type?: string | null
          formation_date?: string | null
          id?: string
          is_501c3?: boolean | null
          is_active?: boolean | null
          name: string
          nonprofit_category?: string | null
          state?: string | null
          structure: Database["public"]["Enums"]["business_structure"]
          tax_classification?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          church_denomination?: string | null
          created_at?: string
          ein?: string | null
          entity_type?: string | null
          formation_date?: string | null
          id?: string
          is_501c3?: boolean | null
          is_active?: boolean | null
          name?: string
          nonprofit_category?: string | null
          state?: string | null
          structure?: Database["public"]["Enums"]["business_structure"]
          tax_classification?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_baselines: {
        Row: {
          average_score: number | null
          baseline_date: string | null
          baseline_score: number | null
          created_at: string
          current_best_date: string | null
          current_best_score: number | null
          id: string
          improvement_percentage: number | null
          last_session_date: string | null
          streak_days: number | null
          test_type: string
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          baseline_date?: string | null
          baseline_score?: number | null
          created_at?: string
          current_best_date?: string | null
          current_best_score?: number | null
          id?: string
          improvement_percentage?: number | null
          last_session_date?: string | null
          streak_days?: number | null
          test_type: string
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          baseline_date?: string | null
          baseline_score?: number | null
          created_at?: string
          current_best_date?: string | null
          current_best_score?: number | null
          id?: string
          improvement_percentage?: number | null
          last_session_date?: string | null
          streak_days?: number | null
          test_type?: string
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_metrics: {
        Row: {
          context_location: string | null
          context_task: string | null
          created_at: string
          id: string
          is_baseline: boolean | null
          metric_type: string
          session_date: string
          session_end: string | null
          session_start: string | null
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          context_location?: string | null
          context_task?: string | null
          created_at?: string
          id?: string
          is_baseline?: boolean | null
          metric_type: string
          session_date?: string
          session_end?: string | null
          session_start?: string | null
          unit?: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          context_location?: string | null
          context_task?: string | null
          created_at?: string
          id?: string
          is_baseline?: boolean | null
          metric_type?: string
          session_date?: string
          session_end?: string | null
          session_start?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      cognitive_progress: {
        Row: {
          baseline_date: string | null
          baseline_value: number | null
          best_date: string | null
          best_value: number | null
          created_at: string
          current_average: number | null
          current_streak: number | null
          id: string
          improvement_percentage: number | null
          longest_streak: number | null
          metric_type: string
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          baseline_date?: string | null
          baseline_value?: number | null
          best_date?: string | null
          best_value?: number | null
          created_at?: string
          current_average?: number | null
          current_streak?: number | null
          id?: string
          improvement_percentage?: number | null
          longest_streak?: number | null
          metric_type: string
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          baseline_date?: string | null
          baseline_value?: number | null
          best_date?: string | null
          best_value?: number | null
          created_at?: string
          current_average?: number | null
          current_streak?: number | null
          id?: string
          improvement_percentage?: number | null
          longest_streak?: number | null
          metric_type?: string
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cognitive_test_sessions: {
        Row: {
          completed_at: string
          correct_answers: number | null
          created_at: string
          difficulty_level: number | null
          duration_seconds: number | null
          id: string
          metadata: Json | null
          score: number | null
          test_type: string
          total_questions: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          correct_answers?: number | null
          created_at?: string
          difficulty_level?: number | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          test_type: string
          total_questions?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          correct_answers?: number | null
          created_at?: string
          difficulty_level?: number | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          test_type?: string
          total_questions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      depreciation_methods: {
        Row: {
          business_types: string[] | null
          created_at: string
          description: string | null
          first_year_bonus_eligible: boolean | null
          id: string
          is_active: boolean | null
          method_type: string
          name: string
          updated_at: string
          useful_life_years: number | null
          year_percentages: Json
        }
        Insert: {
          business_types?: string[] | null
          created_at?: string
          description?: string | null
          first_year_bonus_eligible?: boolean | null
          id?: string
          is_active?: boolean | null
          method_type: string
          name: string
          updated_at?: string
          useful_life_years?: number | null
          year_percentages?: Json
        }
        Update: {
          business_types?: string[] | null
          created_at?: string
          description?: string | null
          first_year_bonus_eligible?: boolean | null
          id?: string
          is_active?: boolean | null
          method_type?: string
          name?: string
          updated_at?: string
          useful_life_years?: number | null
          year_percentages?: Json
        }
        Relationships: []
      }
      digital_inventory: {
        Row: {
          asset_name: string
          asset_type: string
          business_use_percentage: number | null
          category: string | null
          created_at: string
          current_value: number | null
          depreciation_method: string | null
          id: string
          installed_on: string[] | null
          is_business_asset: boolean | null
          license_expiry: string | null
          license_key: string | null
          license_type: string | null
          notes: string | null
          platform: string | null
          proof_of_purchase: string[] | null
          purchase_date: string | null
          purchase_price: number | null
          seats_count: number | null
          status: string | null
          updated_at: string
          useful_life_years: number | null
          user_id: string
          vendor: string | null
          version: string | null
        }
        Insert: {
          asset_name: string
          asset_type?: string
          business_use_percentage?: number | null
          category?: string | null
          created_at?: string
          current_value?: number | null
          depreciation_method?: string | null
          id?: string
          installed_on?: string[] | null
          is_business_asset?: boolean | null
          license_expiry?: string | null
          license_key?: string | null
          license_type?: string | null
          notes?: string | null
          platform?: string | null
          proof_of_purchase?: string[] | null
          purchase_date?: string | null
          purchase_price?: number | null
          seats_count?: number | null
          status?: string | null
          updated_at?: string
          useful_life_years?: number | null
          user_id: string
          vendor?: string | null
          version?: string | null
        }
        Update: {
          asset_name?: string
          asset_type?: string
          business_use_percentage?: number | null
          category?: string | null
          created_at?: string
          current_value?: number | null
          depreciation_method?: string | null
          id?: string
          installed_on?: string[] | null
          is_business_asset?: boolean | null
          license_expiry?: string | null
          license_key?: string | null
          license_type?: string | null
          notes?: string | null
          platform?: string | null
          proof_of_purchase?: string[] | null
          purchase_date?: string | null
          purchase_price?: number | null
          seats_count?: number | null
          status?: string | null
          updated_at?: string
          useful_life_years?: number | null
          user_id?: string
          vendor?: string | null
          version?: string | null
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
      donation_records: {
        Row: {
          acknowledgment_date: string | null
          acknowledgment_received: boolean | null
          appraisal_required: boolean | null
          appraiser_ein: string | null
          appraiser_name: string | null
          charity_address: string | null
          charity_city: string | null
          charity_ein: string | null
          charity_name: string
          charity_state: string | null
          charity_zip: string | null
          comparable_evidence: string | null
          condition_at_donation: string | null
          cost_basis: number | null
          created_at: string
          donation_date: string
          fair_market_value: number | null
          form_8283_section: string | null
          id: string
          included_in_tax_year: number | null
          is_501c3: boolean | null
          notes: string | null
          original_etv: number | null
          photo_urls: string[] | null
          product_name: string
          receipt_number: string | null
          source_product_id: string | null
          updated_at: string
          user_id: string
          valuation_method: string | null
        }
        Insert: {
          acknowledgment_date?: string | null
          acknowledgment_received?: boolean | null
          appraisal_required?: boolean | null
          appraiser_ein?: string | null
          appraiser_name?: string | null
          charity_address?: string | null
          charity_city?: string | null
          charity_ein?: string | null
          charity_name: string
          charity_state?: string | null
          charity_zip?: string | null
          comparable_evidence?: string | null
          condition_at_donation?: string | null
          cost_basis?: number | null
          created_at?: string
          donation_date?: string
          fair_market_value?: number | null
          form_8283_section?: string | null
          id?: string
          included_in_tax_year?: number | null
          is_501c3?: boolean | null
          notes?: string | null
          original_etv?: number | null
          photo_urls?: string[] | null
          product_name: string
          receipt_number?: string | null
          source_product_id?: string | null
          updated_at?: string
          user_id: string
          valuation_method?: string | null
        }
        Update: {
          acknowledgment_date?: string | null
          acknowledgment_received?: boolean | null
          appraisal_required?: boolean | null
          appraiser_ein?: string | null
          appraiser_name?: string | null
          charity_address?: string | null
          charity_city?: string | null
          charity_ein?: string | null
          charity_name?: string
          charity_state?: string | null
          charity_zip?: string | null
          comparable_evidence?: string | null
          condition_at_donation?: string | null
          cost_basis?: number | null
          created_at?: string
          donation_date?: string
          fair_market_value?: number | null
          form_8283_section?: string | null
          id?: string
          included_in_tax_year?: number | null
          is_501c3?: boolean | null
          notes?: string | null
          original_etv?: number | null
          photo_urls?: string[] | null
          product_name?: string
          receipt_number?: string | null
          source_product_id?: string | null
          updated_at?: string
          user_id?: string
          valuation_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_records_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products_review_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_education_benefits: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          documentation_notes: string | null
          employee_email: string | null
          employee_name: string
          id: string
          is_student_loan_payment: boolean | null
          payment_date: string
          payment_type: string
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          documentation_notes?: string | null
          employee_email?: string | null
          employee_name: string
          id?: string
          is_student_loan_payment?: boolean | null
          payment_date?: string
          payment_type?: string
          tax_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          documentation_notes?: string | null
          employee_email?: string | null
          employee_name?: string
          id?: string
          is_student_loan_payment?: boolean | null
          payment_date?: string
          payment_type?: string
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employment_rules: {
        Row: {
          age_group: string | null
          category: string
          created_at: string
          documentation_needed: string[] | null
          id: string
          is_active: boolean | null
          requirements: string[] | null
          rule_description: string | null
          rule_key: string
          rule_title: string
          source_url: string | null
          tax_implications: string | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          category: string
          created_at?: string
          documentation_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          requirements?: string[] | null
          rule_description?: string | null
          rule_key: string
          rule_title: string
          source_url?: string | null
          tax_implications?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          category?: string
          created_at?: string
          documentation_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          requirements?: string[] | null
          rule_description?: string | null
          rule_key?: string
          rule_title?: string
          source_url?: string | null
          tax_implications?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      focus_patterns: {
        Row: {
          created_at: string
          id: string
          impact_on_score: number | null
          lesson: string | null
          pattern_description: string
          pattern_type: string
          project_id: string | null
          times_occurred: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          impact_on_score?: number | null
          lesson?: string | null
          pattern_description: string
          pattern_type: string
          project_id?: string | null
          times_occurred?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          impact_on_score?: number | null
          lesson?: string | null
          pattern_description?: string
          pattern_type?: string
          project_id?: string | null
          times_occurred?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_patterns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      form_1099_investment_income: {
        Row: {
          bond_premium: number | null
          business_id: string | null
          capital_gain_distributions: number | null
          collectibles_gain: number | null
          created_at: string
          early_withdrawal_penalty: number | null
          exempt_interest_dividends: number | null
          federal_withheld: number | null
          foreign_tax_paid: number | null
          form_type: string
          id: string
          interest_income: number | null
          interest_on_savings_bonds: number | null
          investment_expenses: number | null
          market_discount: number | null
          nondividend_distributions: number | null
          ordinary_dividends: number | null
          payer_name: string
          payer_tin: string | null
          private_activity_bond_interest: number | null
          qualified_dividends: number | null
          section_1202_gain: number | null
          section_1250_gain: number | null
          section_199a_dividends: number | null
          state_id: string | null
          state_withheld: number | null
          tax_exempt_interest: number | null
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bond_premium?: number | null
          business_id?: string | null
          capital_gain_distributions?: number | null
          collectibles_gain?: number | null
          created_at?: string
          early_withdrawal_penalty?: number | null
          exempt_interest_dividends?: number | null
          federal_withheld?: number | null
          foreign_tax_paid?: number | null
          form_type?: string
          id?: string
          interest_income?: number | null
          interest_on_savings_bonds?: number | null
          investment_expenses?: number | null
          market_discount?: number | null
          nondividend_distributions?: number | null
          ordinary_dividends?: number | null
          payer_name: string
          payer_tin?: string | null
          private_activity_bond_interest?: number | null
          qualified_dividends?: number | null
          section_1202_gain?: number | null
          section_1250_gain?: number | null
          section_199a_dividends?: number | null
          state_id?: string | null
          state_withheld?: number | null
          tax_exempt_interest?: number | null
          tax_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bond_premium?: number | null
          business_id?: string | null
          capital_gain_distributions?: number | null
          collectibles_gain?: number | null
          created_at?: string
          early_withdrawal_penalty?: number | null
          exempt_interest_dividends?: number | null
          federal_withheld?: number | null
          foreign_tax_paid?: number | null
          form_type?: string
          id?: string
          interest_income?: number | null
          interest_on_savings_bonds?: number | null
          investment_expenses?: number | null
          market_discount?: number | null
          nondividend_distributions?: number | null
          ordinary_dividends?: number | null
          payer_name?: string
          payer_tin?: string | null
          private_activity_bond_interest?: number | null
          qualified_dividends?: number | null
          section_1202_gain?: number | null
          section_1250_gain?: number | null
          section_199a_dividends?: number | null
          state_id?: string | null
          state_withheld?: number | null
          tax_exempt_interest?: number | null
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_1099_investment_income_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      form_1099_k_received: {
        Row: {
          april_amount: number | null
          august_amount: number | null
          business_id: string | null
          card_not_present: number | null
          created_at: string
          december_amount: number | null
          february_amount: number | null
          federal_withheld: number | null
          gross_amount: number | null
          id: string
          january_amount: number | null
          july_amount: number | null
          june_amount: number | null
          march_amount: number | null
          may_amount: number | null
          november_amount: number | null
          october_amount: number | null
          payer_name: string
          payer_tin: string | null
          payment_card_transactions: number | null
          september_amount: number | null
          state_id: string | null
          state_income: number | null
          state_withheld: number | null
          tax_year: number
          third_party_network_transactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          april_amount?: number | null
          august_amount?: number | null
          business_id?: string | null
          card_not_present?: number | null
          created_at?: string
          december_amount?: number | null
          february_amount?: number | null
          federal_withheld?: number | null
          gross_amount?: number | null
          id?: string
          january_amount?: number | null
          july_amount?: number | null
          june_amount?: number | null
          march_amount?: number | null
          may_amount?: number | null
          november_amount?: number | null
          october_amount?: number | null
          payer_name: string
          payer_tin?: string | null
          payment_card_transactions?: number | null
          september_amount?: number | null
          state_id?: string | null
          state_income?: number | null
          state_withheld?: number | null
          tax_year?: number
          third_party_network_transactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          april_amount?: number | null
          august_amount?: number | null
          business_id?: string | null
          card_not_present?: number | null
          created_at?: string
          december_amount?: number | null
          february_amount?: number | null
          federal_withheld?: number | null
          gross_amount?: number | null
          id?: string
          january_amount?: number | null
          july_amount?: number | null
          june_amount?: number | null
          march_amount?: number | null
          may_amount?: number | null
          november_amount?: number | null
          october_amount?: number | null
          payer_name?: string
          payer_tin?: string | null
          payment_card_transactions?: number | null
          september_amount?: number | null
          state_id?: string | null
          state_income?: number | null
          state_withheld?: number | null
          tax_year?: number
          third_party_network_transactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_1099_k_received_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      form_1099_misc_payments: {
        Row: {
          amount: number
          box_number: number
          business_id: string | null
          created_at: string
          description: string | null
          id: string
          payment_date: string
          payment_method: string | null
          recipient_id: string | null
          recipient_name: string
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          box_number?: number
          business_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          recipient_id?: string | null
          recipient_name: string
          tax_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          box_number?: number
          business_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          recipient_id?: string | null
          recipient_name?: string
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_1099_misc_payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_1099_misc_payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "form_1099_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      form_1099_nec_payments: {
        Row: {
          amount: number
          box_number: number | null
          business_id: string | null
          check_number: string | null
          created_at: string
          description: string | null
          form_generated: boolean | null
          id: string
          is_1099_required: boolean | null
          payment_date: string
          payment_method: string | null
          recipient_id: string | null
          recipient_name: string
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          box_number?: number | null
          business_id?: string | null
          check_number?: string | null
          created_at?: string
          description?: string | null
          form_generated?: boolean | null
          id?: string
          is_1099_required?: boolean | null
          payment_date?: string
          payment_method?: string | null
          recipient_id?: string | null
          recipient_name: string
          tax_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          box_number?: number | null
          business_id?: string | null
          check_number?: string | null
          created_at?: string
          description?: string | null
          form_generated?: boolean | null
          id?: string
          is_1099_required?: boolean | null
          payment_date?: string
          payment_method?: string | null
          recipient_id?: string | null
          recipient_name?: string
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_1099_nec_payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_1099_nec_payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "form_1099_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      form_1099_recipients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_id: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          recipient_name: string
          recipient_type: string | null
          state: string | null
          tin: string | null
          tin_type: string | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_id?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          recipient_name: string
          recipient_type?: string | null
          state?: string | null
          tin?: string | null
          tin_type?: string | null
          updated_at?: string
          user_id: string
          zip?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_id?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          recipient_name?: string
          recipient_type?: string | null
          state?: string | null
          tin?: string | null
          tin_type?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_1099_recipients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
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
      inter_company_transfers: {
        Row: {
          check_number: string | null
          comparable_evidence: string | null
          created_at: string
          from_entity: string
          id: string
          invoice_number: string | null
          notes: string | null
          original_etv: number | null
          payment_due_date: string | null
          payment_method: string | null
          payment_received_date: string | null
          pricing_method: string | null
          product_name: string
          sale_price: number | null
          source_product_id: string | null
          to_entity: string
          updated_at: string
          user_id: string
        }
        Insert: {
          check_number?: string | null
          comparable_evidence?: string | null
          created_at?: string
          from_entity: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          original_etv?: number | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_received_date?: string | null
          pricing_method?: string | null
          product_name: string
          sale_price?: number | null
          source_product_id?: string | null
          to_entity: string
          updated_at?: string
          user_id: string
        }
        Update: {
          check_number?: string | null
          comparable_evidence?: string | null
          created_at?: string
          from_entity?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          original_etv?: number | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_received_date?: string | null
          pricing_method?: string | null
          product_name?: string
          sale_price?: number | null
          source_product_id?: string | null
          to_entity?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inter_company_transfers_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products_review_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      irs_form_field_definitions: {
        Row: {
          allowed_values: string[] | null
          created_at: string
          description: string | null
          display_order: number
          field_label: string
          field_name: string
          field_type: string
          form_type: string
          id: string
          irs_box_number: string | null
          is_payer_field: boolean
          is_recipient_field: boolean
          is_required: boolean
          is_state_field: boolean
          max_length: number | null
          state_code: string | null
          updated_at: string
          validation_regex: string | null
        }
        Insert: {
          allowed_values?: string[] | null
          created_at?: string
          description?: string | null
          display_order?: number
          field_label: string
          field_name: string
          field_type?: string
          form_type: string
          id?: string
          irs_box_number?: string | null
          is_payer_field?: boolean
          is_recipient_field?: boolean
          is_required?: boolean
          is_state_field?: boolean
          max_length?: number | null
          state_code?: string | null
          updated_at?: string
          validation_regex?: string | null
        }
        Update: {
          allowed_values?: string[] | null
          created_at?: string
          description?: string | null
          display_order?: number
          field_label?: string
          field_name?: string
          field_type?: string
          form_type?: string
          id?: string
          irs_box_number?: string | null
          is_payer_field?: boolean
          is_recipient_field?: boolean
          is_required?: boolean
          is_state_field?: boolean
          max_length?: number | null
          state_code?: string | null
          updated_at?: string
          validation_regex?: string | null
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
      operating_agreement_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          placeholders: Json | null
          state: string | null
          template_content: string
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          placeholders?: Json | null
          state?: string | null
          template_content: string
          template_name: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          placeholders?: Json | null
          state?: string | null
          template_content?: string
          template_name?: string
          template_type?: string
          updated_at?: string
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
      product_depreciation_tracking: {
        Row: {
          accumulated_depreciation: number | null
          bonus_depreciation_taken: number | null
          created_at: string
          current_book_value: number | null
          current_year: number
          depreciation_method_id: string | null
          id: string
          inventory_id: string | null
          is_trailing_product: boolean | null
          notes: string | null
          original_cost: number
          product_name: string
          purchase_date: string
          section_179_taken: number | null
          trailing_group_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accumulated_depreciation?: number | null
          bonus_depreciation_taken?: number | null
          created_at?: string
          current_book_value?: number | null
          current_year: number
          depreciation_method_id?: string | null
          id?: string
          inventory_id?: string | null
          is_trailing_product?: boolean | null
          notes?: string | null
          original_cost?: number
          product_name: string
          purchase_date: string
          section_179_taken?: number | null
          trailing_group_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accumulated_depreciation?: number | null
          bonus_depreciation_taken?: number | null
          created_at?: string
          current_book_value?: number | null
          current_year?: number
          depreciation_method_id?: string | null
          id?: string
          inventory_id?: string | null
          is_trailing_product?: boolean | null
          notes?: string | null
          original_cost?: number
          product_name?: string
          purchase_date?: string
          section_179_taken?: number | null
          trailing_group_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_depreciation_tracking_depreciation_method_id_fkey"
            columns: ["depreciation_method_id"]
            isOneToOne: false
            referencedRelation: "depreciation_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_depreciation_tracking_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "rental_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      products_review_insights: {
        Row: {
          asin: string | null
          category: string | null
          created_at: string
          created_by: string | null
          depreciation_method: string | null
          disposition: string | null
          donated_to: string | null
          donation_eligible_date: string | null
          donation_receipt_number: string | null
          etv: number
          first_year_depreciation: number | null
          id: string
          is_brand: boolean
          is_cancelled: boolean | null
          manager_hours_spent: number | null
          notes: string | null
          order_date: string
          order_number: string | null
          photos: string[] | null
          pricing_notes: string | null
          product_name: string
          reduced_basis: number | null
          reduction_percentage: number | null
          review_published: boolean | null
          review_url: string | null
          sale_price_to_rmr: number | null
          shipped_date: string | null
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
          depreciation_method?: string | null
          disposition?: string | null
          donated_to?: string | null
          donation_eligible_date?: string | null
          donation_receipt_number?: string | null
          etv?: number
          first_year_depreciation?: number | null
          id?: string
          is_brand?: boolean
          is_cancelled?: boolean | null
          manager_hours_spent?: number | null
          notes?: string | null
          order_date: string
          order_number?: string | null
          photos?: string[] | null
          pricing_notes?: string | null
          product_name: string
          reduced_basis?: number | null
          reduction_percentage?: number | null
          review_published?: boolean | null
          review_url?: string | null
          sale_price_to_rmr?: number | null
          shipped_date?: string | null
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
          depreciation_method?: string | null
          disposition?: string | null
          donated_to?: string | null
          donation_eligible_date?: string | null
          donation_receipt_number?: string | null
          etv?: number
          first_year_depreciation?: number | null
          id?: string
          is_brand?: boolean
          is_cancelled?: boolean | null
          manager_hours_spent?: number | null
          notes?: string | null
          order_date?: string
          order_number?: string | null
          photos?: string[] | null
          pricing_notes?: string | null
          product_name?: string
          reduced_basis?: number | null
          reduction_percentage?: number | null
          review_published?: boolean | null
          review_url?: string | null
          sale_price_to_rmr?: number | null
          shipped_date?: string | null
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
      project_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          distractions_to_avoid: string[] | null
          focus_intention: string | null
          id: string
          priorities_reviewed: boolean | null
          project_id: string
          stakeholders_contacted: string[] | null
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          distractions_to_avoid?: string[] | null
          focus_intention?: string | null
          id?: string
          priorities_reviewed?: boolean | null
          project_id: string
          stakeholders_contacted?: string[] | null
        }
        Update: {
          checkin_date?: string
          created_at?: string
          distractions_to_avoid?: string[] | null
          focus_intention?: string | null
          id?: string
          priorities_reviewed?: boolean | null
          project_id?: string
          stakeholders_contacted?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_checkins_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          project_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          project_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_items: {
        Row: {
          action_item_id: string | null
          created_at: string
          description: string | null
          id: string
          is_action_item: boolean
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          action_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_action_item?: boolean
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          action_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_action_item?: boolean
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_items_action_item_id_fkey"
            columns: ["action_item_id"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_to: string | null
          color: string | null
          completed_at: string | null
          created_at: string
          daily_checkin_required: boolean | null
          description: string | null
          focus_score: number | null
          id: string
          is_completed: boolean
          lessons_learned: string | null
          name: string
          scope_creep_count: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          color?: string | null
          completed_at?: string | null
          created_at?: string
          daily_checkin_required?: boolean | null
          description?: string | null
          focus_score?: number | null
          id?: string
          is_completed?: boolean
          lessons_learned?: string | null
          name: string
          scope_creep_count?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          color?: string | null
          completed_at?: string | null
          created_at?: string
          daily_checkin_required?: boolean | null
          description?: string | null
          focus_score?: number | null
          id?: string
          is_completed?: boolean
          lessons_learned?: string | null
          name?: string
          scope_creep_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      quick_notes: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_processed: boolean | null
          project_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_processed?: boolean | null
          project_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_processed?: boolean | null
          project_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_customers: {
        Row: {
          address: string | null
          created_at: string
          drivers_license: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          total_rentals: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          drivers_license?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          total_rentals?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          drivers_license?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          total_rentals?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rental_inventory: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string
          current_book_value: number | null
          daily_rate: number | null
          depreciation_method: string | null
          description: string | null
          id: string
          location: string | null
          original_etv: number | null
          photo_url: string | null
          product_name: string
          purchase_price: number | null
          source: string | null
          source_product_id: string | null
          status: string | null
          times_rented: number | null
          total_rental_income: number | null
          updated_at: string
          user_id: string
          weekly_rate: number | null
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string
          current_book_value?: number | null
          daily_rate?: number | null
          depreciation_method?: string | null
          description?: string | null
          id?: string
          location?: string | null
          original_etv?: number | null
          photo_url?: string | null
          product_name: string
          purchase_price?: number | null
          source?: string | null
          source_product_id?: string | null
          status?: string | null
          times_rented?: number | null
          total_rental_income?: number | null
          updated_at?: string
          user_id: string
          weekly_rate?: number | null
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string
          current_book_value?: number | null
          daily_rate?: number | null
          depreciation_method?: string | null
          description?: string | null
          id?: string
          location?: string | null
          original_etv?: number | null
          photo_url?: string | null
          product_name?: string
          purchase_price?: number | null
          source?: string | null
          source_product_id?: string | null
          status?: string | null
          times_rented?: number | null
          total_rental_income?: number | null
          updated_at?: string
          user_id?: string
          weekly_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_inventory_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products_review_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_transactions: {
        Row: {
          agreement_signed: boolean | null
          created_at: string
          customer_id: string | null
          daily_rate: number | null
          damage_description: string | null
          days_rented: number | null
          deposit_refunded: number | null
          has_damage: boolean | null
          id: string
          inventory_id: string | null
          net_revenue: number | null
          notes: string | null
          payment_method: string | null
          payment_received: boolean | null
          rental_end_date: string | null
          rental_start_date: string
          repair_cost: number | null
          return_condition: string | null
          returned_on_time: boolean | null
          security_deposit: number | null
          subtotal: number | null
          total_charged: number | null
          transaction_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agreement_signed?: boolean | null
          created_at?: string
          customer_id?: string | null
          daily_rate?: number | null
          damage_description?: string | null
          days_rented?: number | null
          deposit_refunded?: number | null
          has_damage?: boolean | null
          id?: string
          inventory_id?: string | null
          net_revenue?: number | null
          notes?: string | null
          payment_method?: string | null
          payment_received?: boolean | null
          rental_end_date?: string | null
          rental_start_date: string
          repair_cost?: number | null
          return_condition?: string | null
          returned_on_time?: boolean | null
          security_deposit?: number | null
          subtotal?: number | null
          total_charged?: number | null
          transaction_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agreement_signed?: boolean | null
          created_at?: string
          customer_id?: string | null
          daily_rate?: number | null
          damage_description?: string | null
          days_rented?: number | null
          deposit_refunded?: number | null
          has_damage?: boolean | null
          id?: string
          inventory_id?: string | null
          net_revenue?: number | null
          notes?: string | null
          payment_method?: string | null
          payment_received?: boolean | null
          rental_end_date?: string | null
          rental_start_date?: string
          repair_cost?: number | null
          return_condition?: string | null
          returned_on_time?: boolean | null
          security_deposit?: number | null
          subtotal?: number | null
          total_charged?: number | null
          transaction_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "rental_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "rental_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_charities: {
        Row: {
          address: string | null
          charity_name: string
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          ein: string | null
          id: string
          is_501c3: boolean | null
          notes: string | null
          state: string | null
          total_donations: number | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          address?: string | null
          charity_name: string
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          ein?: string | null
          id?: string
          is_501c3?: boolean | null
          notes?: string | null
          state?: string | null
          total_donations?: number | null
          updated_at?: string
          user_id: string
          zip?: string | null
        }
        Update: {
          address?: string | null
          charity_name?: string
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          ein?: string | null
          id?: string
          is_501c3?: boolean | null
          notes?: string | null
          state?: string | null
          total_donations?: number | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      ssdi_tracking: {
        Row: {
          alert_notes: string | null
          created_at: string
          earned_income: number
          hours_worked: number | null
          id: string
          is_epe_month: boolean | null
          is_substantial_services: boolean | null
          is_twp_month: boolean | null
          k1_distributions: number
          material_participation_test: string | null
          month: number
          passive_income: number
          rental_income: number
          sga_limit: number | null
          sga_risk_level: string | null
          ssdi_benefit_amount: number | null
          twp_months_used: number | null
          updated_at: string
          user_id: string
          vine_etv: number
          year: number
        }
        Insert: {
          alert_notes?: string | null
          created_at?: string
          earned_income?: number
          hours_worked?: number | null
          id?: string
          is_epe_month?: boolean | null
          is_substantial_services?: boolean | null
          is_twp_month?: boolean | null
          k1_distributions?: number
          material_participation_test?: string | null
          month: number
          passive_income?: number
          rental_income?: number
          sga_limit?: number | null
          sga_risk_level?: string | null
          ssdi_benefit_amount?: number | null
          twp_months_used?: number | null
          updated_at?: string
          user_id: string
          vine_etv?: number
          year: number
        }
        Update: {
          alert_notes?: string | null
          created_at?: string
          earned_income?: number
          hours_worked?: number | null
          id?: string
          is_epe_month?: boolean | null
          is_substantial_services?: boolean | null
          is_twp_month?: boolean | null
          k1_distributions?: number
          material_participation_test?: string | null
          month?: number
          passive_income?: number
          rental_income?: number
          sga_limit?: number | null
          sga_risk_level?: string | null
          ssdi_benefit_amount?: number | null
          twp_months_used?: number | null
          updated_at?: string
          user_id?: string
          vine_etv?: number
          year?: number
        }
        Relationships: []
      }
      state_tax_forms: {
        Row: {
          created_at: string
          extension_deadline: string | null
          filing_deadline: string | null
          form_name: string
          form_number: string
          form_type: string
          has_local_tax: boolean | null
          id: string
          is_active: boolean | null
          notes: string | null
          state_code: string
          state_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          extension_deadline?: string | null
          filing_deadline?: string | null
          form_name: string
          form_number: string
          form_type: string
          has_local_tax?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          state_code: string
          state_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          extension_deadline?: string | null
          filing_deadline?: string | null
          form_name?: string
          form_number?: string
          form_type?: string
          has_local_tax?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          state_code?: string
          state_name?: string
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
      subscriptions: {
        Row: {
          amount: number
          assigned_to: string[] | null
          auto_renew: boolean | null
          billing_cycle: string | null
          business_use_percentage: number | null
          cancellation_date: string | null
          category: string | null
          created_at: string
          currency: string | null
          id: string
          is_business_expense: boolean | null
          license_key: string | null
          notes: string | null
          provider: string | null
          receipt_urls: string[] | null
          renewal_date: string | null
          seats_purchased: number | null
          start_date: string | null
          status: string | null
          subscription_name: string
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          assigned_to?: string[] | null
          auto_renew?: boolean | null
          billing_cycle?: string | null
          business_use_percentage?: number | null
          cancellation_date?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          is_business_expense?: boolean | null
          license_key?: string | null
          notes?: string | null
          provider?: string | null
          receipt_urls?: string[] | null
          renewal_date?: string | null
          seats_purchased?: number | null
          start_date?: string | null
          status?: string | null
          subscription_name: string
          subscription_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          assigned_to?: string[] | null
          auto_renew?: boolean | null
          billing_cycle?: string | null
          business_use_percentage?: number | null
          cancellation_date?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          is_business_expense?: boolean | null
          license_key?: string | null
          notes?: string | null
          provider?: string | null
          receipt_urls?: string[] | null
          renewal_date?: string | null
          seats_purchased?: number | null
          start_date?: string | null
          status?: string | null
          subscription_name?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_deduction_rules: {
        Row: {
          applicable_forms: string[] | null
          business_types: string[] | null
          can_be_increased: boolean | null
          category: string
          created_at: string
          deduction_name: string
          display_order: number | null
          id: string
          increase_amounts: Json | null
          increase_conditions: string[] | null
          irs_reference: string | null
          is_active: boolean | null
          max_amount: number | null
          max_amount_description: string | null
          notes: string | null
          proof_required: string[] | null
          tax_year: number
          updated_at: string
        }
        Insert: {
          applicable_forms?: string[] | null
          business_types?: string[] | null
          can_be_increased?: boolean | null
          category: string
          created_at?: string
          deduction_name: string
          display_order?: number | null
          id?: string
          increase_amounts?: Json | null
          increase_conditions?: string[] | null
          irs_reference?: string | null
          is_active?: boolean | null
          max_amount?: number | null
          max_amount_description?: string | null
          notes?: string | null
          proof_required?: string[] | null
          tax_year?: number
          updated_at?: string
        }
        Update: {
          applicable_forms?: string[] | null
          business_types?: string[] | null
          can_be_increased?: boolean | null
          category?: string
          created_at?: string
          deduction_name?: string
          display_order?: number | null
          id?: string
          increase_amounts?: Json | null
          increase_conditions?: string[] | null
          irs_reference?: string | null
          is_active?: boolean | null
          max_amount?: number | null
          max_amount_description?: string | null
          notes?: string | null
          proof_required?: string[] | null
          tax_year?: number
          updated_at?: string
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
      tax_law_changes: {
        Row: {
          affected_taxpayers: string[] | null
          change_direction: string | null
          change_percentage: number | null
          created_at: string
          current_description: string | null
          current_value: string | null
          display_order: number | null
          effective_date: string
          expiration_date: string | null
          extension_history: Json | null
          id: string
          irs_reference: string | null
          is_permanent: boolean | null
          law_abbreviation: string | null
          law_name: string
          notes: string | null
          post_expiration_description: string | null
          post_expiration_value: string | null
          pre_law_description: string | null
          pre_law_value: string | null
          proof_documentation: string[] | null
          provision_category: string
          provision_name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          affected_taxpayers?: string[] | null
          change_direction?: string | null
          change_percentage?: number | null
          created_at?: string
          current_description?: string | null
          current_value?: string | null
          display_order?: number | null
          effective_date: string
          expiration_date?: string | null
          extension_history?: Json | null
          id?: string
          irs_reference?: string | null
          is_permanent?: boolean | null
          law_abbreviation?: string | null
          law_name: string
          notes?: string | null
          post_expiration_description?: string | null
          post_expiration_value?: string | null
          pre_law_description?: string | null
          pre_law_value?: string | null
          proof_documentation?: string[] | null
          provision_category: string
          provision_name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          affected_taxpayers?: string[] | null
          change_direction?: string | null
          change_percentage?: number | null
          created_at?: string
          current_description?: string | null
          current_value?: string | null
          display_order?: number | null
          effective_date?: string
          expiration_date?: string | null
          extension_history?: Json | null
          id?: string
          irs_reference?: string | null
          is_permanent?: boolean | null
          law_abbreviation?: string | null
          law_name?: string
          notes?: string | null
          post_expiration_description?: string | null
          post_expiration_value?: string | null
          pre_law_description?: string | null
          pre_law_value?: string | null
          proof_documentation?: string[] | null
          provision_category?: string
          provision_name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          activity_category: string
          activity_description: string
          created_at: string
          hours: number
          id: string
          llc: string
          log_date: string
          output_created: string | null
          products_involved: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_category: string
          activity_description: string
          created_at?: string
          hours: number
          id?: string
          llc: string
          log_date: string
          output_created?: string | null
          products_involved?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_category?: string
          activity_description?: string
          created_at?: string
          hours?: number
          id?: string
          llc?: string
          log_date?: string
          output_created?: string | null
          products_involved?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trailing_product_groups: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          group_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_co2_stats: {
        Row: {
          completed_tasks_count: number
          created_at: string
          current_season: string | null
          display_name: string | null
          id: string
          total_co2_saved: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_tasks_count?: number
          created_at?: string
          current_season?: string | null
          display_name?: string | null
          id?: string
          total_co2_saved?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_tasks_count?: number
          created_at?: string
          current_season?: string | null
          display_name?: string | null
          id?: string
          total_co2_saved?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_operating_agreements: {
        Row: {
          agreement_name: string
          business_id: string | null
          created_at: string
          custom_provisions: Json | null
          generated_at: string | null
          generated_content: string | null
          id: string
          includes_ssdi_protection: boolean | null
          managing_member_name: string | null
          managing_member_ownership: number | null
          no_material_participation_clause: boolean | null
          passive_member_name: string | null
          passive_member_ownership: number | null
          passive_role_explicitly_defined: boolean | null
          signed_at: string | null
          status: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agreement_name: string
          business_id?: string | null
          created_at?: string
          custom_provisions?: Json | null
          generated_at?: string | null
          generated_content?: string | null
          id?: string
          includes_ssdi_protection?: boolean | null
          managing_member_name?: string | null
          managing_member_ownership?: number | null
          no_material_participation_clause?: boolean | null
          passive_member_name?: string | null
          passive_member_ownership?: number | null
          passive_role_explicitly_defined?: boolean | null
          signed_at?: string | null
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agreement_name?: string
          business_id?: string | null
          created_at?: string
          custom_provisions?: Json | null
          generated_at?: string | null
          generated_content?: string | null
          id?: string
          includes_ssdi_protection?: boolean | null
          managing_member_name?: string | null
          managing_member_ownership?: number | null
          no_material_participation_clause?: boolean | null
          passive_member_name?: string | null
          passive_member_ownership?: number | null
          passive_role_explicitly_defined?: boolean | null
          signed_at?: string | null
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_operating_agreements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_operating_agreements_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "operating_agreement_templates"
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
      vine_inventory_transfers: {
        Row: {
          bonus_depreciation_amount: number | null
          capital_contribution_basis: number | null
          created_at: string
          depreciation_method: string | null
          fmv_at_transfer: number | null
          from_entity: string
          id: string
          is_section_179_eligible: boolean | null
          notes: string | null
          original_etv: number
          placed_in_service_date: string | null
          product_name: string
          section_179_amount: number | null
          six_month_eligible_date: string | null
          source_product_id: string | null
          status: string | null
          to_entity: string
          transfer_date: string | null
          transfer_type: string | null
          updated_at: string
          useful_life_years: number | null
          user_id: string
          vine_order_date: string
        }
        Insert: {
          bonus_depreciation_amount?: number | null
          capital_contribution_basis?: number | null
          created_at?: string
          depreciation_method?: string | null
          fmv_at_transfer?: number | null
          from_entity?: string
          id?: string
          is_section_179_eligible?: boolean | null
          notes?: string | null
          original_etv?: number
          placed_in_service_date?: string | null
          product_name: string
          section_179_amount?: number | null
          six_month_eligible_date?: string | null
          source_product_id?: string | null
          status?: string | null
          to_entity: string
          transfer_date?: string | null
          transfer_type?: string | null
          updated_at?: string
          useful_life_years?: number | null
          user_id: string
          vine_order_date: string
        }
        Update: {
          bonus_depreciation_amount?: number | null
          capital_contribution_basis?: number | null
          created_at?: string
          depreciation_method?: string | null
          fmv_at_transfer?: number | null
          from_entity?: string
          id?: string
          is_section_179_eligible?: boolean | null
          notes?: string | null
          original_etv?: number
          placed_in_service_date?: string | null
          product_name?: string
          section_179_amount?: number | null
          six_month_eligible_date?: string | null
          source_product_id?: string | null
          status?: string | null
          to_entity?: string
          transfer_date?: string | null
          transfer_type?: string | null
          updated_at?: string
          useful_life_years?: number | null
          user_id?: string
          vine_order_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "vine_inventory_transfers_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products_review_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      yearly_depreciation_entries: {
        Row: {
          beginning_book_value: number
          bonus_depreciation_amount: number | null
          created_at: string
          depreciation_amount: number
          depreciation_rate: number | null
          ending_book_value: number
          id: string
          is_first_year: boolean | null
          section_179_amount: number | null
          tax_year: number
          tracking_id: string
        }
        Insert: {
          beginning_book_value?: number
          bonus_depreciation_amount?: number | null
          created_at?: string
          depreciation_amount?: number
          depreciation_rate?: number | null
          ending_book_value?: number
          id?: string
          is_first_year?: boolean | null
          section_179_amount?: number | null
          tax_year: number
          tracking_id: string
        }
        Update: {
          beginning_book_value?: number
          bonus_depreciation_amount?: number | null
          created_at?: string
          depreciation_amount?: number
          depreciation_rate?: number | null
          ending_book_value?: number
          id?: string
          is_first_year?: boolean | null
          section_179_amount?: number | null
          tax_year?: number
          tracking_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yearly_depreciation_entries_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "product_depreciation_tracking"
            referencedColumns: ["id"]
          },
        ]
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
        | "multi_member_llc"
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
        "multi_member_llc",
        "llc_s_corp",
        "partnership",
        "c_corp",
      ],
    },
  },
} as const
