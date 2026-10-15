"use client";
import { usePathname } from "next/navigation";

// The page text simply fades in when a page opens (no movement, no word by word). It plays again on every page.
export default function Reveal({ children }) {
  const pathname = usePathname();
  return <div key={pathname} className="fade-in">{children}</div>;
}
