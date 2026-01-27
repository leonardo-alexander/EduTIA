"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function loginAction(_prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "Invalid credentials" };
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const incomplete =
      user.role === "EDUCATEE"
        ? !user.profile?.name || !user.profile?.dob
        : !user.profile?.name || !user.profile?.companyWebsite;

    return { success: true, role: user.role, status: incomplete };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return { success: true };
}

export async function signupAction(_prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
    const role = formData.get("role") as "EDUCATEE" | "COMPANY";

    if (!email || !password || !passwordConfirmation) {
      return { error: "All fields are required" };
    }

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {},
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}
