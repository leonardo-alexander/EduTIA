import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { enrollmentId } = await req.json();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { include: { profile: true } },
      course: true,
    },
  });

  if (!enrollment || enrollment.status !== "COMPLETED") {
    return NextResponse.json({ error: "Invalid enrollment" }, { status: 400 });
  }

  const existing = await prisma.certificate.findUnique({
    where: { enrollmentId },
  });

  if (existing) {
    return NextResponse.json({ url: existing.fileUrl });
  }

  const dir = path.join(process.cwd(), "public/uploads/certificates");
  fs.mkdirSync(dir, { recursive: true });

  const code = `CERT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const filename = `certificate-${code}.pdf`;
  const filePath = path.join(dir, filename);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(28).text("Certificate of Completion", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(16).text("This certifies that", { align: "center" });
  doc.moveDown();

  doc
    .fontSize(22)
    .text(enrollment.user.profile?.name || enrollment.user.email, {
      align: "center",
    });

  doc.moveDown();
  doc.text("has successfully completed the course", { align: "center" });

  doc.moveDown();
  doc.text(enrollment.course.title, { align: "center" });

  doc.moveDown(2);
  doc.text(`Issued on: ${new Date().toDateString()}`, { align: "center" });
  doc.text(`Certificate ID: ${code}`, { align: "center" });

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });

  const fileUrl = `/uploads/certificates/${filename}`;

  await prisma.certificate.create({
    data: {
      certificateCode: code,
      fileUrl,
      enrollment: { connect: { id: enrollmentId } },
    },
  });

  return NextResponse.json({ url: fileUrl });
}
