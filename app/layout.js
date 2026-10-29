import localFont from "next/font/local";
import { person } from "@/lib/site";
import Shell from "@/components/Shell";
import "./globals.css";

// Fonts are stored in the project (app/fonts), so the site never waits for, or fails on, a download from Google.
// Libre Baskerville (a classic book serif; regular weight, semibold for the header name) for the name, titles, tagline and paragraphs,
// and Inter (a clean sans) for the small tracked-out capital labels: buttons and tags.
const display = localFont({
  src: [
    { path: "./fonts/libre-baskerville-latin-wght-normal.woff2", style: "normal", weight: "400 700" },
    { path: "./fonts/libre-baskerville-latin-wght-italic.woff2", style: "italic", weight: "400 700" },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: [{ path: "./fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-body",
  display: "swap",
});
// Handwriting face for the JHV mark on the loading page (My Soul, SIL Open Font License). It is typed text, not an image.
const script = localFont({ src: "./fonts/my-soul.woff2", weight: "400", variable: "--font-signature", display: "block" });

export const metadata = {
  title: { default: person.name, template: `%s — ${person.name}` },
  description: person.tagline,
};
export const viewport = { width: "device-width", initialScale: 1 };

// Critical styles, written straight into <head> so the loading page background is on screen on the home page
// from the very first frame of a refresh, before the main stylesheet or any script has arrived. Keep the colors in sync with `.pinstripe-deep` in app/globals.css.
const stripes = (gap) => `repeating-linear-gradient(90deg,transparent 0,transparent ${gap - 1}px,rgba(255,255,255,.09) ${gap - 1}px,rgba(255,255,255,.09) ${gap}px),radial-gradient(ellipse 60% 50% at 50% 45%,rgba(30,56,104,.45),transparent 75%)`;
const criticalCss = `html[data-home],[data-loader]{background-color:#050A14;background-image:${stripes(56)}}
@media (max-width:640px){html[data-home],[data-loader]{background-image:${stripes(36)}}}
[data-loader]{position:fixed;inset:0;z-index:50}
[data-loader]>*{visibility:hidden}
html[data-failsafe] [data-loader]{display:none!important}`;
// Runs before the first paint. Only the home page shows the loading page, so only the home page gets the navy start.
// FAILSAFE: the loading page waits for your click, so it can stay as long as you like. But if the site's scripts have not
// started after 10 seconds (so a click could never work), the loading page is removed and the home page is released.
const earlyScript = `if(location.pathname==="/"){var d=document.documentElement;d.setAttribute("data-home","");var m=document.createElement("meta");m.name="theme-color";m.content="#050A14";document.head.appendChild(m);setTimeout(function(){if(!d.hasAttribute("data-hydrated")){d.setAttribute("data-failsafe","");d.removeAttribute("data-home");m.content="#ECEEF1"}},10000)}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${script.variable} overflow-hidden bg-shade font-body text-ink antialiased`}>
        <noscript>
          <style>{`[data-loader]{display:none!important}[data-wait] .reveal,[data-wait] .enter,[data-wait] .portrait-in,[data-wait] .wi,[data-wait] .rise p,[data-wait] .rise ul,[data-wait] .label-in{animation:none!important}`}</style>
        </noscript>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
