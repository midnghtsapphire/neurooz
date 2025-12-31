-- Create donation tracking table
CREATE TABLE public.donation_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  source_product_id UUID REFERENCES public.products_review_insights(id) ON DELETE SET NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Charity information
  charity_name TEXT NOT NULL,
  charity_ein TEXT,
  charity_address TEXT,
  charity_city TEXT,
  charity_state TEXT,
  charity_zip TEXT,
  is_501c3 BOOLEAN DEFAULT true,
  
  -- Valuation
  original_etv NUMERIC DEFAULT 0,
  fair_market_value NUMERIC DEFAULT 0,
  cost_basis NUMERIC DEFAULT 0, -- Usually $0 for Vine
  condition_at_donation TEXT DEFAULT 'good',
  valuation_method TEXT DEFAULT 'comparable_sales', -- comparable_sales, replacement_cost, qualified_appraisal
  comparable_evidence TEXT,
  
  -- Documentation
  acknowledgment_received BOOLEAN DEFAULT false,
  acknowledgment_date DATE,
  receipt_number TEXT,
  appraisal_required BOOLEAN DEFAULT false, -- Required if FMV > $5,000
  appraiser_name TEXT,
  appraiser_ein TEXT,
  
  -- Form 8283 tracking
  form_8283_section TEXT, -- 'A' for $500-$5000, 'B' for over $5000
  included_in_tax_year INTEGER,
  
  -- Photos and notes
  photo_urls TEXT[],
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own donations"
  ON public.donation_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own donations"
  ON public.donation_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donations"
  ON public.donation_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donations"
  ON public.donation_records FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_donation_records_updated_at
  BEFORE UPDATE ON public.donation_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create saved charities table for reuse
CREATE TABLE public.saved_charities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  charity_name TEXT NOT NULL,
  ein TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  is_501c3 BOOLEAN DEFAULT true,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  total_donations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_charities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own saved charities"
  ON public.saved_charities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved charities"
  ON public.saved_charities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved charities"
  ON public.saved_charities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved charities"
  ON public.saved_charities FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_saved_charities_updated_at
  BEFORE UPDATE ON public.saved_charities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();