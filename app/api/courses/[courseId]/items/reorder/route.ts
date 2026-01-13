import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await requireAdminUser();

    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Items are required" },
        { status: 400 }
      );
    }

    const positions = items.map((i) => i.position).sort((a, b) => a - b);
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] !== i + 1) {
        return NextResponse.json(
          { message: "Positions must be continuous starting from 1" },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.courseItem.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json({ message: "Course reordered successfully" });
  } catch (error) {
    console.error("Reorder course items error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
