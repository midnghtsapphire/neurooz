-- Create IRS Form Field Definitions lookup table (per Pub 5717 specs)
CREATE TABLE public.irs_form_field_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type text NOT NULL, -- '1099-NEC', '1099-MISC', '1099-K', '1099-INT', '1099-DIV'
  field_name text NOT NULL,
  field_label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text', -- 'text', 'numeric', 'date', 'boolean', 'enum'
  max_length integer,
  is_required boolean NOT NULL DEFAULT false,
  irs_box_number text, -- e.g., 'Box 1', 'Box 4'
  validation_regex text,
  allowed_values text[], -- for enum types
  description text,
  display_order integer NOT NULL DEFAULT 0,
  is_payer_field boolean NOT NULL DEFAULT false,
  is_recipient_field boolean NOT NULL DEFAULT false,
  is_state_field boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(form_type, field_name)
);

-- Enable RLS
ALTER TABLE public.irs_form_field_definitions ENABLE ROW LEVEL SECURITY;

-- Anyone can view (reference data)
CREATE POLICY "Anyone can view IRS field definitions"
ON public.irs_form_field_definitions
FOR SELECT
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage IRS field definitions"
ON public.irs_form_field_definitions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert 1099-NEC field definitions from Pub 5717
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, max_length, is_required, irs_box_number, is_payer_field, is_recipient_field, description, display_order) VALUES
-- Payer fields
('1099-NEC', 'payer_tin_type', 'Payer TIN Type', 'enum', 1, true, NULL, true, false, 'E=EIN, S=SSN/ITIN', 1),
('1099-NEC', 'payer_tin', 'Payer TIN', 'text', 9, true, NULL, true, false, '9-digit TIN without dashes', 2),
('1099-NEC', 'payer_name_type', 'Payer Name Type', 'enum', 1, true, NULL, true, false, 'B=Business, I=Individual', 3),
('1099-NEC', 'payer_first_name', 'Payer First Name', 'text', 40, false, NULL, true, false, 'Required if individual', 4),
('1099-NEC', 'payer_middle_name', 'Payer Middle Name', 'text', 40, false, NULL, true, false, 'Optional', 5),
('1099-NEC', 'payer_last_name', 'Payer Last Name', 'text', 40, false, NULL, true, false, 'Required if individual', 6),
('1099-NEC', 'payer_suffix', 'Payer Suffix', 'text', 10, false, NULL, true, false, 'Jr, Sr, III, etc.', 7),
('1099-NEC', 'payer_business_name', 'Payer Business Name', 'text', 75, false, NULL, true, false, 'Required if business', 8),
('1099-NEC', 'payer_address_line1', 'Payer Address Line 1', 'text', 40, true, NULL, true, false, 'Street address', 9),
('1099-NEC', 'payer_address_line2', 'Payer Address Line 2', 'text', 40, false, NULL, true, false, 'Suite, apt, etc.', 10),
('1099-NEC', 'payer_city', 'Payer City', 'text', 25, true, NULL, true, false, 'City name', 11),
('1099-NEC', 'payer_state', 'Payer State', 'text', 2, true, NULL, true, false, '2-letter state code', 12),
('1099-NEC', 'payer_zip', 'Payer ZIP', 'text', 9, true, NULL, true, false, '5 or 9 digit ZIP', 13),
('1099-NEC', 'payer_phone', 'Payer Phone', 'text', 10, false, NULL, true, false, '10-digit phone number', 14),
-- Recipient fields
('1099-NEC', 'recipient_tin_type', 'Recipient TIN Type', 'enum', 1, true, NULL, false, true, 'E=EIN, S=SSN/ITIN', 20),
('1099-NEC', 'recipient_tin', 'Recipient TIN', 'text', 9, true, NULL, false, true, '9-digit TIN without dashes', 21),
('1099-NEC', 'recipient_name_type', 'Recipient Name Type', 'enum', 1, true, NULL, false, true, 'B=Business, I=Individual', 22),
('1099-NEC', 'recipient_first_name', 'Recipient First Name', 'text', 40, false, NULL, false, true, 'Required if individual', 23),
('1099-NEC', 'recipient_middle_name', 'Recipient Middle Name', 'text', 40, false, NULL, false, true, 'Optional', 24),
('1099-NEC', 'recipient_last_name', 'Recipient Last Name', 'text', 40, false, NULL, false, true, 'Required if individual', 25),
('1099-NEC', 'recipient_suffix', 'Recipient Suffix', 'text', 10, false, NULL, false, true, 'Jr, Sr, III, etc.', 26),
('1099-NEC', 'recipient_business_name', 'Recipient Business Name', 'text', 75, false, NULL, false, true, 'Required if business', 27),
('1099-NEC', 'recipient_address_line1', 'Recipient Address Line 1', 'text', 40, true, NULL, false, true, 'Street address', 28),
('1099-NEC', 'recipient_address_line2', 'Recipient Address Line 2', 'text', 40, false, NULL, false, true, 'Suite, apt, etc.', 29),
('1099-NEC', 'recipient_city', 'Recipient City', 'text', 25, true, NULL, false, true, 'City name', 30),
('1099-NEC', 'recipient_state', 'Recipient State', 'text', 2, true, NULL, false, true, '2-letter state code', 31),
('1099-NEC', 'recipient_zip', 'Recipient ZIP', 'text', 9, true, NULL, false, true, '5 or 9 digit ZIP', 32),
('1099-NEC', 'recipient_account_number', 'Account Number', 'text', 20, false, NULL, false, true, 'Optional account reference', 33),
-- Amount fields (boxes)
('1099-NEC', 'nonemployee_compensation', 'Nonemployee Compensation', 'numeric', NULL, true, 'Box 1', false, false, 'Total nonemployee compensation paid', 40),
('1099-NEC', 'payer_direct_sales', 'Direct Sales Indicator', 'boolean', NULL, false, 'Box 2', false, false, '$5,000+ in direct sales', 41),
('1099-NEC', 'federal_income_tax_withheld', 'Federal Income Tax Withheld', 'numeric', NULL, false, 'Box 4', false, false, 'Federal tax withheld', 42),
-- State fields
('1099-NEC', 'state_income_tax_withheld_1', 'State Tax Withheld (1)', 'numeric', NULL, false, 'Box 5', false, false, 'First state tax withheld', 50),
('1099-NEC', 'state_payer_state_no_1', 'State/Payer State No. (1)', 'text', 20, false, 'Box 6', true, false, 'State ID number', 51),
('1099-NEC', 'state_income_1', 'State Income (1)', 'numeric', NULL, false, 'Box 7', false, false, 'First state income', 52),
('1099-NEC', 'state_income_tax_withheld_2', 'State Tax Withheld (2)', 'numeric', NULL, false, 'Box 5', false, false, 'Second state tax withheld', 53),
('1099-NEC', 'state_payer_state_no_2', 'State/Payer State No. (2)', 'text', 20, false, 'Box 6', true, false, 'Second state ID', 54),
('1099-NEC', 'state_income_2', 'State Income (2)', 'numeric', NULL, false, 'Box 7', false, false, 'Second state income', 55),
-- CF/SF flags
('1099-NEC', 'combined_federal_state_filer', 'CF/SF Indicator', 'boolean', NULL, false, NULL, false, false, 'Combined Federal/State Filing participant', 60);

