# Adding API for a Workflow Step

This guide explains how to add a new API integration for a workflow step (Planning, Analysis, or Design) using WebSocket connections.

## Table of Contents

-   [Overview](#overview)
-   [API Endpoint Specification](#api-endpoint-specification)
-   [Implementation Steps](#implementation-steps)
-   [Code Examples](#code-examples)
-   [Testing](#testing)

## Overview

Each workflow step can connect to a backend WebSocket API to generate documents in real-time. This guide shows how to integrate a new step with the WebSocket API.

### Current Architecture

```
Frontend (Next.js)
├── Step Component (e.g., PlanningStep.tsx)
├── Shared Hooks (useWorkflowGeneration.ts)
├── Shared API (api.ts)
└── API Route (/app/api/workflow/...)
    └── WebSocket Client → Backend WebSocket Server
```

## API Endpoint Specification

### WebSocket Endpoint

```
ws://localhost:8010/api/v1/ws/projects/{project_id}/{step-name}?token={JWT_TOKEN}
```

**Parameters:**

-   `project_id`: The unique identifier of the project
-   `step-name`: The workflow step name (e.g., `planning`, `analysis`, `design`)
-   `token`: JWT authentication token (passed as query parameter)

**Authentication:**

The JWT token is obtained from the httpOnly cookie via `/api/auth/token` endpoint and then passed as a query parameter to the WebSocket connection. This is required because:

-   WebSocket connections are initiated from client-side JavaScript
-   httpOnly cookies cannot be accessed directly from JavaScript
-   The token must be explicitly passed to the WebSocket URL

### Request Payload

The request payload structure is the same for all workflow steps, but the `documents` array will contain different document IDs based on:

-   The specific workflow step (planning, analysis, or design)
-   The documents selected by the user in the UI

**Payload Structure:**

```json
{
    "project_name": "AI Platform",
    "description": "AI powered SaaS platform",
    "documents": [
        {
            "type": "document-id-1"
        },
        {
            "type": "document-id-2"
        }
    ]
}
```

**Fields:**

-   `project_name` (string, required): The name of the project
-   `description` (string, required): Project description or additional context/prompt
-   `documents` (array, required): List of documents to generate, each containing:
    -   `type` (string, required): The document ID from the step's document list

**Example for Planning Step:**

User selects: Stakeholder Register, Business Case, and Product Roadmap

```json
{
    "project_name": "AI Platform",
    "description": "AI powered SaaS platform for enterprise customers",
    "documents": [
        {
            "type": "stakeholder-register"
        },
        {
            "type": "business-case"
        },
        {
            "type": "product-roadmap"
        }
    ]
}
```

Available Planning document IDs: `stakeholder-register`, `high-level-requirements`, `requirements-management-plan`, `business-case`, `scope-statement`, `product-roadmap`

**Example for Analysis Step:**

User selects: Feasibility Study and Risk Register

```json
{
    "project_name": "AI Platform",
    "description": "Analyze technical and financial feasibility",
    "documents": [
        {
            "type": "feasibility-study"
        },
        {
            "type": "risk-register"
        }
    ]
}
```

Available Analysis document IDs: `feasibility-study`, `cost-benefit-analysis`, `risk-register`, `compliance`

**Example for Design Step:**

User selects: SRS, HLD Architecture, and Database Schemas

```json
{
    "project_name": "AI Platform",
    "description": "Design system architecture and database structure",
    "documents": [
        {
            "type": "srs"
        },
        {
            "type": "hld-arch"
        },
        {
            "type": "lld-db"
        }
    ]
}
```

Available Design document IDs: `srs`, `hld-arch`, `hld-cloud`, `hld-tech`, `lld-arch`, `lld-db`, `lld-api`, `lld-pseudo`, `uiux-wireframe`, `uiux-mockup`, `uiux-prototype`, `rtm`

> **Note:** The document IDs in the payload must match the IDs defined in each step's `documents.ts` file. The list is dynamic and depends on user selection in the UI.

### Response Format

The WebSocket will send real-time updates:

```json
{
  "status": "processing" | "completed" | "error",
  "progress": 45,
  "message": "Generating stakeholder register...",
  "currentDocument": "stakeholder-register",
  "result": {
    "documents": [
      {
        "type": "stakeholder-register",
        "content": "# Stakeholder Register\n...",
        "url": "/path/to/document"
      }
    ]
  }
}
```

## Implementation Steps

### Step 1: Update Type Definitions

Update [`shared/types.ts`](../../app/dashboard/project/[id]/workflows/_components/steps/shared/types.ts):

```typescript
// Add new payload structure
export interface WorkflowDocumentRequest {
    type: string;
}

export interface GenerateWorkflowPayload {
    project_name: string;
    description: string;
    documents: WorkflowDocumentRequest[];
    projectId?: string;
    stepType?: "planning" | "analysis" | "design";
}

// Add WebSocket response types
export interface WorkflowWSMessage {
    status: "processing" | "completed" | "error";
    progress?: number;
    message?: string;
    currentDocument?: string;
    result?: {
        documents: GeneratedDocument[];
    };
}

export interface GeneratedDocument {
    type: string;
    content: string;
    url?: string;
}
```

### Step 2: Create WebSocket API Client

Create or update [`shared/api.ts`](../../app/dashboard/project/[id]/workflows/_components/steps/shared/api.ts):

```typescript
/**
 * WebSocket configuration for workflow API
 */
const WS_CONFIG = {
    baseUrl: "ws://localhost:8010/api/v1/ws",
    reconnectAttempts: 3,
    reconnectDelay: 2000,
} as const;

/**
 * Generate workflow documents using WebSocket connection
 * @param payload - The generation payload
 * @param projectId - The project ID
 * @param stepName - The workflow step name (planning, analysis, design)
 * @param token - JWT authentication token
 * @param onMessage - Callback for WebSocket messages
 * @returns WebSocket connection
 */
export function generateWorkflowDocumentsWS(
    payload: GenerateWorkflowPayload,
    projectId: string,
    stepName: string,
    token: string,
    onMessage: (message: WorkflowWSMessage) => void
): WebSocket {
    const wsUrl = `${
        WS_CONFIG.baseUrl
    }/projects/${projectId}/${stepName}?token=${encodeURIComponent(token)}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log(`WebSocket connected for ${stepName} step`);
        // Send the payload once connected
        ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
        try {
            const message: WorkflowWSMessage = JSON.parse(event.data);
            onMessage(message);

            // Auto-close on completion or error
            if (message.status === "completed" || message.status === "error") {
                ws.close();
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onMessage({
            status: "error",
            message: "WebSocket connection error",
        });
    };

    ws.onclose = () => {
        console.log(`WebSocket closed for ${stepName} step`);
    };

    return ws;
}

/**
 * Get JWT token from session/storage
 * @returns JWT token string
 */
export function getAuthToken(): string {
    // Implement based on your auth system
    // Example: return localStorage.getItem('auth_token') || '';
    return ""; // TODO: Implement token retrieval
}
```

### Step 3: Create Backend API Route

Create [`/app/api/workflow/generate/route.ts`](../../app/api/workflow/generate/route.ts):

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_name, description, documents, projectId, stepType } =
            body;

        // Validate required fields
        if (!project_name || !documents || !Array.isArray(documents)) {
            return NextResponse.json(
                { status: "error", message: "Invalid request payload" },
                { status: 400 }
            );
        }

        // TODO: Get JWT token from session/cookies
        const token = ""; // Implement token retrieval

        // Return WebSocket connection details
        return NextResponse.json({
            status: "success",
            websocket: {
                url: `ws://localhost:8010/api/v1/ws/projects/${projectId}/${stepType}`,
                token,
            },
            message: "Connect to WebSocket to receive real-time updates",
        });
    } catch (error) {
        console.error("Error in workflow generate route:", error);
        return NextResponse.json(
            { status: "error", message: "Internal server error" },
            { status: 500 }
        );
    }
}
```

### Step 4: Update Generation Hook

Update [`shared/hooks/useWorkflowGeneration.ts`](../../app/dashboard/project/[id]/workflows/_components/steps/shared/hooks/useWorkflowGeneration.ts):

```typescript
import { useState, useRef, useCallback } from "react";
import { generateWorkflowDocumentsWS, getAuthToken } from "../api";
import { GenerateWorkflowPayload, WorkflowWSMessage } from "../types";

