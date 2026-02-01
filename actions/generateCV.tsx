import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function generateCV(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      skills: true,
      experiences: true,
    },
  });

  if (!user) throw new Error("User not found");

  const uploadDir = path.join(process.cwd(), "public/uploads/cv");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `cv-${crypto.randomUUID()}.pdf`;
  const filePath = path.join(uploadDir, filename);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(20).text(user.profile?.name || "Curriculum Vitae");
  doc.moveDown();

  doc.fontSize(12).text(`Email: ${user.email}`);
  doc.text(`Bio: ${user.profile?.bio || "-"}`);
  doc.moveDown();

  doc.text("Skills:");
  user.skills.forEach((s) => doc.text(`• ${s.name}`));

  doc.end();

  await new Promise<void>((resolve) => {
    stream.on("finish", resolve);
  });

  const url = `/uploads/cv/${filename}`;

  await prisma.cV.create({
    data: {
      fileUrl: url,
      user: {
        connect: { id: userId },
      },
    },
  });

  return url;
}
