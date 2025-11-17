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

export async function PATCH(request: NextRequest) {
    const access_token = (await cookies()).get('access_token')?.value;

    if(!access_token) {
        return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401});
    }

    const formData = await request.formData();
    const project_id = formData.get('project_id') as string;
    const document_id = formData.get('document_id') as string;
    const description = formData.get('description') as string;

    // Forward the FormData to backend
    const backendFormData = new FormData();
    backendFormData.append('description', description);
    
    // If there are files, forward them too
    const files = formData.getAll('files');
    files.forEach(file => {
        backendFormData.append('files', file);
    });

    const res = await fetch(`${process.env.BACKEND_DOMAIN}/api/v1/srs/regenerate/${project_id}/${document_id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
        body: backendFormData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}