-- Create table for tax deduction rules with max amounts, caveats, and proof requirements
CREATE TABLE public.tax_deduction_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  deduction_name TEXT NOT NULL,
  max_amount NUMERIC,
  max_amount_description TEXT,
  can_be_increased BOOLEAN DEFAULT false,
  increase_conditions TEXT[],
  increase_amounts JSONB,
  proof_required TEXT[],
  applicable_forms TEXT[],
  business_types TEXT[],
  tax_year INTEGER NOT NULL DEFAULT 2024,
  notes TEXT,
  irs_reference TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_deduction_rules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view (reference data)
CREATE POLICY "Anyone can view tax deduction rules"
  ON public.tax_deduction_rules
  FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage tax deduction rules"
  ON public.tax_deduction_rules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert comprehensive tax deduction rules for 2024/2025
INSERT INTO public.tax_deduction_rules (category, deduction_name, max_amount, max_amount_description, can_be_increased, increase_conditions, increase_amounts, proof_required, applicable_forms, business_types, tax_year, notes, irs_reference, display_order) VALUES

-- Section 179
('depreciation', 'Section 179 Deduction', 1160000, 'Maximum Section 179 deduction for 2024', true, 
  ARRAY['Phase-out begins at $2,890,000 of total equipment placed in service', 'Married filing separately gets half'],
  '{"phase_out_threshold": 2890000, "dollar_for_dollar_reduction": true}'::jsonb,
  ARRAY['Purchase invoice or receipt', 'Date equipment placed in service', 'Business use percentage documentation', 'Photos of equipment in business use'],
  ARRAY['Schedule C', 'Form 4562'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Deduction cannot exceed taxable income from active conduct of trade/business', 'IRC Section 179', 1),

-- Bonus Depreciation
('depreciation', 'Bonus Depreciation', NULL, '60% of cost for 2024 (phasing down 20% per year)', true,
  ARRAY['100% for property acquired before 9/28/2017', 'Used property qualifies if new to taxpayer', 'No taxable income limitation unlike Section 179'],
  '{"2023": 80, "2024": 60, "2025": 40, "2026": 20, "2027": 0}'::jsonb,
  ARRAY['Purchase documentation', 'Date placed in service', 'Proof asset is new to taxpayer', 'Business use records'],
  ARRAY['Schedule C', 'Form 4562'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Can create net operating loss unlike Section 179', 'IRC Section 168(k)', 2),

-- Vehicle/Mileage
('vehicle', 'Standard Mileage Rate', 0.67, '$0.67 per mile for 2024', true,
  ARRAY['Must use standard mileage rate in first year to use it later', 'Can switch to actual expenses anytime', 'Cannot use if operating 5+ vehicles simultaneously'],
  '{"2024": 0.67, "2023": 0.655, "medical_moving_2024": 0.21}'::jsonb,
  ARRAY['Mileage log with date, destination, business purpose, and odometer readings', 'Calendar or app records', 'Business purpose for each trip'],
  ARRAY['Schedule C'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp'],
  2024, 'Includes gas, insurance, repairs, depreciation', 'IRS Rev. Proc. 2019-46', 3),

-- Vehicle Actual Expense Depreciation Limits
('vehicle', 'Luxury Auto Depreciation Limit', 12200, 'Year 1 max depreciation for passenger autos (2024)', true,
  ARRAY['Add $8,000 bonus depreciation if elected', 'Trucks and vans have higher limits', 'Electric vehicles may have different treatment'],
  '{"year_1": 12200, "year_1_with_bonus": 20200, "year_2": 19500, "year_3": 11700, "year_4_plus": 6960}'::jsonb,
  ARRAY['Vehicle purchase documents', 'Odometer readings', 'Maintenance records', 'Insurance showing business use'],
  ARRAY['Form 4562'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Limits apply to vehicles with GVW under 6,000 lbs', 'IRC Section 280F', 4),

-- Home Office
('home_office', 'Simplified Home Office', 1500, '$5 per sq ft, max 300 sq ft = $1,500', false,
  ARRAY['Cannot exceed gross income from business', 'Cannot carry forward unused deduction'],
  '{"rate_per_sqft": 5, "max_sqft": 300}'::jsonb,
  ARRAY['Floor plan or measurements', 'Photos of dedicated workspace', 'Proof of regular and exclusive business use'],
  ARRAY['Schedule C', 'Form 8829'],
  ARRAY['sole_proprietor', 'single_member_llc'],
  2024, 'No depreciation recapture on sale of home', 'Rev. Proc. 2013-13', 5),

('home_office', 'Regular Home Office Method', NULL, 'Actual expenses prorated by square footage', true,
  ARRAY['Can deduct mortgage interest, utilities, insurance, repairs', 'Can carry forward unused deduction', 'Must track actual expenses'],
  '{"allocation_methods": ["square_footage", "room_count"]}'::jsonb,
  ARRAY['Utility bills', 'Mortgage statements', 'Property tax records', 'Homeowners insurance', 'Repair receipts', 'Floor plan with office measurements'],
  ARRAY['Schedule C', 'Form 8829'],
  ARRAY['sole_proprietor', 'single_member_llc'],
  2024, 'Subject to depreciation recapture on home sale', 'IRC Section 280A', 6),

-- Meals and Entertainment
('meals', 'Business Meals', NULL, '50% of actual cost (was 100% for 2021-2022)', false,
  ARRAY['Client must be present or meal directly related to business', 'Must document business purpose'],
  '{"deduction_percentage": 50}'::jsonb,
  ARRAY['Receipt with amount, date, place', 'Names of attendees', 'Business purpose and discussion topics', 'Business relationship to attendees'],
  ARRAY['Schedule C'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Entertainment expenses are no longer deductible since 2018', 'IRC Section 274', 7),

-- Health Insurance
('health', 'Self-Employed Health Insurance', NULL, '100% of premiums for self, spouse, and dependents', true,
  ARRAY['Cannot exceed net self-employment income', 'Cannot claim if eligible for employer plan', 'Includes dental and long-term care (age-limited)'],
  '{"ltc_limits_2024": {"40_and_under": 470, "41_to_50": 880, "51_to_60": 1760, "61_to_70": 4710, "over_70": 5880}}'::jsonb,
  ARRAY['Insurance premium statements', 'Proof of self-employment', 'Evidence not eligible for employer coverage'],
  ARRAY['Schedule 1', 'Form 1040'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp'],
  2024, 'Reduces AGI, not Schedule C deduction', 'IRC Section 162(l)', 8),

-- Retirement
('retirement', 'SEP-IRA Contribution', NULL, '25% of net self-employment earnings, max $69,000 for 2024', true,
  ARRAY['Must contribute same percentage for all eligible employees', 'Deadline extended to tax filing deadline with extensions'],
  '{"max_2024": 69000, "max_percentage": 25}'::jsonb,
  ARRAY['SEP-IRA plan documents', 'Contribution confirmation from custodian', 'Calculation worksheet'],
  ARRAY['Schedule 1', 'Form 1040'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership'],
  2024, 'Net SE earnings = net profit minus 1/2 SE tax', 'IRC Section 408(k)', 9),

('retirement', 'Solo 401(k) Contribution', NULL, 'Employee: $23,000 + Employer: 25% of comp, total max $69,000', true,
  ARRAY['Catch-up of $7,500 if age 50+', 'Can make Roth employee contributions', 'No employees allowed except spouse'],
  '{"employee_2024": 23000, "catchup_50_plus": 7500, "total_max": 69000}'::jsonb,
  ARRAY['Plan adoption agreement', 'Contribution records', 'Form 5500-EZ if over $250k'],
  ARRAY['Schedule 1', 'Form 1040'],
  ARRAY['sole_proprietor', 'single_member_llc'],
  2024, 'Can borrow from plan up to $50k', 'IRC Section 401(k)', 10),

-- QBI
('qbi', 'Qualified Business Income Deduction', NULL, '20% of QBI, subject to income limits', true,
  ARRAY['W-2 wage limitation kicks in above threshold', 'SSTB limitations above threshold', 'Can combine with 199A REIT/PTP income'],
  '{"deduction_rate": 20, "2024_threshold_single": 191950, "2024_threshold_mfj": 383900, "phase_in_range": 50000}'::jsonb,
  ARRAY['Schedule C or K-1 showing QBI', 'W-2 wages paid (if applicable)', 'Unadjusted basis of qualified property'],
  ARRAY['Form 8995', 'Form 8995-A'],
  ARRAY['sole_proprietor', 'single_member_llc', 'partnership'],
  2024, 'Not available for C-corps', 'IRC Section 199A', 11),

-- IRWE for Disability
('disability', 'Impairment-Related Work Expenses', NULL, 'No limit - full deduction for qualifying expenses', true,
  ARRAY['Must be necessary for employment', 'Must be due to disability', 'Doctor verification strengthens claim'],
  '{"deduction_percentage": 100}'::jsonb,
  ARRAY['Medical documentation of disability', 'Receipts for expenses', 'Letter from doctor stating expense necessity', 'Proof expense is for work (not personal)'],
  ARRAY['Schedule A', 'Form 2106'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Deductible even if not itemizing; reduces countable income for SGA', 'IRC Section 67(d)', 12),

-- Charitable
('charitable', 'Charitable Contributions', NULL, 'Up to 60% of AGI for cash, 30% for appreciated property', true,
  ARRAY['Carryforward 5 years for excess', 'Qualified conservation contributions can be 100% AGI', 'Must be to qualified 501(c)(3)'],
  '{"cash_limit_pct": 60, "property_limit_pct": 30, "carryforward_years": 5}'::jsonb,
  ARRAY['Receipt from charity', 'Written acknowledgment for gifts over $250', 'Appraisal for property over $5,000', 'Form 8283 for non-cash over $500'],
  ARRAY['Schedule A'],
  ARRAY['sole_proprietor', 'single_member_llc', 'llc_s_corp', 'partnership', 'c_corp'],
  2024, 'Non-cash donations require FMV documentation', 'IRC Section 170', 13),

-- Amazon Vine Specific
('vine', 'Amazon Vine 50/20/0 Method', NULL, 'Reduces ETV based on item category', true,
  ARRAY['Brand items: 50% reduction', 'Non-brand items: 20% reduction', 'Broken/defective: 100% reduction'],
  '{"brand_reduction": 50, "non_brand_reduction": 20, "broken_reduction": 100}'::jsonb,
  ARRAY['Amazon Vine order history', 'Screenshots of ETV values', 'Photos of broken items', 'Documentation of testing/review work', 'Evidence of non-brand status'],
  ARRAY['Schedule C'],
  ARRAY['sole_proprietor', 'single_member_llc'],
  2024, 'Based on legitimate business expense argument for testing materials', NULL, 14);

-- Create index for common queries
CREATE INDEX idx_tax_deduction_rules_category ON public.tax_deduction_rules(category);
CREATE INDEX idx_tax_deduction_rules_tax_year ON public.tax_deduction_rules(tax_year);

-- Create updated_at trigger
CREATE TRIGGER update_tax_deduction_rules_updated_at
  BEFORE UPDATE ON public.tax_deduction_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();