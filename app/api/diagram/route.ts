import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value;
    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    console.log("Received form data:", formData);
    const res = await fetch(
        `${process.env.BACKEND_DOMAIN}/api/v1/diagram/usecase/generate`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: formData,
        }
    );
    const data = await res.json();
    const diagram_id = data.diagram_id;
    return NextResponse.json(diagram_id);
}
