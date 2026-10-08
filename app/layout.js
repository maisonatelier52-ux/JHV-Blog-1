import { Playfair_Display, Lora } from "next/font/google";
import { person } from "@/lib/site";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const body = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-body" });

export const metadata = { title: person.name, description: person.tagline };
export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} overflow-hidden bg-white font-display text-ink antialiased`}>{children}</body>
    </html>
  );
}
