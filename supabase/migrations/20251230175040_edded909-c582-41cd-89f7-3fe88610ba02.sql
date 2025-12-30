-- Create rental inventory table
CREATE TABLE public.rental_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  original_etv NUMERIC DEFAULT 0,
  purchase_price NUMERIC DEFAULT 0,
  source TEXT DEFAULT 'purchase',
  source_product_id UUID REFERENCES public.products_review_insights(id) ON DELETE SET NULL,
  daily_rate NUMERIC DEFAULT 0,
  weekly_rate NUMERIC DEFAULT 0,
  condition TEXT DEFAULT 'new',
  status TEXT DEFAULT 'available',
  location TEXT,
  photo_url TEXT,
  depreciation_method TEXT DEFAULT '5-yr MACRS',
  current_book_value NUMERIC DEFAULT 0,
  times_rented INTEGER DEFAULT 0,
  total_rental_income NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rental customers table
CREATE TABLE public.rental_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  drivers_license TEXT,
  notes TEXT,
  total_rentals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rental transactions table
CREATE TABLE public.rental_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  inventory_id UUID REFERENCES public.rental_inventory(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.rental_customers(id) ON DELETE SET NULL,
  transaction_number TEXT,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE,
  days_rented INTEGER DEFAULT 1,
  daily_rate NUMERIC DEFAULT 0,
  subtotal NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  total_charged NUMERIC DEFAULT 0,
  payment_method TEXT,
  payment_received BOOLEAN DEFAULT false,
  returned_on_time BOOLEAN,
  return_condition TEXT,
  has_damage BOOLEAN DEFAULT false,
  damage_description TEXT,
  repair_cost NUMERIC DEFAULT 0,
  deposit_refunded NUMERIC DEFAULT 0,
  net_revenue NUMERIC DEFAULT 0,
  agreement_signed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inter-company transfers table
CREATE TABLE public.inter_company_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_number TEXT,
  from_entity TEXT NOT NULL,
  to_entity TEXT NOT NULL,
  product_name TEXT NOT NULL,
  source_product_id UUID REFERENCES public.products_review_insights(id) ON DELETE SET NULL,
  original_etv NUMERIC DEFAULT 0,
  sale_price NUMERIC DEFAULT 0,
  pricing_method TEXT,
  comparable_evidence TEXT,
  payment_due_date DATE,
  payment_received_date DATE,
  payment_method TEXT,
  check_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rental_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inter_company_transfers ENABLE ROW LEVEL SECURITY;

-- RLS policies for rental_inventory
CREATE POLICY "Users can view their own rental inventory" 
ON public.rental_inventory FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rental inventory" 
ON public.rental_inventory FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rental inventory" 
ON public.rental_inventory FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rental inventory" 
ON public.rental_inventory FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for rental_customers
CREATE POLICY "Users can view their own rental customers" 
ON public.rental_customers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rental customers" 
ON public.rental_customers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rental customers" 
ON public.rental_customers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rental customers" 
ON public.rental_customers FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for rental_transactions
CREATE POLICY "Users can view their own rental transactions" 
ON public.rental_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rental transactions" 
ON public.rental_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rental transactions" 
ON public.rental_transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rental transactions" 
ON public.rental_transactions FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for inter_company_transfers
CREATE POLICY "Users can view their own inter-company transfers" 
ON public.inter_company_transfers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inter-company transfers" 
ON public.inter_company_transfers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inter-company transfers" 
ON public.inter_company_transfers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inter-company transfers" 
ON public.inter_company_transfers FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_rental_inventory_updated_at
BEFORE UPDATE ON public.rental_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_customers_updated_at
BEFORE UPDATE ON public.rental_customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_transactions_updated_at
BEFORE UPDATE ON public.rental_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inter_company_transfers_updated_at
BEFORE UPDATE ON public.inter_company_transfers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();