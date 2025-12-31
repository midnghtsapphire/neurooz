-- Create table for tracking employer education benefits
CREATE TABLE public.employer_education_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  employee_name TEXT NOT NULL,
  employee_email TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_type TEXT NOT NULL DEFAULT 'tuition',
  description TEXT,
  tax_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  documentation_notes TEXT,
  is_student_loan_payment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employer_education_benefits ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own education benefits" 
ON public.employer_education_benefits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own education benefits" 
ON public.employer_education_benefits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education benefits" 
ON public.employer_education_benefits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education benefits" 
ON public.employer_education_benefits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employer_education_benefits_updated_at
BEFORE UPDATE ON public.employer_education_benefits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();