import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  sub: string;
  role: "ADMIN" | "EDUCATEE" | "COMPANY";
}
