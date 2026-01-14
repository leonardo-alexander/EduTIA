import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const paths = await prisma.learningPath.findMany({
      orderBy: { title: "asc" },
    });

    return NextResponse.json(paths);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch learning paths" },
      { status: 500 }
    );
  }
}
