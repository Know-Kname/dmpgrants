import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          updated_at?: string
        }
      }
      work_orders: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          priority: string
          status: string
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          priority: string
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          updated_at?: string
        }
      }
      grants: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          source: string
          amount: number | null
          deadline: string | null
          status: string
          application_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          source: string
          amount?: number | null
          deadline?: string | null
          status?: string
          application_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          source?: string
          amount?: number | null
          deadline?: string | null
          status?: string
          application_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
    }
  }
}
