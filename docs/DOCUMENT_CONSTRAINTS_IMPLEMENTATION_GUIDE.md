# Frontend Implementation Guide

## BA Copilot - Constraint UI/UX Implementation

**Version:** 1.0  
**Date:** January 2, 2026  
**Authors:** BA Copilot Team  
**Status:** Active  
**Repository:** ba_copilot_frontend  
**Companion Document:** [DOCUMENT_CONSTRAINTS_SPECIFICATION.md](../ba_copilot_ai/docs/DOCUMENT_CONSTRAINTS_SPECIFICATION.md)

---

## 1. Overview

This guide provides implementation details for the **Frontend** component of the BA Copilot constraint system. The Frontend is responsible for displaying constraint information and handling user interactions.

### 1.1 Frontend Responsibilities

The Frontend Service is responsible for:

✅ **Display Constraint Violations**: Show error/warning messages to users  
✅ **Handle User Actions**: Generate, Upload, Skip buttons  
✅ **Call Backend API**: Check constraints before generation  
✅ **Show Dependency Info**: Display missing prerequisites  
✅ **User Guidance**: Suggest actions for resolving violations

❌ **NOT Responsible For**:

-   Constraint enforcement (Backend handles this)
-   Prerequisite detection (Backend handles this)
-   Document generation (AI Service handles this)
-   Database queries (Backend handles this)

### 1.2 Architecture Context

```
┌────────────────────────────────────────────────────────────────┐
│                   FRONTEND SERVICE ROLE                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   User clicks "Generate {Document Type}"                       │
│         │                                                      │
│         ▼                                                      │
│   ┌──────────────────┐                                        │
│   │ Frontend App     │                                        │
│   │ (Next.js/React)  │                                        │
│   └────────┬─────────┘                                        │
│            │                                                   │
│            │ 1. Check Constraints                             │
│            │ POST /api/constraints/check                      │
│            ├────────────────────────▶ Backend                 │
│            │                                                   │
│            │ 2. Response                                      │
│            │◀───────────────────────┘                         │
│            │                                                   │
│            │ 3. Has Violations?                               │
│            ├─────YES─────▶ Show Error Modal                   │
│            │              ┌─────────────────────────┐         │
│            │              │ ❌ Cannot Generate      │         │
│            │              │                         │         │
│            │              │ Required missing:       │         │
│            │              │ • Scope Statement       │         │
│            │              │ • Business Case         │         │
│            │              │                         │         │
│            │              │ [Generate] [Upload]     │         │
│            │              └─────────────────────────┘         │
│            │                                                   │
│            │ 4. Has Warnings?                                 │
│            ├─────YES─────▶ Show Warning Modal                 │
│            │              ┌─────────────────────────┐         │
│            │              │ ⚠️ Limited Context      │         │
│            │              │                         │         │
│            │              │ Recommended missing:    │         │
│            │              │ • Feasibility Study     │         │
│            │              │                         │         │
│            │              │ [Continue] [Generate]   │         │
│            │              └─────────────────────────┘         │
│            │                                                   │
│            │ 5. User Confirms                                 │
│            │ POST /api/documents/generate                     │
│            ├────────────────────────▶ Backend                 │
│            │                                                   │
│            │ 6. Success                                       │
│            │◀───────────────────────┘                         │
│            │                                                   │
│            │ 7. Display Result                                │
│            ▼                                                   │
│      Document Viewer                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. File Structure

```
ba_copilot_frontend/
├── app/
│   ├── api/
│   │   └── constraints/
│   │       └── route.ts               # Proxy to Backend
│   ├── dashboard/
│   │   └── [projectId]/
│   │       └── documents/
│   │           └── page.tsx           # Document management page
│   └── ...
├── components/
│   ├── documents/
│   │   ├── DocumentList.tsx           # List of documents
│   │   ├── GenerateDocumentButton.tsx # Trigger generation with constraint check
│   │   └── DocumentActions.tsx        # Generate/Upload/Download actions
│   ├── modals/
│   │   ├── ConstraintErrorModal.tsx   # Show required violations (blocking)
│   │   ├── ConstraintWarningModal.tsx # Show recommended warnings (non-blocking)
│   │   └── GenerateDocumentModal.tsx  # Main generation modal
│   └── ui/
│       └── ...                        # shadcn/ui components
├── lib/
│   ├── api/
│   │   ├── constraints.ts             # Constraint API client
│   │   └── documents.ts               # Document API client
│   └── types/
│       └── constraints.ts             # TypeScript types
└── docs/
    └── DOCUMENT_CONSTRAINTS_IMPLEMENTATION_GUIDE.md  # This file
