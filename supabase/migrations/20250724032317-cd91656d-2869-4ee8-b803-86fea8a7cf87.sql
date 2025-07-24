-- Create event_applications table for professionals to apply to events
CREATE TABLE public.event_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL, -- User ID of the applicant
  message TEXT,
  application_type TEXT NOT NULL DEFAULT 'phone', -- 'phone', 'chat', 'email'
  contact_preference TEXT,
  price_proposal NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent duplicate applications
  UNIQUE(event_id, professional_id)
);

-- Enable RLS
ALTER TABLE public.event_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for event_applications
CREATE POLICY "Event creators can view applications for their events" 
ON public.event_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_applications.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Professional applicants can view their applications" 
ON public.event_applications 
FOR SELECT 
USING (auth.uid() = applicant_id);

CREATE POLICY "Professionals can create applications" 
ON public.event_applications 
FOR INSERT 
WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Professional applicants can update their applications" 
ON public.event_applications 
FOR UPDATE 
USING (auth.uid() = applicant_id);

CREATE POLICY "Event creators can update applications status" 
ON public.event_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_applications.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Professional applicants can delete their applications" 
ON public.event_applications 
FOR DELETE 
USING (auth.uid() = applicant_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_event_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_event_applications_updated_at
BEFORE UPDATE ON public.event_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_event_applications_updated_at();

-- Add additional fields to events table for better professional application handling
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS required_professionals JSONB,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS application_deadline DATE;

-- Update existing events to have contact info (optional)
COMMENT ON COLUMN public.events.required_professionals IS 'JSON array of required professional categories for this event';
COMMENT ON COLUMN public.events.contact_email IS 'Contact email for event applications';
COMMENT ON COLUMN public.events.contact_phone IS 'Contact phone for event applications';
COMMENT ON COLUMN public.events.application_deadline IS 'Deadline for professionals to apply';