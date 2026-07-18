import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get("file");
    
    if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }
    
    // Validate filename to prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }
    
    const filePath = path.join(
        process.cwd(),
        "public/workflows/template",
        filename
    );
    
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return new NextResponse(content, {
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
            },
        });
    } catch (error) {
        console.error("Error reading template file:", error);
        return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
    }
}
