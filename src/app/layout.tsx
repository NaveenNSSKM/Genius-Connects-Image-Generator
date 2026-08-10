import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "GeniusConnects Image Generator",
  description: "Extract person cutouts from photos and generate joining/announcement cards.",
  icons: {
    icon: "https://geniusconnects.com/assets/images/logo.png",
    shortcut: "https://geniusconnects.com/assets/images/logo.png",
    apple: "https://geniusconnects.com/assets/images/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexendDeca.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="https://geniusconnects.com/assets/images/logo.png" />
      </head>
      <body className={`${lexendDeca.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
