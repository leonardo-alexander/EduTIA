import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
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
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, name, dob, gender, pictureUrl, bio } = body;

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.userId },
        data: {
          email,
        },
      }),
      prisma.profile.upsert({
        where: { userId: user.userId },
        update: {
          name,
          dob,
          gender,
          pictureUrl,
          bio,
        },
        create: {
          userId: user.userId,
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
