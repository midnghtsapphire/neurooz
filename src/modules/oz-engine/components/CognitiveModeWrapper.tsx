/**
 * Oz Engine™ — CognitiveModeWrapper (S1-004)
 *
 * Wraps any section of the UI in the correct `data-mode` attribute so that
 * the Urban Oz CSS variables (`--mode-bg`, `--mode-accent`, etc.) are applied.
 *
 * Usage:
 * ```tsx
 * <CognitiveModeWrapper mode={cognitiveMode}>
 *   <MyDashboard />
 * </CognitiveModeWrapper>
 * ```
 *
 * If `mode` is omitted the component reads from the OzEngineContext
 * (falls back to "flow" if not inside a provider).
 *
 * The component also adjusts:
 *   - Information density (compact in recovery, expanded in power)
 *   - Base font size scale (larger in recovery, normal in others)
 */

import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";
import { getCognitiveModeDataAttr } from "../detection";
import { useOzEngineOptional } from "../context";
import type { CognitiveMode } from "../types";

export interface CognitiveModeWrapperProps {
  /** Override mode — if omitted reads from OzEngineContext */
  mode?: CognitiveMode;
  children: ReactNode;
  className?: string;
  /** Apply mode-surface class (sets background + text from mode vars) */
  applyBackground?: boolean;
  /** Apply mode-glow-shadow class */
  applyGlow?: boolean;
  /** HTML element to render as (default: "div") */
  as?: ElementType;
}

/**
 * Per-mode density class helpers.
 * - flow     → standard layout
 * - power    → denser, more info on screen
 * - recovery → spacious, minimal
 * - creative → standard
 */
const DENSITY_CLASS: Record<CognitiveMode, string> = {
  flow: "oz-density-flow",
  power: "oz-density-power",
  recovery: "oz-density-recovery",
  creative: "oz-density-creative",
};

export function CognitiveModeWrapper({
  mode: modeProp,
  children,
  className,
  applyBackground = false,
  applyGlow = false,
  as: Tag = "div",
}: CognitiveModeWrapperProps) {
  const ctx = useOzEngineOptional();
  const resolvedMode: CognitiveMode = modeProp ?? ctx?.cognitiveMode ?? "flow";
  const dataMode = getCognitiveModeDataAttr(resolvedMode);
  const densityClass = DENSITY_CLASS[resolvedMode];

  return (
    <Tag
      data-mode={dataMode}
      className={cn(
        densityClass,
        applyBackground && "mode-surface",
        applyGlow && "mode-glow-shadow",
        className
      )}
    >
      {children}
    </Tag>
  );
}
