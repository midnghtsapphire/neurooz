-- User tax profiles for different tax situations
CREATE TABLE public.user_tax_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tax_profile_type text NOT NULL DEFAULT 'mixed_income' CHECK (tax_profile_type IN ('passive_investor', 'active_w2_employee', 'self_employed', 'gig_worker', 'mixed_income')),
  has_w2_income boolean DEFAULT false,
  has_1099_income boolean DEFAULT false,
  has_passive_income boolean DEFAULT false,
  has_ssdi boolean DEFAULT false,
  filing_status text DEFAULT 'single' CHECK (filing_status IN ('single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household', 'qualifying_widow')),
  -- Accessibility settings
  hearing_impaired boolean DEFAULT false,
  vision_impaired boolean DEFAULT false,
  preferred_font_size text DEFAULT 'normal' CHECK (preferred_font_size IN ('normal', 'large', 'extra-large')),
  high_contrast_mode boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Income sources for tracking multiple jobs/gigs
CREATE TABLE public.income_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('w2_employer', '1099_contractor', 'gig_platform', 'business_income', 'rental_income', 'ssdi', 'k1_distribution')),
  source_name text NOT NULL,
  employer_ein text,
  payer_tin text,
  platform_type text CHECK (platform_type IN ('rover', 'uber', 'lyft', 'doordash', 'instacart', 'ztrip', 'amazon_vine', 'other')),
  is_active boolean DEFAULT true,
  year_started integer,
  year_ended integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_tax_profiles
CREATE POLICY "Users can view their own tax profile"
  ON public.user_tax_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax profile"
  ON public.user_tax_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax profile"
  ON public.user_tax_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for income_sources
CREATE POLICY "Users can view their own income sources"
  ON public.income_sources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income sources"
  ON public.income_sources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income sources"
  ON public.income_sources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income sources"
  ON public.income_sources FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_tax_profiles_updated_at
  BEFORE UPDATE ON public.user_tax_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_sources_updated_at
  BEFORE UPDATE ON public.income_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();