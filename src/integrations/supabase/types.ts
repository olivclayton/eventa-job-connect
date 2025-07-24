export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      event_applications: {
        Row: {
          applicant_id: string
          application_type: string
          applied_at: string
          contact_preference: string | null
          event_id: string
          id: string
          message: string | null
          price_proposal: number | null
          professional_id: string
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          application_type?: string
          applied_at?: string
          contact_preference?: string | null
          event_id: string
          id?: string
          message?: string | null
          price_proposal?: number | null
          professional_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          application_type?: string
          applied_at?: string
          contact_preference?: string | null
          event_id?: string
          id?: string
          message?: string | null
          price_proposal?: number | null
          professional_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          application_deadline: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_participants: number | null
          date: string
          description: string | null
          end_time: string
          id: string
          image_url: string | null
          location: string
          max_participants: number | null
          price: number | null
          required_professionals: Json | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_participants?: number | null
          date: string
          description?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          location: string
          max_participants?: number | null
          price?: number | null
          required_professionals?: Json | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_participants?: number | null
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number | null
          price?: number | null
          required_professionals?: Json | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string
          cover_letter: string | null
          id: string
          job_id: string
          professional_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id: string
          professional_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id?: string
          professional_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_applicants: number | null
          description: string | null
          employment_type: string
          end_date: string | null
          experience_level: string | null
          id: string
          is_featured: boolean | null
          location: string
          max_applicants: number | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_applicants?: number | null
          description?: string | null
          employment_type?: string
          end_date?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          location: string
          max_applicants?: number | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_applicants?: number | null
          description?: string | null
          employment_type?: string
          end_date?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string
          max_applicants?: number | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_reviews: {
        Row: {
          comment: string | null
          created_at: string
          event_id: string | null
          id: string
          professional_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          professional_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          professional_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          availability_days: string[] | null
          bio: string | null
          category: string
          created_at: string
          email: string
          id: string
          instagram_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          location: string
          max_price: number | null
          min_price: number | null
          name: string
          phone: string | null
          portfolio_images: string[] | null
          price_range: string | null
          rating: number | null
          specialties: string[] | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          availability_days?: string[] | null
          bio?: string | null
          category: string
          created_at?: string
          email: string
          id?: string
          instagram_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location: string
          max_price?: number | null
          min_price?: number | null
          name: string
          phone?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          availability_days?: string[] | null
          bio?: string | null
          category?: string
          created_at?: string
          email?: string
          id?: string
          instagram_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string
          max_price?: number | null
          min_price?: number | null
          name?: string
          phone?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
