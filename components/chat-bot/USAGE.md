# ChatWithAI Component - Usage Guide

The `ChatWithAI` component has been refactored to be highly reusable across different features and pages. This guide shows you how to use it.

## Features

-   ✅ Feature-agnostic design - works with any API endpoint
-   ✅ Flexible payload building (FormData or JSON)
-   ✅ Custom success/error handling
-   ✅ Customizable UI messages and styling
-   ✅ Pre-configured setups for common features
-   ✅ TypeScript support with full type safety

## Basic Usage

### 1. Using Pre-configured Setups (Recommended)

For common features like SRS, Diagrams, and Wireframes:

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { srsDocumentChatConfig } from "@/components/chat-bot/chat-configs";

export function SRSDocumentPage() {
    const [content, setContent] = useState("");
    const projectId = "123";
    const documentId = "456";

    return (
        <ChatWithAI
            apiConfig={srsDocumentChatConfig}
            additionalData={{ projectId, documentId }}
            onContentUpdate={(newContent) => setContent(newContent)}
            emptyStateMessage="Ask me anything about your document!"
            placeholder="e.g., Add a security requirements section..."
        />
    );
}
```

### 2. Custom API Configuration

For custom features or endpoints:

```tsx
import { ChatWithAI, ChatAPIConfig } from "@/components/chat-bot/ChatWithAI";

const customChatConfig: ChatAPIConfig = {
    endpoint: "/api/my-custom-feature",
    method: "POST",
    buildPayload: (userPrompt, additionalData) => ({
        query: userPrompt,
        featureId: additionalData?.featureId,
        userId: additionalData?.userId,
    }),
    extractResponseContent: (data) => data.result,
    extractResponseMessage: (data) => data.message || "Done!",
};

export function CustomFeaturePage() {
    return (
        <ChatWithAI
            apiConfig={customChatConfig}
            additionalData={{ featureId: "abc", userId: "xyz" }}
            onContentUpdate={(content) => console.log(content)}
        />
    );
}
```

### 3. Using Helper Functions

```tsx
import { createGenericChatConfig } from "@/components/chat-bot/chat-configs";

const myConfig = createGenericChatConfig(
    "/api/analysis",
    "POST",
    "analysisResult", // key in response for content
    "statusMessage" // key in response for message
);

<ChatWithAI apiConfig={myConfig} additionalData={{ datasetId: "123" }} />;
```

## Configuration Examples

### Example 1: SRS Document Generator

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { srsDocumentChatConfig } from "@/components/chat-bot/chat-configs";

<ChatWithAI
    apiConfig={srsDocumentChatConfig}
    additionalData={{
        projectId: "proj_123",
        documentId: "doc_456",
    }}
    onContentUpdate={(newContent) => setDocumentContent(newContent)}
    emptyStateMessage="Ask me to update your SRS document!"
    successMessage="Document updated successfully!"
/>;
```

### Example 2: Diagram Generator

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { diagramChatConfig } from "@/components/chat-bot/chat-configs";

<ChatWithAI
    apiConfig={diagramChatConfig}
    additionalData={{
        projectId: "proj_123",
        diagramId: "diagram_789",
    }}
    onContentUpdate={(diagramCode) => setDiagramCode(diagramCode)}
    placeholder="e.g., Add a new class for User authentication..."
    emptyStateMessage="Describe the changes you want in your diagram"
/>;
```

### Example 3: Wireframe Generator

```tsx
import { ChatWithAI } from "@/components/chat-bot/ChatWithAI";
import { wireframeChatConfig } from "@/components/chat-bot/chat-configs";

<ChatWithAI
    apiConfig={wireframeChatConfig}
    additionalData={{
        projectId: "proj_123",
        wireframeId: "wire_321",
    }}
    onContentUpdate={(htmlCode) => setWireframeHtml(htmlCode)}
/>;
```

### Example 4: Custom FormData API

```tsx
import { createFormDataChatConfig } from "@/components/chat-bot/chat-configs";

const myFormDataConfig = createFormDataChatConfig(
    "/api/image-generator",
    "POST",
    "prompt", // field name for user input
    (data) => data.imageUrl // extract content
);

<ChatWithAI
    apiConfig={myFormDataConfig}
    additionalData={{
        style: "realistic",
        size: "1024x1024",
    }}
    onSuccess={(data) => {
        console.log("Image generated:", data.imageUrl);
    }}
