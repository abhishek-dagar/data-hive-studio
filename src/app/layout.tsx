import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Data Hive Studio",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}