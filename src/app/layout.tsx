import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Swim for Life — Free Adaptive Swim Lessons",
    template: "%s | Swim for Life",
  },
  description:
    "Swim for Life is a 501(c)(3) non-profit providing free adaptive swim lessons to children of all abilities in North Palm Beach, FL.",
  openGraph: {
    title: "Swim for Life — Free Adaptive Swim Lessons",
    description:
      "An inclusive aquatic program for children of all abilities, specializing in adaptive lessons for those with intellectual and developmental disabilities.",
    url: "https://swimsforlife.com",
    siteName: "Swim for Life",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
