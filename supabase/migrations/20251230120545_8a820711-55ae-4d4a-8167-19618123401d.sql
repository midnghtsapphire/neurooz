-- Create enum for business structure types
CREATE TYPE public.business_structure AS ENUM (
  'sole_proprietor',
  'single_member_llc', 
  'llc_s_corp',
  'partnership',
  'c_corp'
);

-- Create enum for user role within a business
CREATE TYPE public.business_role AS ENUM (
  'owner',
  'partner',
  'employee',
  'contractor'
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  structure business_structure NOT NULL,
  ein TEXT,
  state TEXT,
  formation_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create business_members table (for partnerships, employees, etc.)
CREATE TABLE public.business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role business_role NOT NULL,
  ownership_percentage NUMERIC(5,2) DEFAULT 0,
  is_passive BOOLEAN DEFAULT false,
  ssn_last_four TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tax_forms table to track required/completed forms
CREATE TABLE public.tax_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.business_members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  form_type TEXT NOT NULL, -- W-4, W-9, 1099, Schedule C, K-1, etc.
  tax_year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, submitted
  form_data JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_forms ENABLE ROW LEVEL SECURITY;

-- Businesses policies - owners can manage their businesses
CREATE POLICY "Users can view their own businesses"
ON public.businesses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own businesses"
ON public.businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
ON public.businesses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own businesses"
ON public.businesses FOR DELETE
USING (auth.uid() = user_id);

-- Business members policies
CREATE POLICY "Business owners can view members"
ON public.business_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Business owners can add members"
ON public.business_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update members"
ON public.business_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Business owners can delete members"
ON public.business_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

-- Tax forms policies
CREATE POLICY "Users can view their tax forms"
ON public.tax_forms FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tax forms"
ON public.tax_forms FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their tax forms"
ON public.tax_forms FOR UPDATE
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their tax forms"
ON public.tax_forms FOR DELETE
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND user_id = auth.uid()
  )
);

-- Update trigger for businesses
CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for business_members
CREATE TRIGGER update_business_members_updated_at
BEFORE UPDATE ON public.business_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for tax_forms
CREATE TRIGGER update_tax_forms_updated_at
BEFORE UPDATE ON public.tax_forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();