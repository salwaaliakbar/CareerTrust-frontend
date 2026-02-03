import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/src/store/provider";
import { NotificationProvider } from "@/components/NotificationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerTrust",
  description: "CareerTrust: Smart Employment & Review Platform (SERP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReduxProvider>
        <NotificationProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </NotificationProvider>
      </ReduxProvider>
    </ClerkProvider>
  );
}
