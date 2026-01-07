import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AuthPayload } from "./types";

export async function getUserFromCookie(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch {
    return null;
  }
}
