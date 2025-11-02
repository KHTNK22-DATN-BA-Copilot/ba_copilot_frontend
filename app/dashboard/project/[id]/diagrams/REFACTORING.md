# Diagrams Page - Refactored Architecture

This document explains the refactored structure of the Diagrams page, making it more maintainable and extensible.

## Project Structure

```
diagrams/
├── page.tsx                          # Main page component (simplified)
├── _components/
│   ├── PageHeader.tsx               # Page header with back button
│   ├── DiagramTypeSelector.tsx       # Diagram type selection grid
│   ├── FileUploadSection.tsx        # File upload dropzone
│   ├── AIGenerationForm.tsx         # AI generation form with options
│   ├── DiagramTabs.tsx              # Preview/Edit tabs for diagram
│   ├── DiagramDetail.tsx            # Diagram detail view with header and tabs
│   ├── RecentDiagramsList.tsx       # List of recent diagrams
│   └── CreateNewDiagramSection.tsx  # Container for create new components
├── _lib/
│   ├── constants.ts                 # Types and constants (diagram types, sample data)
│   └── hooks.ts                     # Custom hooks (useDiagramManager)
```

## Key Benefits

### 1. **Separation of Concerns**

-   Each component has a single responsibility
-   Page.tsx acts as an orchestrator
-   Easy to understand and modify individual pieces

### 2. **Reusability**

-   Components can be easily reused across the application
-   Shared constants and hooks prevent duplication

### 3. **Testability**

-   Each component can be tested independently
-   Custom hook can be unit tested
-   Clear props make mocking easier

### 4. **Extensibility**

-   Adding new diagram types: Update `DIAGRAM_TYPES` in `constants.ts`
-   Adding new form fields: Modify `AIGenerationForm.tsx`
-   Adding new diagram operations: Extend `useDiagramManager` hook

### 5. **Type Safety**

-   All interfaces defined in `constants.ts`
-   TypeScript ensures consistency across components

## Component Descriptions

### `PageHeader.tsx`

Displays the page title and back button. Can be reused in other project pages.

### `DiagramTypeSelector.tsx`

Renders diagram type options from the `DIAGRAM_TYPES` constant. Easy to extend with new types.

### `FileUploadSection.tsx`

Handles file upload UI. Can be extracted to a reusable file upload component.

### `AIGenerationForm.tsx`

Form with diagram description, complexity, and style options. Uses options from constants.

### `DiagramTabs.tsx`

Tab component for switching between preview and edit modes. Displays diagram markdown in edit mode.

### `DiagramDetail.tsx`

Combines header and tabs for the detailed diagram view. Manages the back navigation.

### `RecentDiagramsList.tsx`

Lists all diagrams with interaction handlers. Communicates via callback props.

### `CreateNewDiagramSection.tsx`

Container component that combines the three creation sections (type, upload, generation).

## Custom Hook: `useDiagramManager`

Manages diagram state with the following operations:

```typescript
const {
    diagrams, // Array of diagrams
    selectedDiagramId, // Currently selected diagram ID
    selectedDiagram, // Selected diagram object
    selectDiagram, // Function to select a diagram
    deselectDiagram, // Function to deselect
    addDiagram, // Function to add a new diagram
    deleteDiagram, // Function to delete a diagram
} = useDiagramManager();
```

## Adding Features

### Add New Diagram Type

1. Update `_lib/constants.ts`:

```typescript
export const DIAGRAM_TYPES: DiagramType[] = [
    // ... existing types
    { id: "sequence", name: "Sequence Diagram", icon: Workflow },
];
```

### Add New Form Field

1. Update `_lib/constants.ts` to add options:

```typescript
export const ORIENTATION_OPTIONS = [
    { value: "vertical", label: "Vertical" },
    { value: "horizontal", label: "Horizontal" },
];
```

2. Modify `AIGenerationForm.tsx` to include the new field

### Add New Diagram Operation

1. Extend `useDiagramManager` in `_lib/hooks.ts`:

```typescript
const updateDiagram = useCallback((id: number, updates: Partial<Diagram>) => {
    setDiagrams((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
}, []);
```

## Migration Notes

The refactoring maintains the same UI/UX as the original. The main difference:

-   Original: 400+ lines in single component
-   Refactored: ~20-40 lines per focused component
-   Better organization and easier to maintain

## Future Improvements

1. **State Management**: Consider using Context API or Zustand for complex state
2. **API Integration**: Add functions to fetch/save diagrams from backend
3. **Error Handling**: Add error boundaries and error states
4. **Loading States**: Add loading indicators for async operations
5. **Undo/Redo**: Implement history management for diagram editing
