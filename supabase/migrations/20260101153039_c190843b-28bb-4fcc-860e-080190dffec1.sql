-- Add SSDI tracking table for passive income protection
CREATE TABLE public.ssdi_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  
  -- Income tracking
  passive_income NUMERIC NOT NULL DEFAULT 0,
  earned_income NUMERIC NOT NULL DEFAULT 0,
  vine_etv NUMERIC NOT NULL DEFAULT 0,
  rental_income NUMERIC NOT NULL DEFAULT 0,
  k1_distributions NUMERIC NOT NULL DEFAULT 0,
  
  -- SGA monitoring
  hours_worked NUMERIC DEFAULT 0,
  material_participation_test TEXT DEFAULT 'none',
  is_substantial_services BOOLEAN DEFAULT false,
  
  -- TWP/EPE tracking
  is_twp_month BOOLEAN DEFAULT false,
  twp_months_used INTEGER DEFAULT 0,
  is_epe_month BOOLEAN DEFAULT false,
  
  -- SSDI benefit info
  ssdi_benefit_amount NUMERIC DEFAULT 0,
  sga_limit NUMERIC DEFAULT 1550,
  
  -- Alerts
  sga_risk_level TEXT DEFAULT 'low' CHECK (sga_risk_level IN ('low', 'medium', 'high')),
  alert_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, month, year)
);

-- Enable RLS
ALTER TABLE public.ssdi_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own SSDI tracking" 
ON public.ssdi_tracking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SSDI tracking" 
ON public.ssdi_tracking FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SSDI tracking" 
ON public.ssdi_tracking FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SSDI tracking" 
ON public.ssdi_tracking FOR DELETE 
USING (auth.uid() = user_id);

-- Add inventory transfer tracking table for 6-month hold
CREATE TABLE public.vine_inventory_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_product_id UUID REFERENCES public.products_review_insights(id) ON DELETE SET NULL,
  
  -- Product info
  product_name TEXT NOT NULL,
  original_etv NUMERIC NOT NULL DEFAULT 0,
  
  -- Vine order info
  vine_order_date DATE NOT NULL,
  six_month_eligible_date DATE GENERATED ALWAYS AS (vine_order_date + INTERVAL '6 months') STORED,
  
  -- Transfer info
  from_entity TEXT NOT NULL DEFAULT 'Personal',
  to_entity TEXT NOT NULL,
  transfer_date DATE,
  transfer_type TEXT DEFAULT 'capital_contribution' CHECK (transfer_type IN ('capital_contribution', 'sale', 'donation')),
  
  -- Basis tracking
  capital_contribution_basis NUMERIC DEFAULT 0,
  fmv_at_transfer NUMERIC DEFAULT 0,
  
  -- Depreciation tracking  
  depreciation_method TEXT DEFAULT 'MACRS',
  useful_life_years INTEGER DEFAULT 5,
  placed_in_service_date DATE,
  is_section_179_eligible BOOLEAN DEFAULT true,
  section_179_amount NUMERIC DEFAULT 0,
  bonus_depreciation_amount NUMERIC DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'eligible', 'transferred', 'donated', 'sold')),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vine_inventory_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transfers" 
ON public.vine_inventory_transfers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transfers" 
ON public.vine_inventory_transfers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transfers" 
ON public.vine_inventory_transfers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transfers" 
ON public.vine_inventory_transfers FOR DELETE 
USING (auth.uid() = user_id);

-- Add operating agreement templates table
CREATE TABLE public.operating_agreement_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL CHECK (template_type IN ('manager_managed_llc', 'member_managed_llc', 'passive_member_provisions', 'ssdi_protection_addendum')),
  template_name TEXT NOT NULL,
  description TEXT,
  template_content TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]',
  state TEXT DEFAULT 'CO',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, admin write)
ALTER TABLE public.operating_agreement_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view operating agreement templates" 
ON public.operating_agreement_templates FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage templates" 
ON public.operating_agreement_templates FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Add user's generated operating agreements
CREATE TABLE public.user_operating_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.operating_agreement_templates(id),
  
  -- Agreement details
  agreement_name TEXT NOT NULL,
  generated_content TEXT,
  custom_provisions JSONB DEFAULT '{}',
  
  -- Member info
  managing_member_name TEXT,
  managing_member_ownership NUMERIC DEFAULT 51,
  passive_member_name TEXT,
  passive_member_ownership NUMERIC DEFAULT 49,
  
  -- SSDI protection clauses
  includes_ssdi_protection BOOLEAN DEFAULT false,
  passive_role_explicitly_defined BOOLEAN DEFAULT false,
  no_material_participation_clause BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'signed', 'archived')),
  generated_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_operating_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agreements" 
ON public.user_operating_agreements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agreements" 
ON public.user_operating_agreements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agreements" 
ON public.user_operating_agreements FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agreements" 
ON public.user_operating_agreements FOR DELETE 
USING (auth.uid() = user_id);

