# Oz Engine™ Modules

Standalone, reusable modules that power the cognitive accessibility features of Emerald Road OS.

## Installation

These modules are designed to be extracted and used in other applications.

```tsx
// Import everything from one place
import { 
  OzEngineProvider, 
  useOzEngine, 
  useCognitiveMode,
  COGNITIVE_MODES,
  learnData,
  searchDictionary 
} from "@/modules";
```

## Modules

### 1. Oz Engine (`@/modules/oz-engine`)

The core cognitive accessibility engine.

**Features:**
- Cognitive mode management (Flow, Power, Recovery)
- Consent-based power mode activation
- Persistent preferences via localStorage
- Type-safe TypeScript definitions

**Usage:**

```tsx
import { OzEngineProvider, useOzEngine } from "@/modules/oz-engine";

// Wrap your app
function App() {
  return (
    <OzEngineProvider>
      <MyApp />
    </OzEngineProvider>
  );
}

// Use in components
function MyComponent() {
  const { cognitiveMode, setCognitiveMode } = useOzEngine();
  
  return (
    <div>
      Current mode: {cognitiveMode}
      <button onClick={() => setCognitiveMode("flow")}>Flow</button>
    </div>
  );
}
```

**Exports:**
- `OzEngineProvider` - Context provider
- `useOzEngine` - Main hook for accessing engine state
- `useCognitiveMode` - Standalone cognitive mode hook
- `useDraggablePosition` - Draggable element positioning hook
- `CognitiveMode` - Type definition
- `COGNITIVE_MODES` - Mode configuration constants
- `STORAGE_KEYS` - LocalStorage key constants

### 2. Learn Module (`@/modules/learn`)

Educational content and help system.

**Features:**
- Single source of truth for all learn content
- Searchable dictionary with 7 categories
- Cognitive mode explanations
- Context-aware view help
- Neuro Safety Charter

**Usage:**

```tsx
import { learnData, searchDictionary, getViewHelp } from "@/modules/learn";

// Search the dictionary
const results = searchDictionary("API");

// Get help for current view
const help = getViewHelp("flow");

// Access modes
Object.entries(learnData.modes).map(([key, mode]) => {
  console.log(mode.title, mode.purpose);
});
```

**Exports:**
- `learnData` - Complete learn data object
- `searchDictionary(query)` - Search across all dictionary categories
- `getViewHelp(view)` - Get contextual help for a view
- `getDefinition(term)` - Get single term definition
- `getModesList()` - Get all modes as array
- `getCharterPrinciples()` - Get safety charter principles

## Architecture

```
src/modules/
├── index.ts                    # Main barrel export
├── oz-engine/
│   ├── index.ts               # Oz Engine barrel export
│   ├── types.ts               # TypeScript definitions
│   ├── constants.ts           # Configuration constants
│   ├── context/
│   │   ├── index.ts
│   │   └── OzEngineContext.tsx
│   └── hooks/
│       ├── index.ts
│       ├── use-cognitive-mode.ts
│       └── use-draggable-position.ts
└── learn/
    ├── index.ts               # Learn barrel export
    └── data.ts                # Learn data & utilities
```

## Extracting for Other Projects

1. Copy the `src/modules` folder to your new project
2. Update import paths if needed
3. Wrap your app with `OzEngineProvider`
4. Import and use as needed

## Selling as AI/Package

These modules are designed to be:
- **Self-contained** - No external dependencies beyond React
- **Type-safe** - Full TypeScript support
- **Configurable** - Easy to customize data and behavior
- **Accessible** - Built with WCAG and neurodiversity in mind

To package for distribution:
1. Extract `src/modules` to a new repository
2. Add package.json with dependencies
3. Publish to npm or sell as private package
