# ChatWithAI Component - Refactoring Summary

## What Was Done

The `ChatWithAI` component has been completely refactored to be highly reusable across different features and pages in your application.

## Key Improvements

### 1. **Feature-Agnostic Design** ✨

-   Component no longer hardcoded to SRS documents
-   Works with any API endpoint through configuration
-   Supports multiple features: SRS, Diagrams, Wireframes, and custom implementations

### 2. **Flexible API Integration** 🔌

-   Configurable endpoints and HTTP methods
-   Support for both FormData and JSON payloads
-   Custom response extractors for different API structures

### 3. **Enhanced Customization** 🎨

-   Customizable UI messages (placeholder, empty state, success, error)
-   Adjustable height and styling
-   Optional processing indicators and markdown support

### 4. **Better Developer Experience** 👨‍💻

-   Pre-configured setups for common features
-   Helper functions for quick configuration
-   Comprehensive TypeScript support
-   Detailed documentation and examples

### 5. **Extensibility** 🚀

-   Easy to add new features without modifying the core component
-   Custom success/error handlers
-   Access to full API response data

## Files Created/Modified

### New Files:

1. **`components/chat-bot/chat-configs.ts`**

    - Pre-configured API configs for SRS, Diagrams, Wireframes
    - Helper functions to create custom configs
    - Reusable across the entire application

2. **`components/chat-bot/index.ts`**

    - Barrel export for clean imports
    - Single source for all chat-related exports

3. **`components/chat-bot/USAGE.md`**

    - Comprehensive usage guide
    - Multiple examples and patterns
    - Props reference and migration guide

4. **`components/chat-bot/MIGRATION.md`**
    - Step-by-step migration instructions
    - Examples for each feature (SRS, Diagram, Wireframe)
    - Common issues and solutions

### Modified Files:

1. **`components/chat-bot/ChatWithAI.tsx`**

    - Complete refactor from hardcoded to configurable
    - Added TypeScript interfaces for better type safety
    - Enhanced with callbacks and customization options

2. **`app/dashboard/project/[id]/srsgenerator/_component/DocumentOverview/DocumentViewer.tsx`**
    - Updated to use new API configuration
    - Now uses `srsDocumentChatConfig`
    - Example of proper migration

## Usage Examples

### Simple Usage (Pre-configured):

```tsx
import { ChatWithAI, srsDocumentChatConfig } from "@/components/chat-bot";

<ChatWithAI
    apiConfig={srsDocumentChatConfig}
    additionalData={{ projectId, documentId }}
    onContentUpdate={(content) => setContent(content)}
/>;
```

### Custom Configuration:

```tsx
import { ChatWithAI, ChatAPIConfig } from "@/components/chat-bot";

const myConfig: ChatAPIConfig = {
    endpoint: "/api/my-feature",
    method: "POST",
    buildPayload: (prompt, data) => ({ query: prompt, ...data }),
    extractResponseContent: (res) => res.result,
};

<ChatWithAI apiConfig={myConfig} additionalData={{ userId: "123" }} />;
```

### Using Helper Functions:

```tsx
import { ChatWithAI, createGenericChatConfig } from "@/components/chat-bot";

const config = createGenericChatConfig("/api/analysis", "POST", "result");

<ChatWithAI apiConfig={config} />;
```

## Pre-configured Features

1. **SRS Document Generator** (`srsDocumentChatConfig`)

    - Endpoint: `/api/srs-generate/doc`
    - Method: PATCH
    - Requires: `projectId`, `documentId`

2. **Diagram Generator** (`diagramChatConfig`)

    - Endpoint: `/api/diagram`
    - Method: PATCH
    - Requires: `projectId`, `diagramId`

3. **Wireframe Generator** (`wireframeChatConfig`)
    - Endpoint: `/api/wireframe-generate`
    - Method: PATCH
    - Requires: `projectId`, `wireframeId`

## Benefits

### For Developers:

-   ✅ Write less code - use pre-configured setups
-   ✅ Type-safe - full TypeScript support
-   ✅ Consistent - same interface across features
-   ✅ Flexible - easy to customize for new features
-   ✅ Maintainable - changes in one place affect all usages

### For the Codebase:

-   ✅ DRY principle - no code duplication
-   ✅ Single responsibility - component focuses on UI, configs handle API
-   ✅ Open/Closed principle - open for extension, closed for modification
-   ✅ Better testing - easier to mock and test different configurations

### For Users:

-   ✅ Consistent UX across all chat interfaces
-   ✅ Customizable messages for different contexts
-   ✅ Better error handling and feedback

## Next Steps

### To Use in Other Pages:

1. **For Diagrams** (DiagramViewer.tsx):

```tsx
import { ChatWithAI, diagramChatConfig } from "@/components/chat-bot";

<ChatWithAI
    apiConfig={diagramChatConfig}
    additionalData={{ projectId, diagramId }}
    onContentUpdate={(code) => setDiagramCode(code)}
/>;
```

2. **For Wireframes** (WireframeOverview.tsx):

```tsx
import { ChatWithAI, wireframeChatConfig } from "@/components/chat-bot";

<ChatWithAI
    apiConfig={wireframeChatConfig}
    additionalData={{ projectId, wireframeId }}
    onContentUpdate={(html) => setWireframeHtml(html)}
/>;
```

3. **For New Features**:
    - Create a config in `chat-configs.ts`
    - Or use helper functions for quick setup
    - Import and use with ChatWithAI

## Configuration Interface

```typescript
interface ChatAPIConfig {
    endpoint: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    buildPayload: (
        userPrompt: string,
        additionalData?: Record<string, any>
    ) => FormData | Record<string, any>;
    extractResponseContent?: (data: any) => string | null;
    extractResponseMessage?: (data: any) => string;
}
```

## Available Props

-   `apiConfig` (required): API configuration object
-   `additionalData`: Extra data for API (IDs, filters, etc.)
-   `onContentUpdate`: Callback when content updates
-   `onSuccess`: Custom success handler
-   `onError`: Custom error handler
-   `placeholder`: Input placeholder text
-   `emptyStateMessage`: Message when chat is empty
-   `successMessage`: Message after success
-   `errorMessage`: Message on error
-   `height`: Component height
-   `showProcessingIndicator`: Show "Processing..." (default: true)
-   `enableMarkdown`: Enable markdown rendering (default: false)

## Documentation Files

1. **USAGE.md** - Complete usage guide with examples
2. **MIGRATION.md** - Migration instructions for existing code
3. **README** (this file) - Overview and summary

## Testing

All existing TypeScript errors have been resolved. The component is ready to use!

To test:

1. The DocumentViewer already uses the new API ✅
2. Update DiagramViewer and WireframeOverview using MIGRATION.md examples
3. For new features, create a config and integrate

## Questions?

Refer to:

-   **USAGE.md** for detailed examples and patterns
-   **MIGRATION.md** for migration help
-   **chat-configs.ts** for pre-configured setups and helpers
-   Component source code for TypeScript definitions

---

**Author**: GitHub Copilot  
**Date**: November 24, 2025  
**Version**: 2.0.0
