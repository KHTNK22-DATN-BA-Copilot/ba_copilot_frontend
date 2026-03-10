import { NextRequest, NextResponse } from "next/server";
import { getWorkflowJobStatus } from "@/actions/workflow.action";

/**
 * GET /api/workflow/status/:jobId
 * Check the status of a workflow generation job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    const result = await getWorkflowJobStatus(jobId);

    if (result.success) {
      return NextResponse.json(
        {
          status: "success",
          ...result.data,
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
    console.error("Error checking job status:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