export function useWorkflowGeneration(onGenerate?: () => void) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentDocument, setCurrentDocument] = useState<string>("");
    const [generatedDocuments, setGeneratedDocuments] = useState<any[]>([]);

    const wsRef = useRef<WebSocket | null>(null);

    const generateDocuments = useCallback(
        async (
            payload: GenerateWorkflowPayload,
            projectId: string,
            stepName: string
        ) => {
            setIsGenerating(true);
            setError(null);
            setProgress(0);
            setGeneratedDocuments([]);

            try {
                const token = getAuthToken();

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                // Create WebSocket connection
                wsRef.current = generateWorkflowDocumentsWS(
                    payload,
                    projectId,
                    stepName,
                    token,
                    handleWSMessage
                );

                return true;
            } catch (err) {
                console.error("Error generating documents:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred"
                );
                setIsGenerating(false);
                return false;
            }
        },
        []
    );

    const handleWSMessage = useCallback(
        (message: WorkflowWSMessage) => {
            console.log("WebSocket message:", message);

            // Update progress
            if (message.progress !== undefined) {
                setProgress(message.progress);
            }

            // Update current document
            if (message.currentDocument) {
                setCurrentDocument(message.currentDocument);
            }

            // Handle completion
            if (message.status === "completed" && message.result) {
                setGeneratedDocuments(message.result.documents);
                setIsGenerating(false);
                setProgress(100);

                if (onGenerate) {
                    onGenerate();
                }
            }

            // Handle error
            if (message.status === "error") {
                setError(message.message || "Generation failed");
                setIsGenerating(false);
            }
        },
        [onGenerate]
    );

    const cancelGeneration = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsGenerating(false);
        setProgress(0);
    }, []);

    const resetGeneration = useCallback(() => {
        setIsGenerating(false);
        setError(null);
        setProgress(0);
        setCurrentDocument("");
        setGeneratedDocuments([]);
    }, []);

    return {
        isGenerating,
        error,
        progress,
        currentDocument,
        generatedDocuments,
        generateDocuments,
        cancelGeneration,
        resetGeneration,
    };
}
```

### Step 5: Update Step Component

Update your step component (e.g., [`PlanningStep.tsx`](../../app/dashboard/project/[id]/workflows/_components/steps/planning/PlaningStep.tsx)):

```typescript
const handleGenerateDocuments = async () => {
    // Transform selected documents to the required format
    const documents = documentSelection.selectedDocs.map((docId) => ({
        type: docId,
    }));

    const payload: GenerateWorkflowPayload = {
        project_name: "My Project", // Get from project context
        description: prompt,
        documents,
    };

    const projectId = "project-123"; // Get from router params or context
    const stepName = "planning"; // or 'analysis', 'design'

    await planningGeneration.generateDocuments(payload, projectId, stepName);
};
```

### Step 6: Update Loading Dialog

Update [`GenerationLoadingDialog.tsx`](../../app/dashboard/project/[id]/workflows/_components/steps/shared/components/GenerationLoadingDialog.tsx) to show real-time progress:

```typescript
interface GenerationLoadingDialogProps {
    isOpen: boolean;
    documentNames: string[];
    progress?: number;
    currentDocument?: string;
    onCancel?: () => void;
}