```

---

## 3. Core Implementation

### 3.1 TypeScript Types

**File:** `lib/types/constraints.ts`

```typescript
/**
 * Constraint system TypeScript types
 */

export type EnforcementMode = "STRICT" | "GUIDED" | "PERMISSIVE";

export interface ConstraintViolation {
    type: "REQUIRED" | "RECOMMENDED";
    missing_document: string;
    display_name: string;
    message: string;
}

export interface ConstraintCheckRequest {
    document_type: string;
    project_id: string;
    user_id: string;
}

export interface ConstraintCheckResponse {
    can_generate: boolean;
    violations: ConstraintViolation[];
    warnings: ConstraintViolation[];
}

export interface DocumentType {
    id: string;
    display_name: string;
    description: string;
    category: "planning" | "analysis" | "design" | "srs" | "diagram";
}
```

### 3.2 API Client

**File:** `lib/api/constraints.ts`

```typescript
/**
 * Constraint API client
 */

import type {
    ConstraintCheckRequest,
    ConstraintCheckResponse,
} from "../types/constraints";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkConstraints(
    request: ConstraintCheckRequest
): Promise<ConstraintCheckResponse> {
    const response = await fetch(`${API_BASE_URL}/api/constraints/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add auth headers here
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to check constraints: ${response.statusText}`);
    }

    return response.json();
}
```

**File:** `lib/api/documents.ts`

```typescript
/**
 * Document API client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface GenerateDocumentRequest {
    document_type: string;
    project_id: string;
    user_id: string;
    description: string;
}

export interface GenerateDocumentResponse {
    success: boolean;
    document_id: string;
    content: string;
    warnings: Array<{
        type: string;
        missing_document: string;
        display_name: string;
        message: string;
    }>;
}

export async function generateDocument(
    request: GenerateDocumentRequest
): Promise<GenerateDocumentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/documents/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add auth headers
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail?.message || "Failed to generate document");
    }

    return response.json();
}
```

---

## 4. React Components

### 4.1 Generate Document Button

**File:** `components/documents/GenerateDocumentButton.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, AlertTriangle } from "lucide-react";
import { checkConstraints } from "@/lib/api/constraints";
import { ConstraintErrorModal } from "@/components/modals/ConstraintErrorModal";
import { ConstraintWarningModal } from "@/components/modals/ConstraintWarningModal";
import { GenerateDocumentModal } from "@/components/modals/GenerateDocumentModal";
import type { ConstraintCheckResponse } from "@/lib/types/constraints";

interface Props {
    documentType: string;
    displayName: string;
    projectId: string;
    userId: string;
}

export function GenerateDocumentButton({
    documentType,
    displayName,
    projectId,
    userId,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [constraintResult, setConstraintResult] =
        useState<ConstraintCheckResponse | null>(null);

    const handleGenerateClick = async () => {
        setIsLoading(true);

        try {
            // Step 1: Check constraints
            const result = await checkConstraints({
                document_type: documentType,
                project_id: projectId,
                user_id: userId,
            });

            setConstraintResult(result);

            // Step 2: Show appropriate modal
            if (!result.can_generate && result.violations.length > 0) {
                // Has required violations - show error modal (blocking)
                setShowErrorModal(true);
            } else if (result.warnings.length > 0) {
                // Has recommended warnings - show warning modal (non-blocking)
                setShowWarningModal(true);
            } else {
                // No violations or warnings - proceed directly
                setShowGenerateModal(true);
            }
        } catch (error) {
            console.error("Failed to check constraints:", error);
            // Fallback: show generate modal anyway (graceful degradation)
            setShowGenerateModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleGenerateClick} disabled={isLoading}>
                <FileText className="mr-2 h-4 w-4" />
                {isLoading ? "Checking..." : `Generate ${displayName}`}
            </Button>

            {/* Error Modal: Required prerequisites missing (blocking) */}
            {constraintResult && (
                <ConstraintErrorModal
                    open={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    documentType={documentType}
                    displayName={displayName}
                    violations={constraintResult.violations}
                    projectId={projectId}
                />
            )}

            {/* Warning Modal: Recommended prerequisites missing (non-blocking) */}
            {constraintResult && (
                <ConstraintWarningModal
                    open={showWarningModal}
                    onClose={() => setShowWarningModal(false)}
                    onContinue={() => {
                        setShowWarningModal(false);
                        setShowGenerateModal(true);
                    }}
                    documentType={documentType}
                    displayName={displayName}
                    warnings={constraintResult.warnings}
                    projectId={projectId}
                />
            )}

            {/* Generate Modal: Actual generation form */}
            <GenerateDocumentModal
                open={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                documentType={documentType}
                displayName={displayName}
                projectId={projectId}
                userId={userId}
            />
        </>
    );
}
```

### 4.2 Constraint Error Modal

**File:** `components/modals/ConstraintErrorModal.tsx`

```typescript
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileUp, FileText } from "lucide-react";
import type { ConstraintViolation } from "@/lib/types/constraints";

