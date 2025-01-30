import type { Metadata } from "next";
import { Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Nav from "./components/nav";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
          <title>{'Home'}</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
        
      <body
        className={`${lexendSans.variable} ${geistMono.variable} antialiased pb-2`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
