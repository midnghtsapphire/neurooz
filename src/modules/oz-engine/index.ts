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

// Detection (pure functions — no side effects, safe for server/test contexts)
export { detectCognitiveMode, getCognitiveModeDataAttr } from "./detection";

// Hooks
export * from "./hooks";

// Components
export * from "./components";

// Context
export * from "./context";
