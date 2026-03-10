import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
