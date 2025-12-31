-- Add entity_type to businesses table to support different organization types
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS entity_type text DEFAULT 'for_profit';

-- Add tax_classification for more specific tax treatment
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tax_classification text;

-- Add nonprofit-specific fields
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS is_501c3 boolean DEFAULT false;

ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS nonprofit_category text;

ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS church_denomination text;

-- Create 1099 recipients table (contractors, vendors you pay)
CREATE TABLE IF NOT EXISTS public.form_1099_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_type text DEFAULT 'individual', -- individual, business, llc
  tin text, -- SSN or EIN (stored encrypted ideally)
  tin_type text DEFAULT 'ssn', -- ssn, ein
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  email text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_1099_recipients ENABLE ROW LEVEL SECURITY;

-- RLS policies for 1099 recipients
CREATE POLICY "Users can view their own 1099 recipients"
  ON public.form_1099_recipients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own 1099 recipients"
  ON public.form_1099_recipients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 1099 recipients"
  ON public.form_1099_recipients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 1099 recipients"
  ON public.form_1099_recipients FOR DELETE
  USING (auth.uid() = user_id);

-- Create 1099-NEC payments table
CREATE TABLE IF NOT EXISTS public.form_1099_nec_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.form_1099_recipients(id) ON DELETE SET NULL,
  recipient_name text NOT NULL, -- denormalized for easier queries
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric NOT NULL DEFAULT 0,
  description text,
  payment_method text, -- check, ach, cash, venmo, etc
  check_number text,
  box_number integer DEFAULT 1, -- Box 1: Nonemployee compensation, Box 4: Federal tax withheld
  tax_year integer NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  is_1099_required boolean DEFAULT true, -- false if under $600 threshold
  form_generated boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.form_1099_nec_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 1099-NEC payments"
  ON public.form_1099_nec_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own 1099-NEC payments"
  ON public.form_1099_nec_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 1099-NEC payments"
  ON public.form_1099_nec_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 1099-NEC payments"
  ON public.form_1099_nec_payments FOR DELETE
  USING (auth.uid() = user_id);

-- Create 1099-MISC payments table (for rents, royalties, other income)
CREATE TABLE IF NOT EXISTS public.form_1099_misc_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.form_1099_recipients(id) ON DELETE SET NULL,
  recipient_name text NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric NOT NULL DEFAULT 0,
  box_number integer NOT NULL DEFAULT 1,
  -- Box 1: Rents, Box 2: Royalties, Box 3: Other income, Box 4: Fed tax withheld
  -- Box 5: Fishing boat proceeds, Box 6: Medical payments, Box 7: Payer direct sales
  -- Box 8: Substitute payments, Box 9: Crop insurance, Box 10: Gross proceeds attorney
  -- Box 11: Fish purchased for resale, Box 12: Section 409A deferrals, Box 14: Excess golden parachute
  description text,
  payment_method text,
  tax_year integer NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.form_1099_misc_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 1099-MISC payments"
  ON public.form_1099_misc_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own 1099-MISC payments"
  ON public.form_1099_misc_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 1099-MISC payments"
  ON public.form_1099_misc_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 1099-MISC payments"
  ON public.form_1099_misc_payments FOR DELETE
  USING (auth.uid() = user_id);

-- Create 1099-K received tracking (payment processor income)
CREATE TABLE IF NOT EXISTS public.form_1099_k_received (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  payer_name text NOT NULL, -- Stripe, PayPal, Square, etc.
  payer_tin text,
  tax_year integer NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  gross_amount numeric DEFAULT 0, -- Box 1a
  card_not_present numeric DEFAULT 0, -- Box 1b
  payment_card_transactions numeric DEFAULT 0,
  third_party_network_transactions numeric DEFAULT 0,
  january_amount numeric DEFAULT 0,
  february_amount numeric DEFAULT 0,
  march_amount numeric DEFAULT 0,
  april_amount numeric DEFAULT 0,
  may_amount numeric DEFAULT 0,
  june_amount numeric DEFAULT 0,
  july_amount numeric DEFAULT 0,
  august_amount numeric DEFAULT 0,
  september_amount numeric DEFAULT 0,
  october_amount numeric DEFAULT 0,
  november_amount numeric DEFAULT 0,
  december_amount numeric DEFAULT 0,
  state_id text,
  state_income numeric DEFAULT 0,
  federal_withheld numeric DEFAULT 0,
  state_withheld numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.form_1099_k_received ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 1099-K received"
  ON public.form_1099_k_received FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own 1099-K received"
  ON public.form_1099_k_received FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 1099-K received"
  ON public.form_1099_k_received FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 1099-K received"
  ON public.form_1099_k_received FOR DELETE
  USING (auth.uid() = user_id);

-- Create 1099-INT/DIV tracking (investment income)
CREATE TABLE IF NOT EXISTS public.form_1099_investment_income (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  form_type text NOT NULL DEFAULT '1099-INT', -- 1099-INT, 1099-DIV
  payer_name text NOT NULL,
  payer_tin text,
  tax_year integer NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  -- 1099-INT boxes
  interest_income numeric DEFAULT 0, -- Box 1
  early_withdrawal_penalty numeric DEFAULT 0, -- Box 2
  interest_on_savings_bonds numeric DEFAULT 0, -- Box 3
  federal_withheld numeric DEFAULT 0, -- Box 4
  investment_expenses numeric DEFAULT 0, -- Box 5
  foreign_tax_paid numeric DEFAULT 0, -- Box 6
  tax_exempt_interest numeric DEFAULT 0, -- Box 8
  private_activity_bond_interest numeric DEFAULT 0, -- Box 9
  market_discount numeric DEFAULT 0, -- Box 10
  bond_premium numeric DEFAULT 0, -- Box 11
  -- 1099-DIV boxes
  ordinary_dividends numeric DEFAULT 0, -- Box 1a
  qualified_dividends numeric DEFAULT 0, -- Box 1b
  capital_gain_distributions numeric DEFAULT 0, -- Box 2a
  section_1250_gain numeric DEFAULT 0, -- Box 2b
  section_1202_gain numeric DEFAULT 0, -- Box 2c
  collectibles_gain numeric DEFAULT 0, -- Box 2d
  nondividend_distributions numeric DEFAULT 0, -- Box 3
  section_199a_dividends numeric DEFAULT 0, -- Box 5
  exempt_interest_dividends numeric DEFAULT 0, -- Box 12
  state_id text,
  state_withheld numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.form_1099_investment_income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investment income"
  ON public.form_1099_investment_income FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investment income"
  ON public.form_1099_investment_income FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investment income"
  ON public.form_1099_investment_income FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investment income"
  ON public.form_1099_investment_income FOR DELETE
  USING (auth.uid() = user_id);