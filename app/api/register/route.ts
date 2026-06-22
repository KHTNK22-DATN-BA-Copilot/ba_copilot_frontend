import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ message: "Registration not supported via API route directly" }, { status: 405 });
}
