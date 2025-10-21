import { createClient } from '@supabase/supabase-js';

// Valores temporales para desarrollo - reemplazar con valores reales
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'temp-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for our database
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Canvas {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  canvas_data: any;
  settings: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  canvas_id: string;
  user_id: string;
  title: string;
  content?: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  color: string;
  card_type: 'conversation' | 'note' | 'template';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  card_id: string;
  user_id: string;
  title: string;
  ai_provider: string;
  model: string;
  messages: any[];
  settings: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: any;
  created_at: string;
}

export interface Connection {
  id: string;
  canvas_id: string;
  source_card_id: string;
  target_card_id: string;
  connection_type: string;
  metadata: any;
  created_at: string;
}