-- Insert default operating agreement templates
INSERT INTO public.operating_agreement_templates (template_type, template_name, description, template_content, placeholders, state) VALUES
(
  'manager_managed_llc',
  'Manager-Managed Multi-Member LLC',
  'Standard operating agreement for a manager-managed LLC with passive member provisions. Ideal for Vine → Rental business with SSDI protection.',
  E'# OPERATING AGREEMENT OF {{BUSINESS_NAME}} LLC\n\n## A Colorado Limited Liability Company\n\nThis Operating Agreement ("Agreement") is entered into as of {{EFFECTIVE_DATE}}, by and between:\n\n**MANAGING MEMBER:**\n- Name: {{MANAGING_MEMBER_NAME}}\n- Ownership: {{MANAGING_MEMBER_OWNERSHIP}}%\n- Role: Manager\n\n**PASSIVE MEMBER:**\n- Name: {{PASSIVE_MEMBER_NAME}}\n- Ownership: {{PASSIVE_MEMBER_OWNERSHIP}}%\n- Role: Non-Managing Member (Passive Investor)\n\n## ARTICLE I - FORMATION\n\n1.1 The Members hereby form a Limited Liability Company under the Colorado Limited Liability Company Act.\n\n1.2 The Company shall be MANAGER-MANAGED. The Managing Member shall have exclusive authority over all day-to-day operations.\n\n## ARTICLE II - PASSIVE MEMBER PROVISIONS\n\n2.1 **Limited Role:** The Passive Member shall NOT participate in:\n- Daily operations or management decisions\n- Ordering, selecting, or managing inventory\n- Writing reviews or product testing\n- Customer relations or marketing\n- Financial transactions or banking\n- Hiring, firing, or managing employees/contractors\n\n2.2 **Passive Member Rights:**\n- Receive distributions according to ownership percentage\n- Review annual financial statements\n- Vote only on fundamental changes (dissolution, merger, sale of substantially all assets)\n- Maintain capital account\n\n2.3 **SSDI Protection Clause:** This Agreement explicitly documents that the Passive Member provides NO substantial services to the Company and does NOT materially participate in operations. All income received by Passive Member constitutes passive investment income, not earned income.\n\n## ARTICLE III - CAPITAL CONTRIBUTIONS\n\n3.1 Initial Capital:\n- Managing Member: {{MANAGING_MEMBER_CAPITAL}}\n- Passive Member: {{PASSIVE_MEMBER_CAPITAL}}\n\n3.2 Additional capital contributions may be made by non-taxable transfer of Vine products after the 6-month Amazon hold period, valued at Estimated Tax Value (ETV) at time of transfer.\n\n## ARTICLE IV - ALLOCATIONS AND DISTRIBUTIONS\n\n4.1 Profits and losses allocated per ownership percentages.\n4.2 Distributions at Manager discretion, pro-rata to ownership.\n4.3 NO guaranteed payments to Passive Member.\n\n## ARTICLE V - TAX ELECTIONS\n\n5.1 The Company elects to be treated as a PARTNERSHIP for federal tax purposes (Form 1065).\n5.2 The Company shall NOT elect S-Corporation status to avoid reasonable compensation requirements that could impact Passive Member''s SSDI benefits.\n\nIN WITNESS WHEREOF, the Members execute this Agreement:\n\n_______________________\n{{MANAGING_MEMBER_NAME}}, Managing Member\nDate: _______________\n\n_______________________\n{{PASSIVE_MEMBER_NAME}}, Passive Member\nDate: _______________',
  '["BUSINESS_NAME", "EFFECTIVE_DATE", "MANAGING_MEMBER_NAME", "MANAGING_MEMBER_OWNERSHIP", "PASSIVE_MEMBER_NAME", "PASSIVE_MEMBER_OWNERSHIP", "MANAGING_MEMBER_CAPITAL", "PASSIVE_MEMBER_CAPITAL"]',
  'CO'
),
(
  'ssdi_protection_addendum',
  'SSDI Protection Addendum',
  'Additional clauses to strengthen SSDI protection documentation for passive members.',
  E'# SSDI PROTECTION ADDENDUM\n\nThis Addendum supplements the Operating Agreement of {{BUSINESS_NAME}} LLC.\n\n## PURPOSE\n\nThis Addendum documents the limited, passive role of {{PASSIVE_MEMBER_NAME}} to preserve eligibility for Social Security Disability Insurance (SSDI) benefits.\n\n## DECLARATIONS\n\n1. {{PASSIVE_MEMBER_NAME}} is a PASSIVE INVESTOR only.\n\n2. {{PASSIVE_MEMBER_NAME}} does NOT perform any of the following:\n   - Work for the Company in any capacity\n   - Make management decisions\n   - Participate in daily operations\n   - Order products or manage inventory\n   - Write reviews or test products\n   - Handle customer service\n   - Conduct marketing or sales\n   - Access business bank accounts for transactions\n   - Hire, supervise, or terminate employees/contractors\n\n3. {{PASSIVE_MEMBER_NAME}}''s involvement is LIMITED to:\n   - Being the named Amazon Vine Voice (personal, non-transferable account)\n   - Receiving K-1 distributions as passive investment income\n   - Voting only on fundamental company changes\n\n4. ALL operational work is performed by {{MANAGING_MEMBER_NAME}} as the sole Manager.\n\n5. Income received by {{PASSIVE_MEMBER_NAME}} constitutes:\n   - Passive investment income\n   - NOT earned income\n   - NOT subject to self-employment tax\n   - NOT wages or salary\n\n## MATERIAL PARTICIPATION TESTS\n\nThe Passive Member does NOT meet any of the IRS material participation tests:\n- ❌ Does NOT participate 500+ hours/year\n- ❌ Does NOT constitute substantially all participation\n- ❌ Does NOT participate 100+ hours or more than others\n- ❌ Has NOT materially participated in prior years\n- ❌ Is NOT a personal service activity\n\n## SGA PROTECTION\n\nThe Passive Member''s involvement does NOT constitute Substantial Gainful Activity (SGA) because:\n- No services are rendered\n- No management duties performed\n- Income is passive investment return, not compensation for services\n\nSigned: _______________\nDate: _______________',
  '["BUSINESS_NAME", "PASSIVE_MEMBER_NAME", "MANAGING_MEMBER_NAME"]',
  'CO'
);