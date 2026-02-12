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

  if (!enrollment.user.profile?.name) {
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

  const medalPath = path.join(process.cwd(), "public/icons/medal.png");
  const medalBase64 = fs.readFileSync(medalPath).toString("base64");
  const medalIconBase64 = `data:image/png;base64,${medalBase64}`;

  const styles = StyleSheet.create({
    page: {
      width: "100%",
      height: "100%",
      padding: 40,
      backgroundColor: "#ffffff",
    },

    outerBorder: {
      flex: 1,
      border: "4 solid #c7d2fe",
      padding: 15,
    },

    innerBorder: {
      flex: 1,
      paddingVertical: 40,
      paddingHorizontal: 60,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fafafa",
    },

    topSection: {
      alignItems: "center",
    },

    centerSection: {
      alignItems: "center",
      marginVertical: 20,
    },

    bottomSection: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
    },

    title: {
      fontSize: 50,
      fontFamily: "Times-Bold",
      letterSpacing: 4,
      marginBottom: 12,
      textTransform: "uppercase",
      color: "#0f172a",
    },

    subtitle: {
      fontSize: 16,
      letterSpacing: 6,
      color: "#64748b",
      marginBottom: 40,
      textTransform: "uppercase",
    },

    italicText: {
      fontSize: 16,
      fontStyle: "italic",
      color: "#64748b",
    },

    name: {
      fontSize: 44,
      fontFamily: "Times-Bold",
      color: "#2563eb",
      marginTop: 22,
      marginBottom: 14,
      letterSpacing: 1,
    },

    underline: {
      width: 420,
      height: 1.5,
      backgroundColor: "#cbd5e1",
      marginBottom: 35,
    },

    course: {
      fontSize: 28,
      fontFamily: "Times-Bold",
      marginTop: 18,
      color: "#0f172a",
    },

    dateBlock: {
      alignItems: "center",
    },

    dateText: {
      fontSize: 16,
      fontFamily: "Times-Bold",
    },

    dateLabel: {
      fontSize: 10,
      letterSpacing: 2,
      color: "#94a3b8",
      marginTop: 4,
      textTransform: "uppercase",
    },

    medalBlock: {
      alignItems: "center",
    },

    medalCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      border: "2 solid #bfdbfe",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
    },

    certId: {
      fontSize: 9,
      marginTop: 6,
      color: "#94a3b8",
      fontFamily: "Courier",
    },

    logo: {
      height: 35,
    },
  });

  const issuedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const pdf = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page} wrap={false}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <View style={styles.topSection}>
              <Text style={styles.title}>Certificate</Text>
              <Text style={styles.subtitle}>Of Completion</Text>
            </View>

            <View style={styles.centerSection}>
              <Text style={styles.italicText}>This certifies that</Text>

              <Text style={styles.name}>{enrollment.user.profile.name}</Text>

              <View style={styles.underline} />

              <Text style={styles.italicText}>
                has successfully completed the course
              </Text>

              <Text style={styles.course}>{enrollment.course.title}</Text>
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateText}>{issuedDate}</Text>
                <Text style={styles.dateLabel}>Date Issued</Text>
              </View>

              <View style={styles.medalBlock}>
                <View style={styles.medalCircle}>
                  <Image
                    src={medalIconBase64}
                    style={{ width: 28, height: 28 }}
                  />
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
