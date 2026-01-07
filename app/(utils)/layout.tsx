import "@/app/globals.css";
import Navbar from "@/component/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>EduTIA</title>
      </head>
      <body className="h-full">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
