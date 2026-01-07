import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "API is working" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}