/>;
```

## Props Reference

### Required Props

| Prop        | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `apiConfig` | `ChatAPIConfig` | API configuration object |

### Optional Props

| Prop                      | Type                                            | Default                                 | Description                                    |
| ------------------------- | ----------------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `additionalData`          | `Record<string, any>`                           | `undefined`                             | Extra data passed to API (IDs, filters, etc.)  |
| `onContentUpdate`         | `(content: string, fullResponse?: any) => void` | `undefined`                             | Called when content is extracted from response |
| `onSuccess`               | `(data: any) => void`                           | `undefined`                             | Custom success handler                         |
| `onError`                 | `(error: any) => void`                          | `undefined`                             | Custom error handler                           |
| `placeholder`             | `string`                                        | `"Enter your prompt here..."`           | Input placeholder text                         |
| `emptyStateMessage`       | `string`                                        | `"Ask me anything about your project!"` | Message shown when chat is empty               |
| `successMessage`          | `string`                                        | Auto-generated                          | Message shown after successful request         |
| `errorMessage`            | `string`                                        | Default error message                   | Message shown on error                         |
| `height`                  | `string`                                        | `"calc(100vh-250px)"`                   | Component height                               |
| `showProcessingIndicator` | `boolean`                                       | `true`                                  | Show "Processing..." indicator                 |
| `enableMarkdown`          | `boolean`                                       | `false`                                 | Enable markdown rendering (future feature)     |

## ChatAPIConfig Interface

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

## Migration Guide

### Old Usage (Before Refactor)

```tsx
<ChatWithAI
    onContentUpdate={(newContent) => setContent(newContent)}
    projectId={projectId}
    documentId={documentId}
/>
```

### New Usage (After Refactor)

```tsx
import { srsDocumentChatConfig } from "@/components/chat-bot/chat-configs";

<ChatWithAI
    apiConfig={srsDocumentChatConfig}
    additionalData={{ projectId, documentId }}
    onContentUpdate={(newContent) => setContent(newContent)}
/>;
```

## Advanced Examples

### Example: With Custom Success/Error Handling

```tsx
<ChatWithAI
    apiConfig={myConfig}
    additionalData={{ userId: "123" }}
    onSuccess={(data) => {
        toast.success("Operation completed!");
        logAnalytics("chat_success", data);
    }}
    onError={(error) => {
        toast.error("Something went wrong");
        logError(error);
    }}
    onContentUpdate={(content, fullResponse) => {
        setContent(content);
        setMetadata(fullResponse.metadata);
    }}
/>
```

### Example: Multiple Instances on Same Page

```tsx
function ProjectPage() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* SRS Chat */}
            <ChatWithAI
                apiConfig={srsDocumentChatConfig}
                additionalData={{ projectId, documentId }}
                onContentUpdate={setSRSContent}
                emptyStateMessage="Update your SRS document"
                height="500px"
            />

            {/* Diagram Chat */}
            <ChatWithAI
                apiConfig={diagramChatConfig}
                additionalData={{ projectId, diagramId }}
                onContentUpdate={setDiagramCode}
                emptyStateMessage="Update your diagram"
                height="500px"
            />
        </div>
    );
}
```

## Tips

1. **Reuse configurations**: Create configs once and import them wherever needed
2. **Type safety**: TypeScript will catch configuration errors at compile time
3. **Custom extractors**: Use `extractResponseContent` to handle different API response structures
4. **Error handling**: Provide `onError` for custom error handling (logging, toasts, etc.)
5. **Height management**: Adjust `height` prop based on your layout needs

## Common Patterns

### Pattern 1: Real-time Preview Update

```tsx
const [preview, setPreview] = useState("");

<ChatWithAI
    apiConfig={myConfig}
    onContentUpdate={(newContent) => {
        setPreview(newContent);
        // Auto-save or trigger re-render
    }}
/>;
```

### Pattern 2: Chained Operations

```tsx
<ChatWithAI
    apiConfig={myConfig}
    onSuccess={async (data) => {
        await saveToDatabase(data);
        await notifyUsers(data);
        refreshDashboard();
    }}
/>
```

### Pattern 3: Conditional Rendering

```tsx
{
    userHasPermission && (
        <ChatWithAI
            apiConfig={restrictedFeatureConfig}
            additionalData={{ userId: currentUser.id }}
        />
    );
}
```
