import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/workflow/analysis/generate
 * Generate analysis documents based on user input
 */
export async function POST(request: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value || null;
    try {
        const body = await request.json();
        const {
            prompt,
            selectedFiles,
            selectedDocIds,
            projectId,
            projectName,
            stepType,
        } = body;
        const formBody = new URLSearchParams();
        formBody.append("project_id", projectId.toString());
        formBody.append("project_name", projectName);
        formBody.append("doc_type", selectedDocIds[0]);
        formBody.append("description", prompt);

        // Validate request payload
        if (!selectedDocIds || selectedDocIds.length === 0) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "No documents selected for generation",
                },
                { status: 400 }
            );
        }

        // TODO: Implement actual generation logic
        // This is a placeholder for future backend integration

        // Example: Create a job and return job ID
        const jobId = `job_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const step = (() => {
            switch (stepType) {
                case 'planning': return 'planning';
                case 'analysis': return 'analysis';
                case 'design': return 'design';
                default: return 'general';
            }
        })();

        // TODO: Send request to backend service
        const response = await fetch(
            `${process.env.BACKEND_DOMAIN}/api/v1/${step}/generate`,
            {
                method: "POST",
                headers: { 
                  "Content-Type": "application/x-www-form-urlencoded" 
                  , Authorization: `Bearer ${access_token}`
                },
                body: formBody.toString(),
            }
        );

        const data = await response.json();
        console.log("Backend response:", data);

        // For now, return a mock success response
        return NextResponse.json({
            status: "success",
            jobId,
            message: stepType + " document generation started",
            responseData: data,
        });
    } catch (error) {
        console.error("Error in analysis generation:", error);
        return NextResponse.json(
            {
                status: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
}
