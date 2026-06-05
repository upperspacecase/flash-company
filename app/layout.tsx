import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Ever wonder what you and 2 friends could build? A guided 48-hour ideation sprint that turns your combined skills, networks, and insights into an idea worth sharing.";

export const metadata: Metadata = {
  metadataBase: new URL("https://flashcompany.org"),
  title: "Flash Company",
  description,
  openGraph: {
    title: "Flash Company",
    description,
    url: "https://flashcompany.org",
    siteName: "Flash Company",
    type: "website",
    images: [{ url: "/og.png", width: 1588, height: 806 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flash Company",
    description,
    images: ["/og.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
