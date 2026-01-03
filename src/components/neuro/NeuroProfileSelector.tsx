import { CognitiveModeSelector } from "./CognitiveModeSelector";

// Re-export the full selector as the default dropdown
export function NeuroProfileSelector() {
  return <CognitiveModeSelector showTrigger={true} />;
}
