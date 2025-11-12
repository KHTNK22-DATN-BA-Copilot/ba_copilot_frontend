import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const access_token = (await cookies()).get('access_token')?.value
    const formData = await request.formData();
    console.log("formData", formData);

    const WireframeGenereteFetch = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/wireframe/generate`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
        body: formData
    })

    const data = await WireframeGenereteFetch.json()
    console.log("WireframeGenereteFetch", data);
    const wireframe_id = data.wireframe_id;

    return NextResponse.json(wireframe_id);
}