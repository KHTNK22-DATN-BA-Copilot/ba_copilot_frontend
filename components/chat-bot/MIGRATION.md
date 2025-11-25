# Migration Examples

This file shows how to migrate existing ChatWithAI usages to the new API.

## 1. DiagramViewer Migration

**File**: `app/dashboard/project/[id]/diagrams/_components/diagramoverview/DiagramViewer.tsx`

### Before:

```tsx
import { ChatWithAI } from "../../../../../../../components/chat-bot/ChatWithAI";

// In component:
<ChatWithAI />;
```

### After:

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { diagramChatConfig } from "@/components/chat-bot/chat-configs";

// In component (add state and props):
const [diagramCode, setDiagramCode] = useState("");

<ChatWithAI
    apiConfig={diagramChatConfig}
    additionalData={{
        projectId: projectId, // pass your project ID
        diagramId: diagramId, // pass your diagram ID
    }}
    onContentUpdate={(newCode) => setDiagramCode(newCode)}
    emptyStateMessage="Ask me to update your diagram!"
    placeholder="e.g., Add a new class for authentication..."
/>;
```

## 2. WireframeOverview Migration

**File**: `app/dashboard/project/[id]/wireframegenerator/_component/WireframeOverview.tsx`

### Before:

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";

// In component:
<ChatWithAI />;
```

### After:

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { wireframeChatConfig } from "@/components/chat-bot/chat-configs";

// In component (add state and props):
const [wireframeHtml, setWireframeHtml] = useState("");

<ChatWithAI
    apiConfig={wireframeChatConfig}
    additionalData={{
        projectId: projectId, // pass your project ID
        wireframeId: wireframeId, // pass your wireframe ID
    }}
    onContentUpdate={(newHtml) => setWireframeHtml(newHtml)}
    emptyStateMessage="Ask me to update your wireframe!"
    placeholder="e.g., Add a navigation bar..."
/>;
```

## 3. DocumentViewer Migration (Already Done)

**File**: `app/dashboard/project/[id]/srsgenerator/_component/DocumentOverview/DocumentViewer.tsx`

### Before:

```tsx
<ChatWithAI
    onContentUpdate={(newContent) => setContent(newContent)}
    projectId={projectId}
    documentId={document_id}
/>
```

### After:

```tsx
import { srsDocumentChatConfig } from "@/components/chat-bot/chat-configs";

<ChatWithAI
    apiConfig={srsDocumentChatConfig}
    additionalData={{ projectId, documentId: document_id }}
    onContentUpdate={(newContent) => setContent(newContent)}
    emptyStateMessage="Ask me to update your SRS document!"
    placeholder="e.g., Add a security requirements section..."
/>;
```

## Quick Reference: Import Statements

```tsx
// Import the component
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";

// Import pre-configured setups
import {
    srsDocumentChatConfig,
    diagramChatConfig,
    wireframeChatConfig,
} from "@/components/chat-bot/chat-configs";

// OR use the index for cleaner imports
import {
    ChatWithAI,
    srsDocumentChatConfig,
    diagramChatConfig,
    wireframeChatConfig,
} from "@/components/chat-bot";
```

## Common Issues and Solutions

### Issue 1: TypeScript Error - Missing apiConfig

**Error**: `Property 'apiConfig' is missing in type...`

**Solution**: You must provide the `apiConfig` prop. Use one of the pre-configured configs or create your own.

### Issue 2: Content Not Updating

**Problem**: Chat works but content doesn't update in UI.

**Solution**: Make sure you're:

1. Passing the correct `additionalData` (IDs must match your API requirements)
2. Using the correct config for your feature
3. Setting state in `onContentUpdate` callback

### Issue 3: API Endpoint Not Found

**Problem**: Getting 404 errors.

**Solution**: Check that your API endpoint in the config matches your actual API route. You might need to create a custom config if the pre-configured ones don't match.

## Creating Custom Configs

If your feature needs a different API structure:

```tsx
import { ChatAPIConfig } from "@/components/chat-bot/ChatWithAI";

const myCustomConfig: ChatAPIConfig = {
    endpoint: "/api/your-endpoint",
    method: "POST",
    buildPayload: (userPrompt, additionalData) => {
        // Return FormData or JSON object
        return {
            userInput: userPrompt,
            featureId: additionalData?.featureId,
            // ... other fields
        };
    },
    extractResponseContent: (data) => {
        // Extract the content you want to update
        return data.yourContentField;
    },
    extractResponseMessage: (data) => {
        // Extract or create a success message
        return data.message || "Success!";
    },
};
```