export function GenerationLoadingDialog({
    isOpen,
    documentNames,
    progress = 0,
    currentDocument,
    onCancel,
}: GenerationLoadingDialogProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        Generating Documents
                    </DialogTitle>
                    <DialogDescription>
                        Progress: {progress}%{" "}
                        {currentDocument && `- ${currentDocument}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Progress Bar */}
                    <Progress value={progress} className="h-2" />

                    {/* Document List */}
                    <div className="space-y-2">
                        {documentNames.map((name, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                <span>{name}</span>
                                {currentDocument === name && (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Cancel Button */}
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
```

## Code Examples

### Complete Integration Example

```typescript
// In your step component (e.g., AnalysisStep.tsx)
export default function AnalysisStep({ onNext, onBack }: StepProps) {
    const [prompt, setPrompt] = useState("");
    const { selectedDocs } = useDocumentSelection(getAllDocIds());
    const generation = useWorkflowGeneration(() => {
        console.log("Generation completed!");
    });

    const handleGenerate = async () => {
        const payload = {
            project_name: "AI Platform",
            description: prompt,
            documents: selectedDocs.map((type) => ({ type })),
        };

        await generation.generateDocuments(payload, "project-id", "analysis");
    };

    return (
        <div>
            {/* UI components */}
            <Button onClick={handleGenerate} disabled={generation.isGenerating}>
                Generate
            </Button>

            <GenerationLoadingDialog
                isOpen={generation.isGenerating}
                documentNames={selectedDocs}
                progress={generation.progress}
                currentDocument={generation.currentDocument}
                onCancel={generation.cancelGeneration}
            />
        </div>
    );
}
```

## Testing

### 1. WebSocket Connection Test

```typescript
// Test WebSocket connection
const ws = new WebSocket(
    "ws://localhost:8010/api/v1/ws/projects/test-project/planning?token=your-jwt-token"
);

ws.onopen = () => {
    ws.send(
        JSON.stringify({
            project_name: "Test Project",
            description: "Test description",
            documents: [{ type: "business-case" }],
        })
    );
};

ws.onmessage = (event) => {
    console.log("Received:", JSON.parse(event.data));
};
```

### 2. Integration Test Checklist

-   [ ] WebSocket connects successfully with JWT token
-   [ ] Payload is sent correctly after connection
-   [ ] Real-time progress updates are received
-   [ ] Document generation completes successfully
-   [ ] Error handling works correctly
-   [ ] WebSocket closes properly on completion
-   [ ] Cancel functionality works
-   [ ] Multiple documents are generated correctly

### 3. Error Scenarios to Test

-   Invalid JWT token
-   Network connection loss
-   Backend service unavailable
-   Invalid payload format
-   Generation timeout
-   Concurrent generation requests

## Common Issues & Solutions

### Issue: WebSocket connection fails

**Solution:** Check that:

-   Backend WebSocket server is running
-   JWT token is valid and not expired
-   CORS settings allow WebSocket connections
-   Firewall/proxy settings allow WebSocket protocol

### Issue: Messages not received

**Solution:**

-   Verify the WebSocket `onmessage` handler is properly attached
-   Check browser console for WebSocket errors
-   Ensure backend is sending proper JSON format

### Issue: Generation hangs

**Solution:**

-   Implement timeout mechanism
-   Add cancel functionality
-   Monitor backend logs for processing errors

## Best Practices

1. **Error Handling:** Always handle WebSocket errors gracefully
2. **Reconnection:** Implement reconnection logic for network issues
3. **Cleanup:** Close WebSocket connections when component unmounts
4. **Security:** Always validate JWT tokens server-side
5. **Progress Updates:** Provide meaningful progress feedback to users
6. **Timeout:** Set reasonable timeouts for long-running operations
7. **Logging:** Log WebSocket events for debugging

## Next Steps

1. Implement authentication token management
2. Add WebSocket reconnection logic
3. Create comprehensive error handling
4. Add unit and integration tests
5. Document backend WebSocket API requirements
6. Set up monitoring and logging

## Related Documentation

-   [Workflow Architecture](../architecture/architecture.md)
-   [SRS Generator Flow](../flow/srs_generator_flow.md)
-   [Product Requirements](../prd/product-requirements-document.md)
