/**
 * Quick Capture Module Types
 */

export interface QuickNote {
  id: string;
  content: string;
  is_processed: boolean;
  created_at: string;
}

export interface QuickCaptureConfig {
  storageKey?: string;
  voiceToTextEndpoint?: string;
  organizeEndpoint?: string;
  placeholder?: string;
  buttonImage?: string;
  accentColor?: string;
}
