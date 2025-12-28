-- Create pricing_tiers table
CREATE TABLE public.pricing_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  yearly_price NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  recommended BOOLEAN NOT NULL DEFAULT false,
  savings_min NUMERIC NOT NULL DEFAULT 0,
  savings_max NUMERIC NOT NULL DEFAULT 0,
  roi_min NUMERIC NOT NULL DEFAULT 0,
  roi_max NUMERIC NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can see pricing)
CREATE POLICY "Anyone can view pricing tiers"
ON public.pricing_tiers
FOR SELECT
USING (true);

-- Create policy for admin updates
CREATE POLICY "Admins can manage pricing tiers"
ON public.pricing_tiers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating timestamps
CREATE TRIGGER update_pricing_tiers_updated_at
BEFORE UPDATE ON public.pricing_tiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing tiers
INSERT INTO public.pricing_tiers (id, name, price, yearly_price, description, features, recommended, savings_min, savings_max, roi_min, roi_max, display_order) VALUES
('free', 'Starter', 0, 0, 'Get started with basic tax tracking', ARRAY['Track up to 50 products', 'Basic tax summary', 'See potential savings (teaser)', 'Tax education content', 'Community forum access'], false, 0, 0, 0, 0, 1),
('tax-smart', 'Tax Smart', 29, 297, 'Everything you need to maximize deductions', ARRAY['Unlimited products & transactions', '50/20/0 auto-calculation', 'Receipt upload with OCR', 'Mileage tracking', 'Home office deduction calculator', 'Schedule C auto-generation', 'Form 8995 (QBI deduction)', 'Quarterly tax estimates', 'Tax form exports (PDF/Excel)', 'Mobile app access', 'Email support'], true, 4300, 7900, 1135, 2171, 2),
('business-builder', 'Business Builder', 39, 397, 'For serious Vine businesses with complex needs', ARRAY['Everything in Tax Smart', 'Multi-entity tracking (up to 3 LLCs)', 'S-Corp vs LLC comparison calculator', 'K-1 generation (partnerships)', 'Rental property tracking (Schedule E)', 'Team members (up to 3 users)', 'Bank sync via Plaid', 'Payroll integration', 'Business structure optimization', 'Workflow automation', 'Priority support (24hr response)'], false, 14300, 17000, 2955, 3533, 3);