-- Insert 1099-MISC field definitions
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, max_length, is_required, irs_box_number, description, display_order) VALUES
('1099-MISC', 'rents', 'Rents', 'numeric', NULL, false, 'Box 1', 'Rents paid', 1),
('1099-MISC', 'royalties', 'Royalties', 'numeric', NULL, false, 'Box 2', 'Royalties paid', 2),
('1099-MISC', 'other_income', 'Other Income', 'numeric', NULL, false, 'Box 3', 'Other income', 3),
('1099-MISC', 'federal_income_tax_withheld', 'Federal Income Tax Withheld', 'numeric', NULL, false, 'Box 4', 'Federal tax withheld', 4),
('1099-MISC', 'fishing_boat_proceeds', 'Fishing Boat Proceeds', 'numeric', NULL, false, 'Box 5', 'Fishing boat proceeds', 5),
('1099-MISC', 'medical_payments', 'Medical and Health Care Payments', 'numeric', NULL, false, 'Box 6', 'Medical payments', 6),
('1099-MISC', 'direct_sales', 'Direct Sales Indicator', 'boolean', NULL, false, 'Box 7', '$5,000+ in direct sales', 7),
('1099-MISC', 'substitute_payments', 'Substitute Payments', 'numeric', NULL, false, 'Box 8', 'Substitute payments in lieu of dividends', 8),
('1099-MISC', 'crop_insurance_proceeds', 'Crop Insurance Proceeds', 'numeric', NULL, false, 'Box 9', 'Crop insurance proceeds', 9),
('1099-MISC', 'gross_proceeds_attorney', 'Gross Proceeds to Attorney', 'numeric', NULL, false, 'Box 10', 'Gross proceeds paid to attorney', 10),
('1099-MISC', 'fish_purchased_for_resale', 'Fish Purchased for Resale', 'numeric', NULL, false, 'Box 11', 'Fish purchased for resale', 11),
('1099-MISC', 'section_409a_deferrals', 'Section 409A Deferrals', 'numeric', NULL, false, 'Box 12', '409A deferrals', 12),
('1099-MISC', 'excess_golden_parachute', 'Excess Golden Parachute', 'numeric', NULL, false, 'Box 13', 'Excess golden parachute payments', 13),
('1099-MISC', 'nonqualified_deferred_comp', 'Nonqualified Deferred Compensation', 'numeric', NULL, false, 'Box 14', 'NQDC income', 14),
('1099-MISC', 'fatca_filing_requirement', 'FATCA Filing Requirement', 'boolean', NULL, false, 'Box 15', 'FATCA filing required', 15);

