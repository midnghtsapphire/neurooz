
-- Add student loan interest category to tax deduction rules
INSERT INTO public.tax_deduction_rules (category, deduction_name, max_amount, max_amount_description, can_be_increased, increase_conditions, proof_required, applicable_forms, tax_year, notes, irs_reference, display_order)
VALUES 
  ('student_loan', 'Student Loan Interest Deduction', 2500, 'Maximum $2,500 per year', false, NULL, 
   ARRAY['Form 1098-E from lender', 'Loan statements showing interest paid'], 
   ARRAY['1040', '1040-SR'], 2024, 
   'Above-the-line deduction - reduces AGI. Income phaseout: Single $75K-$90K, MFJ $155K-$185K. Must be legally obligated to pay.', 
   'Publication 970, Chapter 4', 10),
  
  ('student_loan', 'Qualified Education Loan Requirements', NULL, 'Must be for qualified higher education expenses', false, NULL,
   ARRAY['Enrollment verification', 'Tuition statements'], 
   ARRAY['1040'], 2024,
   'Loan must be taken solely to pay qualified education expenses. Includes tuition, room/board, books, supplies, equipment, other necessary expenses.',
   'IRC Section 221', 11),

  ('student_loan', 'Income Phaseout - Single/HOH', 2500, 'Phaseout begins at $75,000 MAGI', false, NULL,
   ARRAY['Form 1098-E'], 
   ARRAY['1040'], 2024,
   'Deduction phases out between $75,000 and $90,000 MAGI. No deduction if MAGI exceeds $90,000.',
   'Publication 970', 12),

  ('student_loan', 'Income Phaseout - MFJ', 2500, 'Phaseout begins at $155,000 MAGI', false, NULL,
   ARRAY['Form 1098-E'], 
   ARRAY['1040'], 2024,
   'Deduction phases out between $155,000 and $185,000 MAGI. No deduction if MAGI exceeds $185,000. Cannot file MFS.',
   'Publication 970', 13);

-- Add Form 1098-E field definitions
INSERT INTO public.irs_form_field_definitions (form_type, field_name, field_label, field_type, irs_box_number, is_required, is_payer_field, is_recipient_field, description, display_order)
VALUES
  -- Lender/Recipient Information
  ('1098-E', 'lender_name', 'Lender Name', 'text', NULL, true, true, false, 'Name of the organization that received the interest payments', 1),
  ('1098-E', 'lender_tin', 'Lender TIN', 'tin', NULL, true, true, false, 'Taxpayer Identification Number of the lender', 2),
  ('1098-E', 'lender_address', 'Lender Address', 'address', NULL, true, true, false, 'Street address, city, state, and ZIP of lender', 3),
  ('1098-E', 'lender_phone', 'Lender Telephone', 'phone', NULL, false, true, false, 'Contact phone number for lender', 4),
  
  -- Borrower Information
  ('1098-E', 'borrower_name', 'Borrower Name', 'text', NULL, true, false, true, 'Name of the person who paid the interest', 10),
  ('1098-E', 'borrower_ssn', 'Borrower SSN', 'ssn', NULL, true, false, true, 'Social Security Number of borrower', 11),
  ('1098-E', 'borrower_address', 'Borrower Address', 'address', NULL, true, false, true, 'Street address, city, state, and ZIP of borrower', 12),
  
  -- Amount Fields
  ('1098-E', 'student_loan_interest_received', 'Student Loan Interest Received', 'currency', '1', true, false, false, 'Total interest received on qualified student loans during the year', 20),
  ('1098-E', 'checkbox_box2', 'Box 2 Checkbox', 'boolean', '2', false, false, false, 'If checked, Box 1 does not include loan origination fees and/or capitalized interest for loans made before September 1, 2004', 21),
  
  -- Account Information
  ('1098-E', 'account_number', 'Account Number', 'text', NULL, false, false, false, 'Loan account number (optional)', 30);

-- Update CATEGORY_LABELS reference - add to existing hook
