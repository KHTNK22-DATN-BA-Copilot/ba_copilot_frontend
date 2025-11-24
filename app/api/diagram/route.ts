import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value;
    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const res = await fetch(
        `${process.env.BACKEND_DOMAIN}/api/v1/diagram/generate`,
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

export async function PATCH(req: NextRequest) {
    const access_token = (await cookies()).get("access_token")?.value;
    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const project_id = formData.get("project_id") as string;
    const diagram_id = formData.get("diagram_id") as string;
    const description = formData.get("description") as string;

    const backendFormData = new FormData();
    backendFormData.append("description", description);

    const files = formData.getAll("files");
    files.forEach(file => {
        backendFormData.append("files", file);
    })

    const res = await fetch(
        `${process.env.BACKEND_DOMAIN}/api/v1/diagram/regenerate/${project_id}/${diagram_id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: backendFormData,
        }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status }
    )
}
