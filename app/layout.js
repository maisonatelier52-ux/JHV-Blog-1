// blog first for JHV
import { Playfair_Display, Lora } from "next/font/google";
import { person } from "@/lib/site";
import Shell from "@/components/Shell";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const body = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-body" });

export const metadata = {
  title: { default: person.name, template: `%s — ${person.name}` },
  description: person.tagline,
};
export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} overflow-hidden bg-white font-display text-ink antialiased`}><noscript>
          <style>{`[data-loader]{display:none!important}[data-wait]{display:contents!important}`}</style>
        </noscript>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
