import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const items = await prisma.courseItem.findMany({
      where: { courseId: params.courseId },
      orderBy: { position: "asc" },
      include: {
        module: true,
        workshop: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Get course items error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
