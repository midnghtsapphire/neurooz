-- Add donation eligibility tracking fields
ALTER TABLE public.products_review_insights 
ADD COLUMN IF NOT EXISTS donation_eligible_date date,
ADD COLUMN IF NOT EXISTS order_number text,
ADD COLUMN IF NOT EXISTS shipped_date date,
ADD COLUMN IF NOT EXISTS is_cancelled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS first_year_depreciation numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS depreciation_method text DEFAULT 'none';

-- Create a trigger to auto-calculate donation eligible date (6 months from order date)
CREATE OR REPLACE FUNCTION public.calculate_donation_eligible_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Set donation eligible date to 6 months after order date
  NEW.donation_eligible_date := NEW.order_date + INTERVAL '6 months';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS set_donation_eligible_date ON public.products_review_insights;

-- Create trigger for new inserts and updates
CREATE TRIGGER set_donation_eligible_date
BEFORE INSERT OR UPDATE OF order_date ON public.products_review_insights
FOR EACH ROW
EXECUTE FUNCTION public.calculate_donation_eligible_date();

-- Update existing records to have donation eligible dates
UPDATE public.products_review_insights 
SET donation_eligible_date = order_date + INTERVAL '6 months'
WHERE donation_eligible_date IS NULL;