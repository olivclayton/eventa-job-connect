-- Criar tabela de vagas/jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  employment_type TEXT NOT NULL DEFAULT 'temporary', -- temporary, permanent, contract
  experience_level TEXT DEFAULT 'entry', -- entry, mid, senior
  requirements TEXT[],
  benefits TEXT[],
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  max_applicants INTEGER,
  current_applicants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, paused, closed, filled
  is_featured BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para jobs
CREATE POLICY "Todos podem ver vagas ativas" 
ON public.jobs 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Usuários podem criar suas próprias vagas" 
ON public.jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias vagas" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias vagas" 
ON public.jobs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para candidaturas
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Habilitar RLS para candidaturas
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para candidaturas
CREATE POLICY "Usuários podem ver candidaturas para suas vagas" 
ON public.job_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_applications.job_id 
    AND jobs.user_id = auth.uid()
  )
  OR applicant_id = auth.uid()
);

CREATE POLICY "Usuários podem candidatar-se a vagas" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias candidaturas" 
ON public.job_applications 
FOR UPDATE 
USING (
  applicant_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_applications.job_id 
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar suas próprias candidaturas" 
ON public.job_applications 
FOR DELETE 
USING (applicant_id = auth.uid());

-- Trigger para atualizar updated_at nas candidaturas
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para atualizar contador de candidatos
CREATE OR REPLACE FUNCTION public.update_job_applicants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs 
    SET current_applicants = current_applicants + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs 
    SET current_applicants = current_applicants - 1
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar contador automaticamente
CREATE TRIGGER update_job_applicants_count_trigger
  AFTER INSERT OR DELETE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_job_applicants_count();