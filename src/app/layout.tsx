import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Hedvig_Letters_Serif, Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Kero - AI Framer Landing Page",
  description: "AI research and analysis for modern teams",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const hedvig = Hedvig_Letters_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hedvig",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(inter.variable, hedvig.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
