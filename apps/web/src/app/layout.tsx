import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-raleway",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "betterbudget",
  description: "Simple budgeting for needs, wants, and investing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} ${montserrat.variable}`}>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        {children}
        <Footer />
      </body>
    </html>
  );
}
