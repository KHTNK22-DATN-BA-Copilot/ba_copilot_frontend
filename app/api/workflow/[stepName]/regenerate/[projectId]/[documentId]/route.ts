import { NextRequest, NextResponse } from "next/server";
import { regenerateWorkflowDocument } from "@/actions/workflow.action";

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

    const result = await regenerateWorkflowDocument(stepName, projectId, documentId);

    if (result.success) {
      return NextResponse.json(
        {
          status: "success",
          result: result.data,
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
