import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * PATCH /api/workflow/:stepName/regenerate/:projectId/:documentId
 * Regenerate a specific document for a workflow step
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stepName: string; projectId: string; documentId: string }> }
) {
  try {
    const { stepName, projectId, documentId } = await params;

    // Validate step name
    const validSteps = ["planning", "analysis", "design"];
    if (!validSteps.includes(stepName)) {
      return NextResponse.json(
        { status: "error", message: `Invalid step name. Must be one of: ${validSteps.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate project ID
    if (!projectId) {
      return NextResponse.json(
        { status: "error", message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate document ID
    if (!documentId) {
      return NextResponse.json(
        { status: "error", message: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get authentication token from cookies
    const cookieStore = await cookies();
    const token =
      cookieStore.get("access_token")?.value ?? cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Call backend API to regenerate document
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8010";
    const response = await fetch(
      `${backendUrl}/api/v1/${stepName}/regenerate/${projectId}/${documentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          status: "error",
          message: errorData.message || `Failed to regenerate document: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: "success",
      result: data,
    });
  } catch (error) {
    console.error(`Error regenerating document:`, error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
