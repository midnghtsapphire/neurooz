-- Create subscriptions tracking table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_name TEXT NOT NULL,
  subscription_type TEXT NOT NULL DEFAULT 'software', -- software, mobile_app, streaming, professional, cloud_storage, saas, other
  provider TEXT,
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly, quarterly, one_time, lifetime
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  start_date DATE DEFAULT CURRENT_DATE,
  renewal_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  is_business_expense BOOLEAN DEFAULT true,
  business_use_percentage NUMERIC DEFAULT 100,
  category TEXT, -- productivity, communication, design, development, marketing, accounting, storage, education, entertainment
  license_key TEXT,
  seats_purchased INTEGER DEFAULT 1,
  assigned_to TEXT[],
  notes TEXT,
  receipt_urls TEXT[],
  status TEXT DEFAULT 'active', -- active, cancelled, expired, trial
  cancellation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital inventory table for software licenses, apps, tools
CREATE TABLE public.digital_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'software', -- software, mobile_app, cloud_subscription, digital_tool, online_course, ebook, template, plugin, domain, hosting
  vendor TEXT,
  purchase_date DATE DEFAULT CURRENT_DATE,
  purchase_price NUMERIC DEFAULT 0,
  license_type TEXT DEFAULT 'perpetual', -- perpetual, subscription, freemium, open_source, trial
  license_key TEXT,
  license_expiry DATE,
  seats_count INTEGER DEFAULT 1,
  version TEXT,
  platform TEXT, -- windows, mac, linux, ios, android, web, cross_platform
  installed_on TEXT[],
  is_business_asset BOOLEAN DEFAULT true,
  business_use_percentage NUMERIC DEFAULT 100,
  depreciation_method TEXT DEFAULT 'straight_line',
  useful_life_years INTEGER DEFAULT 3,
  current_value NUMERIC DEFAULT 0,
  category TEXT, -- productivity, development, design, marketing, accounting, education, communication, security, utilities
  proof_of_purchase TEXT[], -- receipt URLs
  notes TEXT,
  status TEXT DEFAULT 'active', -- active, expired, deprecated, unused
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_inventory ENABLE ROW LEVEL SECURITY;

-- Subscriptions RLS policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Digital inventory RLS policies
CREATE POLICY "Users can view their own digital inventory"
  ON public.digital_inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own digital inventory"
  ON public.digital_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own digital inventory"
  ON public.digital_inventory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own digital inventory"
  ON public.digital_inventory FOR DELETE
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_digital_inventory_updated_at
  BEFORE UPDATE ON public.digital_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