-- Insert 1099-K field definitions  
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, max_length, is_required, irs_box_number, description, display_order) VALUES
('1099-K', 'gross_amount', 'Gross Amount of Payment Card/Third Party Transactions', 'numeric', NULL, true, 'Box 1a', 'Total gross amount', 1),
('1099-K', 'card_not_present_transactions', 'Card Not Present Transactions', 'numeric', NULL, false, 'Box 1b', 'Card not present amount', 2),
('1099-K', 'merchant_category_code', 'Merchant Category Code', 'text', 4, false, 'Box 2', 'MCC code', 3),
('1099-K', 'number_of_payment_transactions', 'Number of Payment Transactions', 'numeric', NULL, false, 'Box 3', 'Transaction count', 4),
('1099-K', 'federal_income_tax_withheld', 'Federal Income Tax Withheld', 'numeric', NULL, false, 'Box 4', 'Federal tax withheld', 5),
('1099-K', 'january_amount', 'January', 'numeric', NULL, false, 'Box 5a', 'January amount', 6),
('1099-K', 'february_amount', 'February', 'numeric', NULL, false, 'Box 5b', 'February amount', 7),
('1099-K', 'march_amount', 'March', 'numeric', NULL, false, 'Box 5c', 'March amount', 8),
('1099-K', 'april_amount', 'April', 'numeric', NULL, false, 'Box 5d', 'April amount', 9),
('1099-K', 'may_amount', 'May', 'numeric', NULL, false, 'Box 5e', 'May amount', 10),
('1099-K', 'june_amount', 'June', 'numeric', NULL, false, 'Box 5f', 'June amount', 11),
('1099-K', 'july_amount', 'July', 'numeric', NULL, false, 'Box 5g', 'July amount', 12),
('1099-K', 'august_amount', 'August', 'numeric', NULL, false, 'Box 5h', 'August amount', 13),
('1099-K', 'september_amount', 'September', 'numeric', NULL, false, 'Box 5i', 'September amount', 14),
('1099-K', 'october_amount', 'October', 'numeric', NULL, false, 'Box 5j', 'October amount', 15),
('1099-K', 'november_amount', 'November', 'numeric', NULL, false, 'Box 5k', 'November amount', 16),
('1099-K', 'december_amount', 'December', 'numeric', NULL, false, 'Box 5l', 'December amount', 17),
('1099-K', 'pse_name', 'PSE Name', 'text', 75, false, NULL, 'Payment Settlement Entity name', 18),
('1099-K', 'pse_phone', 'PSE Phone', 'text', 10, false, NULL, 'PSE phone number', 19);

