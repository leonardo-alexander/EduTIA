import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await requireUser();

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: params.courseId },
    });

    if (!enrollment) {
      return NextResponse.json({ message: "Not enrolled" }, { status: 404 });
    }

    return NextResponse.json(enrollment?.progressPercent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch enrollment progress" },
      { status: 500 }
    );
  }
}
