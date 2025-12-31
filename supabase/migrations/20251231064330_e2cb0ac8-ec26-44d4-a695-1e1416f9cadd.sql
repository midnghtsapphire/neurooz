-- Create table for tracking tax law changes over time
CREATE TABLE public.tax_law_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  law_name TEXT NOT NULL,
  law_abbreviation TEXT,
  effective_date DATE NOT NULL,
  expiration_date DATE,
  is_permanent BOOLEAN DEFAULT false,
  provision_category TEXT NOT NULL,
  provision_name TEXT NOT NULL,
  
  -- Before the law values
  pre_law_value TEXT,
  pre_law_description TEXT,
  
  -- During the law values (current)
  current_value TEXT,
  current_description TEXT,
  
  -- After expiration values (what it reverts to)
  post_expiration_value TEXT,
  post_expiration_description TEXT,
  
  -- Percentage changes if applicable
  change_percentage NUMERIC,
  change_direction TEXT, -- 'increased', 'decreased', 'eliminated', 'created', 'modified'
  
  -- Status tracking
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'extended', 'modified'
  extension_history JSONB DEFAULT '[]'::jsonb,
  
  -- Additional context
  affected_taxpayers TEXT[],
  proof_documentation TEXT[],
  irs_reference TEXT,
  notes TEXT,
  
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_law_changes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view (reference data)
CREATE POLICY "Anyone can view tax law changes"
  ON public.tax_law_changes
  FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage tax law changes"
  ON public.tax_law_changes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert TCJA provisions with before/during/after values
INSERT INTO public.tax_law_changes (law_name, law_abbreviation, effective_date, expiration_date, is_permanent, provision_category, provision_name, pre_law_value, pre_law_description, current_value, current_description, post_expiration_value, post_expiration_description, change_direction, affected_taxpayers, notes, irs_reference, display_order) VALUES

-- Standard Deduction
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Standard Deduction',
  '$6,500 single / $13,000 MFJ', 'Pre-2018 standard deduction amounts (2017 values)',
  '$14,600 single / $29,200 MFJ', '2024 standard deduction amounts (nearly doubled from pre-TCJA)',
  '~$8,300 single / ~$16,600 MFJ', 'Reverts to pre-TCJA formula indexed for inflation (~2026 estimate)',
  'increased',
  ARRAY['All individual taxpayers'],
  'TCJA nearly doubled the standard deduction but eliminated personal exemptions. Net effect varies by family size.',
  'IRC Section 63', 1),

-- Personal Exemptions
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Personal Exemptions',
  '$4,050 per person', 'Each taxpayer and dependent could claim a personal exemption (2017)',
  '$0', 'Personal exemptions eliminated 2018-2025',
  '~$5,300 per person', 'Personal exemptions return after 2025, indexed for inflation',
  'eliminated',
  ARRAY['All individual taxpayers', 'Large families'],
  'Elimination hurts large families despite larger standard deduction. Families with 4+ dependents may pay more.',
  'IRC Section 151', 2),

-- Tax Brackets
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'rates', 'Individual Tax Rates',
  '10%, 15%, 25%, 28%, 33%, 35%, 39.6%', 'Seven brackets with top rate of 39.6%',
  '10%, 12%, 22%, 24%, 32%, 35%, 37%', 'Seven brackets with lower rates across most income levels',
  '10%, 15%, 25%, 28%, 33%, 35%, 39.6%', 'Rates revert to 2017 structure with inflation adjustments',
  'decreased',
  ARRAY['All individual taxpayers'],
  'Most taxpayers see lower rates. 15% became 12%, 25% became 22%, 28% became 24%, etc.',
  'IRC Section 1', 3),

-- SALT Cap
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'State and Local Tax (SALT) Deduction',
  'Unlimited', 'Full deduction for state/local income, property, and sales taxes',
  '$10,000 cap', 'Limited to $10,000 total for state and local taxes combined',
  'Unlimited', 'Cap expires, full deduction restored after 2025',
  'decreased',
  ARRAY['High-income taxpayers', 'Residents of high-tax states'],
  'Major impact on CA, NY, NJ, CT residents. Does not apply to AMT.',
  'IRC Section 164', 4),

