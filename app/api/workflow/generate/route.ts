import { NextRequest, NextResponse } from "next/server";
import { generateWorkflowDocument } from "@/actions/workflow.action";

/**
 * POST /api/workflow/generate
 * Generate workflow documents based on user input
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, selectedFiles, selectedDocIds, projectId } = body;

    const result = await generateWorkflowDocument(
      prompt,
      selectedFiles,
      selectedDocIds,
      projectId,
    );

    if (result.success) {
      return NextResponse.json(
        {
          status: "success",
          jobId: result.data?.jobId,
          message: result.message,
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
    console.error("Error in workflow generation:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
