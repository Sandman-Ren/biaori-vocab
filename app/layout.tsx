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

export const metadata: Metadata = {
  title: "我查人标日",
  description: "一个简单的标准日本语（第二版）查词工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
        style={{
            height: "100vh",
            width: "100vw",
            maxHeight: "100vh",
            maxWidth: "100vw",
            overflowX: "auto",
            overflowY: "hidden",
        }}
      >
      <div
          id='main-content'
          className="flex-auto h-full w-full max-h-full max-w-full overflow-scroll flex flex-col"
      >
          {children}
      </div>
      </body>
    </html>
  );
}
