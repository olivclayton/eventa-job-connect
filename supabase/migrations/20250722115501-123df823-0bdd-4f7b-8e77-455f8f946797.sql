-- Corrigir função para definir search_path adequadamente
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';