import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { projectOverview, requirements, diagrams, constrain } = await request.json();
    const res = await fetch(`${process.env.AI_DOMAIN}/srs/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
            "project_name": projectOverview.projectName,
            "overview": projectOverview.description,
            "features": requirements,
            "additional_requirements": constrain,
            "template_type": "standard",
            "include_diagrams": diagrams.length > 0 ? true : false,
            "diagram_types": diagrams.filter((d: { isCheck: boolean }) => d.isCheck).map((d: { value: string }) => d.value),
        })
    })

    const data = await res.json();
    console.log("SRS Generate Response: ", data);
    return NextResponse.json(data);
}