-- Insert 1099-INT field definitions
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, max_length, is_required, irs_box_number, description, display_order) VALUES
('1099-INT', 'interest_income', 'Interest Income', 'numeric', NULL, true, 'Box 1', 'Total interest income', 1),
('1099-INT', 'early_withdrawal_penalty', 'Early Withdrawal Penalty', 'numeric', NULL, false, 'Box 2', 'Penalty for early withdrawal', 2),
('1099-INT', 'interest_on_savings_bonds', 'Interest on U.S. Savings Bonds', 'numeric', NULL, false, 'Box 3', 'US Savings Bond interest', 3),
('1099-INT', 'federal_income_tax_withheld', 'Federal Income Tax Withheld', 'numeric', NULL, false, 'Box 4', 'Federal tax withheld', 4),
('1099-INT', 'investment_expenses', 'Investment Expenses', 'numeric', NULL, false, 'Box 5', 'Investment expenses', 5),
('1099-INT', 'foreign_tax_paid', 'Foreign Tax Paid', 'numeric', NULL, false, 'Box 6', 'Foreign tax paid', 6),
('1099-INT', 'foreign_country', 'Foreign Country', 'text', 40, false, 'Box 7', 'Foreign country name', 7),
('1099-INT', 'tax_exempt_interest', 'Tax-Exempt Interest', 'numeric', NULL, false, 'Box 8', 'Tax-exempt interest', 8),
('1099-INT', 'private_activity_bond_interest', 'Private Activity Bond Interest', 'numeric', NULL, false, 'Box 9', 'Private activity bond interest', 9),
('1099-INT', 'market_discount', 'Market Discount', 'numeric', NULL, false, 'Box 10', 'Market discount', 10),
('1099-INT', 'bond_premium', 'Bond Premium', 'numeric', NULL, false, 'Box 11', 'Bond premium', 11),
('1099-INT', 'bond_premium_treasury', 'Bond Premium on Treasury Obligations', 'numeric', NULL, false, 'Box 12', 'Treasury bond premium', 12),
('1099-INT', 'bond_premium_tax_exempt', 'Bond Premium on Tax-Exempt Bond', 'numeric', NULL, false, 'Box 13', 'Tax-exempt bond premium', 13);

-- Insert 1099-DIV field definitions
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, max_length, is_required, irs_box_number, description, display_order) VALUES
('1099-DIV', 'ordinary_dividends', 'Total Ordinary Dividends', 'numeric', NULL, true, 'Box 1a', 'Total ordinary dividends', 1),
('1099-DIV', 'qualified_dividends', 'Qualified Dividends', 'numeric', NULL, false, 'Box 1b', 'Qualified dividends', 2),
('1099-DIV', 'capital_gain_distributions', 'Total Capital Gain Distributions', 'numeric', NULL, false, 'Box 2a', 'Capital gain distributions', 3),
('1099-DIV', 'unrecaptured_section_1250_gain', 'Unrecaptured Section 1250 Gain', 'numeric', NULL, false, 'Box 2b', 'Section 1250 gain', 4),
('1099-DIV', 'section_1202_gain', 'Section 1202 Gain', 'numeric', NULL, false, 'Box 2c', 'Section 1202 gain', 5),
('1099-DIV', 'collectibles_gain', 'Collectibles (28%) Gain', 'numeric', NULL, false, 'Box 2d', 'Collectibles gain', 6),
('1099-DIV', 'section_897_ordinary_dividends', 'Section 897 Ordinary Dividends', 'numeric', NULL, false, 'Box 2e', 'Section 897 dividends', 7),
('1099-DIV', 'section_897_capital_gain', 'Section 897 Capital Gain', 'numeric', NULL, false, 'Box 2f', 'Section 897 capital gain', 8),
('1099-DIV', 'nondividend_distributions', 'Nondividend Distributions', 'numeric', NULL, false, 'Box 3', 'Return of capital', 9),
('1099-DIV', 'federal_income_tax_withheld', 'Federal Income Tax Withheld', 'numeric', NULL, false, 'Box 4', 'Federal tax withheld', 10),
('1099-DIV', 'section_199a_dividends', 'Section 199A Dividends', 'numeric', NULL, false, 'Box 5', 'REIT dividends for QBI', 11),
('1099-DIV', 'investment_expenses', 'Investment Expenses', 'numeric', NULL, false, 'Box 6', 'Investment expenses', 12),
('1099-DIV', 'foreign_tax_paid', 'Foreign Tax Paid', 'numeric', NULL, false, 'Box 7', 'Foreign tax paid', 13),
('1099-DIV', 'foreign_country', 'Foreign Country', 'text', 40, false, 'Box 8', 'Foreign country name', 14),
('1099-DIV', 'cash_liquidation_distributions', 'Cash Liquidation Distributions', 'numeric', NULL, false, 'Box 9', 'Cash liquidation', 15),
('1099-DIV', 'noncash_liquidation_distributions', 'Noncash Liquidation Distributions', 'numeric', NULL, false, 'Box 10', 'Noncash liquidation', 16),
('1099-DIV', 'fatca_filing_requirement', 'FATCA Filing Requirement', 'boolean', NULL, false, 'Box 11', 'FATCA filing required', 17),
('1099-DIV', 'exempt_interest_dividends', 'Exempt-Interest Dividends', 'numeric', NULL, false, 'Box 12', 'Tax-exempt dividends', 18),
('1099-DIV', 'private_activity_bond_dividends', 'Specified Private Activity Bond Interest Dividends', 'numeric', NULL, false, 'Box 13', 'AMT preference item', 19);