interface Props {
    open: boolean;
    onClose: () => void;
    documentType: string;
    displayName: string;
    violations: ConstraintViolation[];
    projectId: string;
}

export function ConstraintErrorModal({
    open,
    onClose,
    documentType,
    displayName,
    violations,
    projectId,
}: Props) {
    const handleGeneratePrerequisite = (prereqType: string) => {
        // Navigate to generate that prerequisite
        window.location.href = `/dashboard/${projectId}/documents?generate=${prereqType}`;
    };

    const handleUploadPrerequisite = () => {
        // Navigate to upload page
        window.location.href = `/dashboard/${projectId}/upload`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <DialogTitle>Cannot Generate {displayName}</DialogTitle>
                    </div>
                    <DialogDescription>
                        Required documents are missing. Please generate or
                        upload them first.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <h4 className="font-semibold text-red-900 mb-2">
                            Required Prerequisites Missing:
                        </h4>
                        <ul className="space-y-2">
                            {violations.map((violation, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-red-500">•</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-red-900">
                                            {violation.display_name}
                                        </p>
                                        <p className="text-sm text-red-700">
                                            {violation.message}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">
                            To proceed, you can:
                        </h4>
                        <div className="space-y-2">
                            {violations.map((violation, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleGeneratePrerequisite(
                                            violation.missing_document
                                        )
                                    }
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate {violation.display_name}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleUploadPrerequisite}
                            >
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload Existing Documents
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

### 4.3 Constraint Warning Modal

**File:** `components/modals/ConstraintWarningModal.tsx`

```typescript
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";
import type { ConstraintViolation } from "@/lib/types/constraints";

interface Props {
    open: boolean;
    onClose: () => void;
    onContinue: () => void;
    documentType: string;
    displayName: string;
    warnings: ConstraintViolation[];
    projectId: string;
}

export function ConstraintWarningModal({
    open,
    onClose,
    onContinue,
    documentType,
    displayName,
    warnings,
    projectId,
}: Props) {
    const handleGeneratePrerequisite = (prereqType: string) => {
        // Navigate to generate that prerequisite
        window.location.href = `/dashboard/${projectId}/documents?generate=${prereqType}`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <DialogTitle>
                            Generating {displayName} with Limited Context
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Recommended documents are missing. The output quality
                        may be improved by generating them first.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">
                            Recommended Prerequisites Missing:
                        </h4>
                        <ul className="space-y-2">
                            {warnings.map((warning, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-yellow-500">•</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-yellow-900">
                                            {warning.display_name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">
                            The output quality may be improved by:
                        </h4>
                        <div className="space-y-2">
                            {warnings.map((warning, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleGeneratePrerequisite(
                                            warning.missing_document
                                        )
                                    }
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate {warning.display_name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onContinue}>Continue Anyway</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

### 4.4 Generate Document Modal

**File:** `components/modals/GenerateDocumentModal.tsx`

```typescript
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateDocument } from "@/lib/api/documents";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    documentType: string;
    displayName: string;
    projectId: string;
    userId: string;
}

export function GenerateDocumentModal({
    open,
    onClose,
    documentType,
    displayName,
    projectId,
    userId,
}: Props) {
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error("Please provide a description");
            return;
        }

        setIsGenerating(true);

        try {
            const result = await generateDocument({
                document_type: documentType,
                project_id: projectId,
                user_id: userId,
                description: description.trim(),
            });

            toast.success(`${displayName} generated successfully!`);

            // Show warnings if any
            if (result.warnings && result.warnings.length > 0) {
                toast.warning(
                    `Generated with ${result.warnings.length} recommended prerequisite(s) missing`
                );
            }

            // Navigate to document viewer
            router.push(
                `/dashboard/${projectId}/documents/${result.document_id}`
            );
            onClose();
        } catch (error) {
            console.error("Generation failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to generate document"
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Generate {displayName}</DialogTitle>
                    <DialogDescription>
                        Provide details to generate this document using AI
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description / Requirements
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={`Describe what you want in the ${displayName.toLowerCase()}...`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            disabled={isGenerating}
                        />
                        <p className="text-sm text-gray-500">
                            Provide specific details to help the AI generate a
                            comprehensive document
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isGenerating}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

---

## 5. Environment Configuration

### 5.1 Required Environment Variables

```bash
# .env.local

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Enable constraint warnings UI
NEXT_PUBLIC_SHOW_CONSTRAINT_WARNINGS=true

# Auth configuration
NEXT_PUBLIC_AUTH_ENABLED=true
```

---

## 6. User Experience Flows

### 6.1 Flow 1: Generate with No Violations

```
User clicks "Generate HLD Architecture"
    ↓
Frontend calls /api/constraints/check
    ↓
Backend returns: can_generate=true, violations=[], warnings=[]
    ↓
Frontend shows GenerateDocumentModal
    ↓
User enters description and clicks "Generate"
    ↓
Frontend calls /api/documents/generate
    ↓
Backend generates document
    ↓
Frontend navigates to document viewer
```

### 6.2 Flow 2: Generate with Required Violations (Blocking)

```
User clicks "Generate HLD Architecture"
    ↓
Frontend calls /api/constraints/check
    ↓
Backend returns: can_generate=false, violations=[...], warnings=[]
    ↓
Frontend shows ConstraintErrorModal
    ↓
User sees:
  ❌ Cannot Generate HLD Architecture
  Required missing:
  • Scope Statement [Generate] button
  • High-Level Requirements [Generate] button
  [Upload Existing Documents] button
    ↓
User clicks "Generate Scope Statement"
    ↓
Repeat flow for Scope Statement
```

### 6.3 Flow 3: Generate with Recommended Warnings (Non-Blocking)

```
User clicks "Generate HLD Architecture"
    ↓
Frontend calls /api/constraints/check
    ↓
Backend returns: can_generate=true, violations=[], warnings=[...]
    ↓
Frontend shows ConstraintWarningModal
    ↓
User sees:
  ⚠️ Generating with Limited Context
  Recommended missing:
  • Feasibility Study [Generate] button

  [Cancel] [Continue Anyway]
    ↓
User clicks "Continue Anyway"
    ↓
Frontend shows GenerateDocumentModal
    ↓
Generation proceeds
```

---

## 7. Best Practices

### 7.1 Error Handling

```typescript
// Always handle constraint check failures gracefully
try {
  const result = await checkConstraints(...);
  // Handle result
} catch (error) {
  console.error("Constraint check failed:", error);
  // Fallback: Allow generation anyway (graceful degradation)
  setShowGenerateModal(true);
  toast.warning("Could not verify prerequisites. Proceeding anyway.");
}
```

### 7.2 Loading States

```typescript
// Show loading indicators during constraint checks
<Button disabled={isLoading}>
    {isLoading ? (
        <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking prerequisites...
        </>
    ) : (
        <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Document
        </>
    )}
</Button>
```

### 7.3 Accessibility

```typescript
// Use proper ARIA labels and semantic HTML
<Dialog
    aria-labelledby="constraint-error-title"
    aria-describedby="constraint-error-description"
>
    <DialogTitle id="constraint-error-title">
        Cannot Generate {displayName}
    </DialogTitle>
    <DialogDescription id="constraint-error-description">
        Required documents are missing
    </DialogDescription>
</Dialog>
```

---

## 8. Testing

### 8.1 Component Tests

```typescript
// __tests__/GenerateDocumentButton.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GenerateDocumentButton } from "@/components/documents/GenerateDocumentButton";
import { checkConstraints } from "@/lib/api/constraints";

jest.mock("@/lib/api/constraints");

describe("GenerateDocumentButton", () => {
    it("shows error modal when required prerequisites missing", async () => {
        (checkConstraints as jest.Mock).mockResolvedValue({
            can_generate: false,
            violations: [
                {
                    type: "REQUIRED",
                    missing_document: "scope-statement",
                    display_name: "Scope Statement",
                    message: "Required prerequisite missing",
                },
            ],
            warnings: [],
        });

        render(
            <GenerateDocumentButton
                documentType="hld-arch"
                displayName="HLD Architecture"
                projectId="project-123"
                userId="user-456"
            />
        );

        const button = screen.getByText(/Generate HLD Architecture/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Cannot Generate/i)).toBeInTheDocument();
            expect(screen.getByText(/Scope Statement/i)).toBeInTheDocument();
        });
    });

    it("shows warning modal when recommended prerequisites missing", async () => {
        (checkConstraints as jest.Mock).mockResolvedValue({
            can_generate: true,
            violations: [],
            warnings: [
                {
                    type: "RECOMMENDED",
                    missing_document: "feasibility-study",
                    display_name: "Feasibility Study",
                    message: "Recommended prerequisite missing",
                },
            ],
        });

        render(
            <GenerateDocumentButton
                documentType="hld-arch"
                displayName="HLD Architecture"
                projectId="project-123"
                userId="user-456"
            />
        );

        const button = screen.getByText(/Generate HLD Architecture/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Limited Context/i)).toBeInTheDocument();
            expect(screen.getByText(/Continue Anyway/i)).toBeInTheDocument();
        });
    });
});
```

---

## 9. Troubleshooting

| Issue                | Cause                         | Solution                                    |
| -------------------- | ----------------------------- | ------------------------------------------- |
| Modals don't show    | Backend URL incorrect         | Check `NEXT_PUBLIC_API_URL` in `.env.local` |
| Always shows error   | CORS issue                    | Configure CORS in Backend                   |
| No constraint check  | API call failing silently     | Check browser console for errors            |
| Wrong error messages | Using old API response format | Update types to match Backend schema        |

---

## 10. Future Enhancements

### 10.1 Dependency Graph Visualization

```typescript
// Future component: Show interactive dependency graph
<DependencyGraph
    documentType="hld-arch"
    highlightMissing={true}
    onNodeClick={(docType) => navigate(`/generate/${docType}`)}
/>
```

### 10.2 Batch Generation

```typescript
// Generate multiple prerequisites at once
<Button
    onClick={() =>
        generatePrerequisiteChain(["scope-statement", "business-case"])
    }
>
    Generate All Prerequisites
</Button>
```

---

**Document End**
