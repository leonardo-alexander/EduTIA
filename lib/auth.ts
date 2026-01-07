import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { AuthPayload } from "./types";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    return await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdminUser() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}
