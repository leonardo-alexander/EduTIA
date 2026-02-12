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

export async function generatePdfCV(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      skills: true,
      educations: true,
      experiences: true,
    },
  });

  if (!user || !user.profile) {
    throw new Error("Profile not found");
  }

  const filename = `cv-${crypto.randomUUID()}.pdf`;
  const dir = path.join(process.cwd(), "public/uploads/cvs");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, filename);

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
      lineHeight: 1.6,
    },

    header: {
      marginBottom: 32,
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    headerLeft: {
      maxWidth: "70%",
    },

    headerRight: {
      alignItems: "flex-end",
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      objectFit: "cover",
      marginBottom: 12,
    },

    name: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 10,
    },

    email: {
      fontSize: 12,
      marginBottom: 12,
    },

    meta: {
      fontSize: 10,
      color: "#6b7280",
      marginBottom: 3,
    },

    logo: {
      width: 90,
      height: "auto",
    },

    section: {
      marginTop: 24,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      borderBottom: "1 solid #e5e7eb",
      paddingBottom: 4,
    },

    item: {
      marginBottom: 14,
    },

    itemTitle: {
      fontWeight: "bold",
      fontSize: 11,
    },

    textMuted: {
      fontSize: 10,
      color: "#6b7280",
    },
  });

  const logoPath = path.join(process.cwd(), "public/logo/blue.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  let avatarSrc: string | null = null;

  if (
    user.profile.pictureUrl &&
    /\.(png|jpg|jpeg)$/i.test(user.profile.pictureUrl)
  ) {
    const avatarPath = path.join(
      process.cwd(),
      "public",
      user.profile.pictureUrl,
    );

    if (fs.existsSync(avatarPath)) {
      const avatarBase64 = fs.readFileSync(avatarPath).toString("base64");
      const ext = path.extname(avatarPath).slice(1);
      avatarSrc = `data:image/${ext};base64,${avatarBase64}`;
    }
  }

  const pdf = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {avatarSrc && <Image src={avatarSrc} style={styles.avatar} />}

              <Text style={styles.name}>{user.profile.name}</Text>
              <Text style={styles.email}>{user.email}</Text>

              {user.profile.gender && (
                <Text style={styles.meta}>Gender: {user.profile.gender}</Text>
              )}

              {user.profile.dob && (
                <Text style={styles.meta}>
                  Date of Birth:{" "}
                  {new Date(user.profile.dob).toLocaleDateString()}
                </Text>
              )}
            </View>

            <View style={styles.headerRight}>
              <Image src={logoSrc} style={styles.logo} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text>{user.profile.bio || "-"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {user.skills.length ? (
            user.skills.map((skill) => (
              <Text key={skill.id}>• {skill.name}</Text>
            ))
          ) : (
            <Text>-</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {user.educations.length ? (
            user.educations.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.institution}</Text>

                {(edu.degree || edu.fieldOfStudy) && (
                  <Text>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" · ")}
                  </Text>
                )}

                <Text style={styles.textMuted}>
                  {new Date(edu.startDate).getFullYear()} –{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : "Present"}
                </Text>
              </View>
            ))
          ) : (
            <Text>-</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {user.experiences.length ? (
            user.experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                <Text>{exp.companyName}</Text>
                <Text style={styles.textMuted}>
                  {new Date(exp.startDate).toLocaleDateString()} –{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"}
                </Text>
              </View>
            ))
          ) : (
            <Text>-</Text>
          )}
        </View>

        <Text
          style={{
            position: "absolute",
            bottom: 30,
            left: 40,
            right: 40,
            fontSize: 9,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          This CV was generated by EduTIA
        </Text>
      </Page>
    </Document>
  );

  const stream = await renderToStream(pdf);
  const writeStream = fs.createWriteStream(filePath);

  await new Promise<void>((resolve) => {
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
  });

  const url = `/uploads/cvs/${filename}`;

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
