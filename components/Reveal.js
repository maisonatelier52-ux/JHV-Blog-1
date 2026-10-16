"use client";
import { usePathname } from "next/navigation";

// Page transition for the text: when the route changes the wrapper is replaced (key), so each block of text
// plays the quick "rise" animation again (see .rise in app/globals.css).
export default function Reveal({ children }) {
  const pathname = usePathname();
  return <div key={pathname} className="rise">{children}</div>;
}
