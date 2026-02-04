import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream,
  Image,
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

  if (!enrollment.user.profile || !enrollment.user.profile.name) {
    throw new Error("Incomplete profile");
  }

  const certificateId = `CERT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const filename = `certificate-${certificateId}.pdf`;

  const dir = path.join(process.cwd(), "public/uploads/certificates");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, filename);

  const logoPath = path.join(process.cwd(), "public/logo/blue.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const styles = StyleSheet.create({
    page: {
      padding: 28,
      backgroundColor: "#ffffff",
    },

    outerBorder: {
      border: "3 solid #c7d2fe",
      padding: 8,
    },

    innerBorder: {
      border: "2 solid #bfdbfe",
      paddingVertical: 60,
      paddingHorizontal: 48,
      alignItems: "center",
      textAlign: "center",
      backgroundColor: "#fafafa",
    },

    title: {
      fontSize: 40,
      fontFamily: "Times-Bold",
      letterSpacing: 2,
      marginBottom: 6,
      textTransform: "uppercase",
      color: "#0f172a",
    },

    subtitle: {
      fontSize: 14,
      letterSpacing: 4,
      color: "#64748b",
      marginBottom: 50,
      textTransform: "uppercase",
    },

    italicText: {
      fontSize: 14,
      fontStyle: "italic",
      color: "#64748b",
    },

    name: {
      fontSize: 32,
      fontFamily: "Times-Bold",
      color: "#2563eb",
      marginTop: 16,
      marginBottom: 10,
    },

    underline: {
      width: 260,
      height: 1,
      backgroundColor: "#e5e7eb",
      marginBottom: 30,
    },

    course: {
      fontSize: 24,
      fontFamily: "Times-Bold",
      marginTop: 10,
      color: "#1e293b",
    },

    footerRow: {
      marginTop: 70,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    dateBlock: {
      textAlign: "center",
    },

    dateText: {
      fontSize: 14,
      fontFamily: "Times-Bold",
    },

    dateLabel: {
      fontSize: 9,
      letterSpacing: 1,
      color: "#94a3b8",
      marginTop: 4,
      textTransform: "uppercase",
    },

    medalBlock: {
      alignItems: "center",
    },

    medalCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      border: "3 solid #bfdbfe",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
    },

    medalIcon: {
      fontSize: 26,
    },

    certId: {
      fontSize: 9,
      marginTop: 8,
      color: "#94a3b8",
      fontFamily: "Courier",
    },

    logo: {
      width: "auto",
      height: 25,
    },
  });

  const issuedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const pdf = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <Text style={styles.title}>Certificate</Text>
            <Text style={styles.subtitle}>Of Completion</Text>

            <Text style={styles.italicText}>This certifies that</Text>

            <Text style={styles.name}>
              {enrollment.user.profile?.name || enrollment.user.email}
            </Text>

            <View style={styles.underline} />

            <Text style={styles.italicText}>
              has successfully completed the course
            </Text>

            <Text style={styles.course}>{enrollment.course.title}</Text>

            {/* Footer */}
            <View style={styles.footerRow}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateText}>{issuedDate}</Text>
                <Text style={styles.dateLabel}>Date Issued</Text>
              </View>

              <View style={styles.medalBlock}>
                <View style={styles.medalCircle}>
                  <Text style={styles.medalIcon}>🎓</Text>
                </View>
                <Text style={styles.certId}>ID: {certificateId}</Text>
              </View>

              <Image src={logoSrc} style={styles.logo} />
            </View>
          </View>
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
      name: enrollment.user.profile.name,
      certificateCode: certificateId,
      fileUrl: `/uploads/certificates/${filename}`,
      enrollment: {
        connect: { id: enrollmentId },
      },
    },
  });
}
