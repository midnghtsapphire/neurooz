-- Create employment rules reference table
CREATE TABLE public.employment_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  rule_key text NOT NULL,
  rule_title text NOT NULL,
  rule_description text,
  age_group text,
  requirements text[],
  tax_implications text,
  documentation_needed text[],
  source_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category, rule_key)
);

-- Enable RLS
ALTER TABLE public.employment_rules ENABLE ROW LEVEL SECURITY;

-- Anyone can view (reference data)
CREATE POLICY "Anyone can view employment rules"
  ON public.employment_rules FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage employment rules"
  ON public.employment_rules FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Insert minor employment rules
INSERT INTO public.employment_rules (category, rule_key, rule_title, rule_description, age_group, requirements, tax_implications, documentation_needed) VALUES
('minor_employment', 'ages_14_15', 'Ages 14-15 Employment', 'Limited hours and restricted tasks. Max 18hrs/week during school, 40hrs summer.', '14-15', 
  ARRAY['Parental consent required', 'Work permit from school', 'Restricted to non-hazardous work', 'Cannot work during school hours', 'Max 3 hrs on school days', 'Max 8 hrs on non-school days'],
  'Normal FICA applies unless YOUR child working for YOUR sole proprietorship',
  ARRAY['Work permit', 'Parental consent form', 'Age verification', 'School authorization']),

('minor_employment', 'ages_16_17', 'Ages 16-17 Employment', 'More flexibility in hours but still need work permits in most states.', '16-17',
  ARRAY['Parental consent recommended', 'Work permit required in most states', 'Cannot work in hazardous occupations', 'No federal hour restrictions'],
  'Normal FICA applies unless YOUR child working for YOUR sole proprietorship',
  ARRAY['Work permit', 'Parental consent form', 'Age verification']),

('minor_employment', 'own_child_exemption', 'Own Child FICA Exemption', 'Your own children under 18 working for your sole proprietorship = NO FICA taxes!', 'Under 18',
  ARRAY['Must be YOUR biological or adopted child', 'Business must be sole proprietorship or spouse-only partnership', 'Child must be under 18', 'NOT applicable to LLCs taxed as corporations', 'NOT applicable to S-Corps or C-Corps'],
  'No employer FICA (7.65%), No employee FICA (7.65%) = 15.3% savings on wages',
  ARRAY['Birth certificate or adoption papers', 'Timesheets', 'Job description', 'Reasonable wage documentation']),

('minor_employment', 'standard_deduction', 'Minor Income Tax-Free', 'Pay minor up to standard deduction amount = $0 income tax for them', 'Any minor',
  ARRAY['2025 standard deduction: $14,600', 'Child must perform legitimate work', 'Wages must be reasonable for work performed', 'Keep detailed timesheets'],
  'Child pays $0 federal income tax if wages under standard deduction. You deduct full wages as business expense.',
  ARRAY['Timesheets', 'Job description', 'Work samples', 'Payment records']),

('minor_employment', 'kiddie_tax', 'Kiddie Tax Rules', 'Unearned income over threshold taxed at parent rate. Does NOT apply to wages.', 'Under 19 (or under 24 if student)',
  ARRAY['Only applies to unearned income (investments, trusts)', 'Does NOT apply to wages from employment', 'Threshold: $2,500 unearned income (2025)', 'Above threshold taxed at parent marginal rate'],
  'Wages are earned income - exempt from kiddie tax. Investment income may be taxed at parent rate.',
  ARRAY['1099 forms for unearned income', 'Form 8615 if kiddie tax applies']),

('business_structure', 'multi_entity_limits', 'Multiple Business Ownership', 'IRS allows multiple businesses if each has legitimate business purpose and economic substance.', NULL,
  ARRAY['Each entity must have separate business purpose', 'Cannot be created solely for tax avoidance', 'Must maintain separate books and records', 'Arms-length transactions between entities', 'Reasonable compensation standards'],
  'Related-party rules apply. Inter-company transactions must be at fair market value. Potential passive activity loss limitations.',
  ARRAY['Separate bank accounts', 'Operating agreements', 'Inter-company contracts', 'Meeting minutes']),

('nonprofit', 'related_party_rules', 'Nonprofit Related Party Rules', 'Founders/family can work for nonprofit but must follow strict rules.', NULL,
  ARRAY['Cannot receive excess benefit (must be reasonable compensation)', 'Board must have independent members (typically majority)', 'Related party transactions require disclosure', 'Self-dealing rules apply', 'Form 990 discloses related party transactions'],
  'Excess benefit transactions = 25% excise tax. Second offense = 200% tax. Board members personally liable.',
  ARRAY['Board meeting minutes approving compensation', 'Comparability data for compensation', 'Conflict of interest policy', 'Form 990 Schedule L']);

-- Add trigger for updated_at
CREATE TRIGGER update_employment_rules_updated_at
  BEFORE UPDATE ON public.employment_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();