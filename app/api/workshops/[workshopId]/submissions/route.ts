import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const user = await requireUser();

    const registered = await prisma.workshopRegistration.findUnique({
      where: {
        userId_workshopId: {
          userId: user.id,
          workshopId: params.workshopId,
        },
      },
    });

    if (!registered) {
      return NextResponse.json(
        { message: "You must register first" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { submissionUrl } = body;

    await prisma.workshopSubmission.create({
      data: {
        submissionUrl,
        userId: user.id,
        workshopId: params.workshopId,
      },
    });

    return NextResponse.json(
      { message: "Workshop is submitted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
