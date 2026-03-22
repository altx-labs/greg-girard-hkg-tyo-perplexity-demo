import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greg Girard: HKG-TYO 1974–2023 | WKM Gallery Store",
  description:
    "Exhibition merchandise for 'Greg Girard: HKG-TYO 1974–2023' at WKM Gallery. Limited edition poster and photography books.",
  openGraph: {
    title: "Greg Girard: HKG-TYO 1974–2023 | WKM Gallery Store",
    description:
      "Exhibition merchandise — limited edition poster and photography books.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
