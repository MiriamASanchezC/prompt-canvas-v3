-- Prompt Canvas Database Schema
-- Este archivo contiene todas las tablas necesarias para el proyecto

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended from Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Canvas table - represents the infinite canvas
CREATE TABLE public.canvases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  canvas_data JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table - represents conversation cards on the canvas
CREATE TABLE public.cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canvas_id UUID REFERENCES public.canvases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  width INTEGER DEFAULT 300,
  height INTEGER DEFAULT 200,
  color TEXT DEFAULT '#ffffff',
  card_type TEXT DEFAULT 'conversation', -- 'conversation', 'note', 'template'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table - stores AI conversations
CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  ai_provider TEXT NOT NULL, -- 'openai', 'anthropic', etc.
  model TEXT NOT NULL, -- 'gpt-4', 'claude-3', etc.
  messages JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table - individual messages in conversations
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table - represents connections between cards
CREATE TABLE public.connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  canvas_id UUID REFERENCES public.canvases(id) ON DELETE CASCADE NOT NULL,
  source_card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  target_card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  connection_type TEXT DEFAULT 'related', -- 'related', 'depends_on', 'similar'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table - reusable card templates
CREATE TABLE public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_canvases_user_id ON public.canvases(user_id);
CREATE INDEX idx_cards_canvas_id ON public.cards(canvas_id);
CREATE INDEX idx_cards_user_id ON public.cards(user_id);
CREATE INDEX idx_conversations_card_id ON public.conversations(card_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_connections_canvas_id ON public.connections(canvas_id);
CREATE INDEX idx_connections_source_card ON public.connections(source_card_id);
CREATE INDEX idx_connections_target_card ON public.connections(target_card_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Canvases policies
CREATE POLICY "Users can view own canvases" ON public.canvases
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create canvases" ON public.canvases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own canvases" ON public.canvases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own canvases" ON public.canvases
  FOR DELETE USING (auth.uid() = user_id);

-- Cards policies
CREATE POLICY "Users can view cards in accessible canvases" ON public.cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can create cards in own canvases" ON public.cards
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cards" ON public.cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON public.cards
  FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Connections policies
CREATE POLICY "Users can view connections in accessible canvases" ON public.connections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can create connections in own canvases" ON public.connections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update connections in own canvases" ON public.connections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete connections in own canvases" ON public.connections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.canvases 
      WHERE id = canvas_id AND user_id = auth.uid()
    )
  );

-- Templates policies
CREATE POLICY "Users can view public templates and own templates" ON public.templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create templates" ON public.templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.templates
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_canvases_updated_at BEFORE UPDATE ON public.canvases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
