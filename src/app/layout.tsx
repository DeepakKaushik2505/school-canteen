import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display } from "next/font/google";
import { Nav } from "@/components/Nav";
import { StudentSync } from "@/components/StudentSync";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "School Canteen",
  description: "Canteen ordering prototype",
  icons: {
    icon: "/assets/logo.jpg",
    shortcut: "/assets/logo.jpg",
    apple: "/assets/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#606c38",
          colorPrimaryForeground: "#fefae0",
          colorBackground: "#fefae0",
          colorInputBackground: "#fefae0",
          colorNeutral: "#283618",
          colorForeground: "#283618",
          colorMutedForeground: "#606c38",
        },
        elements: {
          userButtonAvatarBox: "ring-2 ring-olive-leaf/50 rounded-full overflow-hidden",
        },
      }}
    >
      <html lang="en" className={playfair.variable}>
        <body className="min-h-screen gradient-page">
          <StudentSync />
          <Nav />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
