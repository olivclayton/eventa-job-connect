-- Corrigir função para definir search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- Define search_path vazio para segurança
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;