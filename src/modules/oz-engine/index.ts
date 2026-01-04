/**
 * Oz Engine™ - Main Barrel Export
 * 
 * Standalone cognitive accessibility engine
 * Can be reused across applications or sold as AI
 * 
 * @example
 * ```tsx
 * import { OzEngineProvider, useOzEngine, COGNITIVE_MODES } from "@/modules/oz-engine";
 * 
 * function App() {
 *   return (
 *     <OzEngineProvider>
 *       <MyApp />
 *     </OzEngineProvider>
 *   );
 * }
 * 
 * function MyComponent() {
 *   const { cognitiveMode, setCognitiveMode } = useOzEngine();
 *   // ...
 * }
 * ```
 */

// Types
export * from "./types";

// Constants
export * from "./constants";

// Hooks
export * from "./hooks";

// Context
export * from "./context";