-- Child Tax Credit
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'credits', 'Child Tax Credit',
  '$1,000 per child', 'Maximum credit per qualifying child under 17',
  '$2,000 per child', 'Doubled credit, higher income phaseout thresholds',
  '$1,000 per child', 'Reverts to pre-TCJA amount (worth less after inflation)',
  'increased',
  ARRAY['Families with children', 'Higher-income families'],
  'Refundable portion increased to $1,700 (2024). Phaseout starts at $400k MFJ vs $110k pre-TCJA.',
  'IRC Section 24', 5),

-- QBI Deduction (199A)
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Qualified Business Income (QBI) Deduction',
  'N/A - Did not exist', 'No deduction for pass-through business income',
  '20% of QBI', 'New deduction for sole proprietors, partnerships, S-corps',
  'N/A - Eliminated', 'QBI deduction expires entirely after 2025',
  'created',
  ARRAY['Self-employed', 'Small business owners', 'Amazon Vine participants'],
  'Subject to income limits and SSTB restrictions. Major benefit for Vine reviewers.',
  'IRC Section 199A', 6),

-- Mortgage Interest
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Mortgage Interest Deduction',
  '$1M acquisition + $100K HELOC', 'Deduct interest on first $1M mortgage debt plus home equity',
  '$750K acquisition only', 'New mortgages limited to $750K, HELOC interest not deductible unless for home improvement',
  '$1M acquisition + $100K HELOC', 'Pre-TCJA limits restored after 2025',
  'decreased',
  ARRAY['Homeowners with large mortgages', 'HELOC users'],
  'Pre-Dec 2017 mortgages grandfathered at $1M. HELOC for improvements still deductible.',
  'IRC Section 163(h)', 7),

-- AMT Exemption
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'amt', 'Alternative Minimum Tax Exemption',
  '$86,200 MFJ (2017)', 'Lower exemption with lower phaseout threshold',
  '$133,300 MFJ (2024)', 'Significantly higher exemption and phaseout thresholds',
  '~$110,000 MFJ', 'Reverts to pre-TCJA formula, more taxpayers subject to AMT',
  'increased',
  ARRAY['Upper-middle-income taxpayers', 'Taxpayers with large deductions'],
  'Dramatically reduced number of AMT filers from ~5M to ~200K.',
  'IRC Section 55', 8),

-- Estate Tax Exemption
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'estate', 'Estate Tax Exemption',
  '$5.49M single / $10.98M couple (2017)', 'Inflation-indexed exemption amount',
  '$13.61M single / $27.22M couple (2024)', 'Doubled exemption from pre-TCJA levels',
  '~$7M single / ~$14M couple', 'Reverts to pre-TCJA formula after 2025',
  'increased',
  ARRAY['High-net-worth individuals', 'Family business owners'],
  'Consider gifting strategies before 2026. Use portability for married couples.',
  'IRC Section 2010', 9),

-- Miscellaneous Itemized Deductions
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Miscellaneous Itemized Deductions (2% Floor)',
  'Deductible above 2% AGI', 'Tax prep fees, investment expenses, unreimbursed employee expenses',
  'Not deductible', 'Suspended 2018-2025',
  'Deductible above 2% AGI', 'Returns after 2025',
  'eliminated',
  ARRAY['Employees with unreimbursed expenses', 'Investors'],
  'Includes union dues, tax prep fees, investment advisor fees, home office for employees.',
  'IRC Section 67', 10),

-- Moving Expenses
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Moving Expense Deduction',
  'Deductible if 50+ miles', 'Deduction for job-related moving expenses',
  'Not deductible (except military)', 'Suspended for non-military 2018-2025',
  'Deductible if 50+ miles', 'Returns for all taxpayers after 2025',
  'eliminated',
  ARRAY['Job changers', 'Relocating employees'],
  'Active duty military can still deduct moving expenses.',
  'IRC Section 217', 11),

