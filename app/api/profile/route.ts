import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireUser();

    const body = await req.json();
    const { email, name, dob, gender, pictureUrl, bio } = body;

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          email,
        },
      }),
      prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          name,
          dob,
          gender,
          pictureUrl,
          bio,
        },
        create: {
          userId: user.id,
          name,
          dob,
          gender,
          pictureUrl,
          bio,
        },
      }),
    ]);

    return NextResponse.json({
      user: updatedUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
