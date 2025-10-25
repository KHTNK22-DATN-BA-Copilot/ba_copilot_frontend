import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const access_token = (await cookies()).get('access_token')?.value;
    if (!access_token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const {project_id , document_id } = await request.json();
    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/srs/get/${project_id}/${document_id}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        }
    })
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}