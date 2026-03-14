import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ access_token: accessToken }, { status: 200 });
  } catch (error) {
    console.error("Error getting auth token:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
