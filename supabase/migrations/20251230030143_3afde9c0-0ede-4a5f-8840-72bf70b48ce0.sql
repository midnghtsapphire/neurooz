-- Create subscription_events table to track Stripe webhook events
CREATE TABLE public.subscription_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  customer_email TEXT,
  customer_id TEXT,
  subscription_id TEXT,
  product_id TEXT,
  price_id TEXT,
  status TEXT,
  amount INTEGER,
  currency TEXT,
  event_data JSONB,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view subscription events
CREATE POLICY "Admins can view subscription events" 
ON public.subscription_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_subscription_events_email ON public.subscription_events(customer_email);
CREATE INDEX idx_subscription_events_type ON public.subscription_events(event_type);
CREATE INDEX idx_subscription_events_created ON public.subscription_events(created_at DESC);