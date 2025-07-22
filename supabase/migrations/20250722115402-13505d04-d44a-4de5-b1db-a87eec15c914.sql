-- Criar tabela de profissionais/prestadores de serviços
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  category TEXT NOT NULL, -- ex: 'fotografo', 'dj', 'decorador', 'buffet', etc
  specialties TEXT[], -- array de especialidades
  location TEXT NOT NULL,
  price_range TEXT, -- ex: 'R$ 500 - R$ 1.500'
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  portfolio_images TEXT[], -- array de URLs das imagens do portfólio
  instagram_url TEXT,
  website_url TEXT,
  availability_days TEXT[], -- dias da semana disponíveis
  rating DECIMAL(3,2) DEFAULT 0.00, -- média das avaliações
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profissionais
CREATE POLICY "Todos podem ver profissionais ativos" 
ON public.professionals 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Usuários podem criar seu próprio perfil profissional" 
ON public.professionals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil profissional" 
ON public.professionals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seu próprio perfil profissional" 
ON public.professionals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_professionals_category ON public.professionals(category);
CREATE INDEX idx_professionals_location ON public.professionals(location);
CREATE INDEX idx_professionals_rating ON public.professionals(rating);
CREATE INDEX idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX idx_professionals_active ON public.professionals(is_active);

-- Criar tabela de avaliações dos profissionais
CREATE TABLE public.professional_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, user_id, event_id) -- impede múltiplas avaliações do mesmo usuário para o mesmo profissional no mesmo evento
);

-- Habilitar RLS para avaliações
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para avaliações
CREATE POLICY "Todos podem ver avaliações" 
ON public.professional_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem criar avaliações" 
ON public.professional_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias avaliações" 
ON public.professional_reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias avaliações" 
ON public.professional_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at nas avaliações
CREATE TRIGGER update_professional_reviews_updated_at
BEFORE UPDATE ON public.professional_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para atualizar a média de avaliações do profissional
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar rating e total_reviews do profissional
  UPDATE public.professionals 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.professional_reviews 
      WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.professional_reviews 
      WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
    )
  WHERE id = COALESCE(NEW.professional_id, OLD.professional_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar rating quando avaliações são modificadas
CREATE TRIGGER update_rating_on_review_insert
AFTER INSERT ON public.professional_reviews
FOR EACH ROW
EXECUTE FUNCTION update_professional_rating();

CREATE TRIGGER update_rating_on_review_update
AFTER UPDATE ON public.professional_reviews
FOR EACH ROW
EXECUTE FUNCTION update_professional_rating();

CREATE TRIGGER update_rating_on_review_delete
AFTER DELETE ON public.professional_reviews
FOR EACH ROW
EXECUTE FUNCTION update_professional_rating();