import { NextRequest, NextResponse } from "next/server";
import { getWorkflowDocumentsByStep } from "@/actions/workflow.action";

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

    const result = await getWorkflowDocumentsByStep(stepName, projectId);

    if (result.success) {
      return NextResponse.json(
        {
          status: "success",
          documents: result.data?.documents || [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: result.message,
      },
      { status: result.statusCode || 500 }
    );
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
