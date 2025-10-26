import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value;
    if(!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const {project_id, document_id} = await req.json();
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/srs/export/${project_id}/${document_id}`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        method: "GET"
    })

    const blob = await res.blob();
    const headers = new Headers(res.headers);

    return new NextResponse(blob, {headers});

}