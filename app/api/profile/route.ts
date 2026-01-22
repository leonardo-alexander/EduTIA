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
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireUser();

    const body = await req.json();
    const { name, dob, gender, pictureUrl, bio, companyName, companyWebsite } = body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        name,
        dob: dob ? new Date(dob) : null,
        gender,
        pictureUrl,
        bio,
        companyName,
        companyWebsite,
      },
      create: {
        userId: user.id,
        name,
        dob: dob ? new Date(dob) : null,
        gender,
        pictureUrl,
        bio,
        companyName,
        companyWebsite,
      },
    });

    return NextResponse.json({
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}