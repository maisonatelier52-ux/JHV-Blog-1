"use client";
import Link from "next/link";
import { useContext } from "react";
import { TransitionContext } from "@/lib/transition";

// A normal next/link that plays the iris transition before navigating.
export default function TransitionLink({ href, onClick, ...props }) {
  const go = useContext(TransitionContext);
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href);
  };
  return <Link href={href} onClick={handle} {...props} />;
}
