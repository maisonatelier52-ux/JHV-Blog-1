// blog first for JHV
import { Playfair_Display, Lora } from "next/font/google";
import localFont from "next/font/local";
import { person } from "@/lib/site";
import Shell from "@/components/Shell";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const body = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-body" });
// Handwriting face for the JHV mark on the loading page (My Soul, SIL Open Font License). It is typed text, not an image.
const script = localFont({ src: "./fonts/my-soul.woff2", weight: "400", variable: "--font-signature", display: "block" });

export const metadata = {
  title: { default: person.name, template: `%s — ${person.name}` },
  description: person.tagline,
};
export const viewport = { width: "device-width", initialScale: 1 };

// Critical styles, written straight into <head> so the loading page background is on screen on the home page
// from the very first frame of a refresh, before the main stylesheet or any script has arrived. Without this the browser
// shows plain white for a moment. Keep the colors in sync with `.pinstripe-deep` in app/globals.css.
const stripes = (gap) => `repeating-linear-gradient(90deg,transparent 0,transparent ${gap - 1}px,rgba(255,255,255,.09) ${gap - 1}px,rgba(255,255,255,.09) ${gap}px),radial-gradient(ellipse 60% 50% at 50% 45%,rgba(30,56,104,.45),transparent 75%)`;
const criticalCss = `html[data-home],[data-loader]{background-color:#050A14;background-image:${stripes(56)}}
@media (max-width:640px){html[data-home],[data-loader]{background-image:${stripes(36)}}}
[data-loader]{position:fixed;inset:0;z-index:50}
[data-loader]>*{visibility:hidden}`;
// Runs before the first paint. Only the home page shows the loading page, so only the home page gets the navy start
// (other pages, and refreshes on them, are not touched). The browser bar on phones starts navy too, then Shell.js sets it back to light.
const earlyScript = `if(location.pathname==="/"){document.documentElement.setAttribute("data-home","");var m=document.createElement("meta");m.name="theme-color";m.content="#050A14";document.head.appendChild(m)}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${script.variable} overflow-hidden bg-white font-display text-ink antialiased`}><noscript>
          <style>{`[data-loader]{display:none!important}[data-wait] .reveal,[data-wait] .enter,[data-wait] .portrait-in{animation:none!important}`}</style>
        </noscript>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
