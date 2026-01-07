import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Log in to EduTIA</title>
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
