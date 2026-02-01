import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function generatePdfCertificate(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { include: { profile: true } },
      course: true,
    },
  });

  if (!enrollment || enrollment.status !== "COMPLETED") {
    throw new Error("Invalid enrollment");
  }

  const code = `CERT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const filename = `certificate-${code}.pdf`;

  const dir = path.join(process.cwd(), "public/uploads/certificates");
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, filename);

  const styles = StyleSheet.create({
    page: {
      padding: 50,
      textAlign: "center",
      fontSize: 14,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      letterSpacing: 2,
      marginBottom: 40,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      marginVertical: 20,
    },
    course: {
      fontSize: 20,
      marginVertical: 10,
    },
    footer: {
      marginTop: 50,
      fontSize: 12,
    },
    box: {
      border: "4 solid #1e40af",
      padding: 30,
    },
  });

  const pdf = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.box}>
          <Text style={styles.title}>Certificate</Text>
          <Text style={styles.subtitle}>OF COMPLETION</Text>

          <Text>This certifies that</Text>

          <Text style={styles.name}>
            {enrollment.user.profile?.name || enrollment.user.email}
          </Text>

          <Text>has successfully completed the course</Text>

          <Text style={styles.course}>{enrollment.course.title}</Text>

          <Text style={styles.footer}>
            Issued on {new Date().toDateString()}
          </Text>

          <Text style={styles.footer}>Certificate ID: {code}</Text>
        </View>
      </Page>
    </Document>
  );

  const stream = await renderToStream(pdf);
  const writeStream = fs.createWriteStream(filePath);

  await new Promise<void>((resolve) => {
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
  });

  return prisma.certificate.create({
    data: {
      certificateCode: code,
      fileUrl: `/uploads/certificates/${filename}`,
      enrollment: {
        connect: { id: enrollmentId },
      },
    },
  });
}
