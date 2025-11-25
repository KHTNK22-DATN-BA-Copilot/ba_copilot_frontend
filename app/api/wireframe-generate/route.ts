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

export async function PATCH(request: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value;
    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const project_id = formData.get("project_id") as string;
    const wireframe_id = formData.get("wireframe_id") as string;
    const description = formData.get("description") as string;

    const backendFormData = new FormData();
    backendFormData.append("description", description);

    const files = formData.getAll("files");
    files.forEach(file => {
        backendFormData.append("files", file);
    })

    const res = await fetch(
        `${process.env.BACKEND_DOMAIN}/api/v1/wireframe/regenerate/${project_id}/${wireframe_id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: backendFormData,
        }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status })
}