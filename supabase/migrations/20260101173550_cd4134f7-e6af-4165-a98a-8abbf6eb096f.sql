-- Add multi_member_llc to the business_structure enum
ALTER TYPE business_structure ADD VALUE IF NOT EXISTS 'multi_member_llc' AFTER 'single_member_llc';