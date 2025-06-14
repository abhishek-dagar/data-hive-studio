import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/navbar/sidebar";
import BottomBar from "@/components/navbar/bottom-bar";
import MenuNavbar from "@/components/navbar/menu-bar";
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
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
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <Toaster />
          <div className="h-screen w-screen bg-background">
            <MenuNavbar />
            <div className="h-[calc(100vh-var(--bottom-nav-height)-var(--menu-navbar-height))] w-full">
              <div className="flex h-full w-full">
                <Sidebar />
                {children}
              </div>
            </div>
            <BottomBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