-- Alimony
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', NULL, true,
  'deductions', 'Alimony Deduction/Income',
  'Deductible by payer, income to recipient', 'Pre-2019 divorce agreements',
  'Not deductible, not income', 'For divorces finalized after Dec 31, 2018 - PERMANENT',
  'N/A - Permanent change', 'This change is permanent, not sunsetting',
  'eliminated',
  ARRAY['Divorced individuals', 'Alimony payers/recipients'],
  'Applies to divorces finalized after 12/31/2018. Pre-2019 divorces grandfathered unless modified.',
  'IRC Section 215', 12),

-- Corporate Tax Rate (PERMANENT)
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', NULL, true,
  'business', 'Corporate Tax Rate',
  '35%', 'Top marginal rate on corporate income',
  '21%', 'Flat rate on all corporate income - PERMANENT',
  'N/A - Permanent', 'Does not expire',
  'decreased',
  ARRAY['C-corporations'],
  'One of the few TCJA provisions that is permanent. Reduced from progressive 15-35% to flat 21%.',
  'IRC Section 11', 13),

-- Bonus Depreciation
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2026-12-31', false,
  'depreciation', 'Bonus Depreciation',
  '50%', 'First-year bonus depreciation rate',
  '60% (2024)', 'Phasing down: 100% (2017-22), 80% (2023), 60% (2024), 40% (2025), 20% (2026), 0% (2027+)',
  '0%', 'Fully phased out after 2026',
  'increased',
  ARRAY['All businesses', 'Equipment purchasers'],
  'Used property now qualifies. Phases down 20% per year starting 2023.',
  'IRC Section 168(k)', 14),

-- ACA Individual Mandate (PERMANENT)
('Tax Cuts and Jobs Act', 'TCJA', '2019-01-01', NULL, true,
  'healthcare', 'ACA Individual Mandate Penalty',
  '$695/adult or 2.5% of income', 'Penalty for not having health insurance',
  '$0', 'Penalty zeroed out - PERMANENT',
  'N/A - Permanent', 'Does not expire',
  'eliminated',
  ARRAY['Uninsured individuals'],
  'Some states (CA, NJ, MA, DC, RI) have their own mandates.',
  'IRC Section 5000A', 15),

-- Chained CPI (PERMANENT)
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', NULL, true,
  'indexing', 'Inflation Adjustment Method',
  'CPI-U', 'Traditional Consumer Price Index',
  'Chained CPI-U', 'Slower-growing index - PERMANENT',
  'N/A - Permanent', 'Does not expire',
  'modified',
  ARRAY['All taxpayers'],
  'Results in slower bracket adjustments over time, effective gradual tax increase.',
  'IRC Section 1(f)', 16),

-- Medical Expense Threshold (PERMANENT via later legislation)
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', NULL, true,
  'deductions', 'Medical Expense Deduction Threshold',
  '10% of AGI', 'Pre-TCJA threshold for deducting medical expenses',
  '7.5% of AGI', 'Lower threshold made permanent by later legislation',
  'N/A - Permanent', 'Made permanent, does not expire',
  'decreased',
  ARRAY['Taxpayers with high medical expenses', 'Seniors', 'Disabled individuals'],
  'Originally temporary in TCJA, made permanent by subsequent legislation.',
  'IRC Section 213', 17),

-- Pease Limitation
('Tax Cuts and Jobs Act', 'TCJA', '2018-01-01', '2025-12-31', false,
  'deductions', 'Pease Limitation on Itemized Deductions',
  '3% reduction above $320K MFJ', 'Itemized deductions reduced for high-income taxpayers',
  'Suspended', 'No phasedown of itemized deductions 2018-2025',
  '3% reduction returns', 'Returns after 2025 for high-income itemizers',
  'eliminated',
  ARRAY['High-income itemizers'],
  'Previously reduced itemized deductions by 3% of income above threshold.',
  'IRC Section 68', 18);

-- Create indexes
CREATE INDEX idx_tax_law_changes_law ON public.tax_law_changes(law_abbreviation);
CREATE INDEX idx_tax_law_changes_category ON public.tax_law_changes(provision_category);
CREATE INDEX idx_tax_law_changes_status ON public.tax_law_changes(status);
CREATE INDEX idx_tax_law_changes_expiration ON public.tax_law_changes(expiration_date);

-- Create updated_at trigger
CREATE TRIGGER update_tax_law_changes_updated_at
  BEFORE UPDATE ON public.tax_law_changes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();