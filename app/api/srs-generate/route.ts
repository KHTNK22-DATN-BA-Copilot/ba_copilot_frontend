import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const access_token = (await cookies()).get('access_token')?.value
    const formData = await request.formData();

    const SrsGenerateFetch = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/srs/generate`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
        body: formData
    })

    const data = await SrsGenerateFetch.json()
    const document_id = data.document_id;
    

    return NextResponse.json(document_id);
}