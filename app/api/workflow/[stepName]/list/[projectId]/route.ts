import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/workflow/:stepName/list/:projectId
 * Get list of documents for a specific step (planning/analysis/design) and project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stepName: string; projectId: string }> }
) {
  try {
    const { stepName, projectId } = await params;

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

    // Get authentication token from cookies
    // Note: auth token cookie is named "access_token" in /api/auth/token.
    // Keep fallback to "token" for backward compatibility.
    const cookieStore = await cookies();
    const token =
      cookieStore.get("access_token")?.value ?? cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Call backend API to get documents
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8010";
    const response = await fetch(`${backendUrl}/api/v1/${stepName}/list/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          status: "error",
          message: errorData.message || `Failed to fetch ${stepName} documents: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: "success",
      documents: data.documents || [],
    });
  } catch (error) {
    console.error(`Error fetching documents:`, error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
