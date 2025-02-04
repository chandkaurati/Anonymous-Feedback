import Authprovider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Authprovider>
        <body>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </Authprovider>
    </html>
  );
}
