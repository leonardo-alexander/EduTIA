import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <Header />
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
