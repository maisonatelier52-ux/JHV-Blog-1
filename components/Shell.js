"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { person, stops } from "@/lib/site";
import { TransitionContext } from "@/lib/transition";
import TransitionLink from "./TransitionLink";
import Arrow from "./Arrow";
import LoaderSignature from "./LoaderSignature";

const SHOW_MS = 1400; // loading page: how long its content stays on screen (the JHV mark is written by ~1.1s, then it rests briefly). Standard: 1.2 - 1.6s.
const LIFT_MS = 700; // loading page: it lifts from the bottom to the top and shows the home page

// Header, portrait, controls, page transition and the loader. The page text itself lives in the routes.
export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // The loading page only exists when the site is opened on the home page. Other pages (and refreshes on them) start straight away.
  const [loading] = useState(pathname === "/");
  const [ready, setReady] = useState(pathname !== "/");
  const [gone, setGone] = useState(pathname !== "/");
  const touchX = useRef(0);

  const found = stops.findIndex((s) => s.href === pathname);
  const step = Math.max(0, found);
  const last = stops.length - 1;
  const slide = stops[step];
  const nextStop = stops[step === last ? 0 : step + 1];

  // Load every page in the background once, so a click never waits for the network (this removes the lag).
  useEffect(() => { stops.forEach((s) => router.prefetch(s.href)); }, [router]);

  // PAGE TRANSITION (clean cross-dissolve): the old page dissolves into the new one in 0.4s. There is no overlay, panel or shape,
  // and no waiting: the page changes the moment you click. The new headline then writes in word by word (see components/Words.js).
  // It uses the browser's View Transitions API; browsers without it (and reduced motion) switch pages instantly, the text effect still plays.
  const arrived = useRef(null); // resolves when the new route is on screen
  const busy = useRef(false);
  useLayoutEffect(() => { arrived.current?.(); arrived.current = null; }, [pathname]);

  const go = useCallback((href) => {
    if (href === pathname || busy.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) { router.push(href); return; }
    busy.current = true;
    const t = document.startViewTransition(() => new Promise((resolve) => {
      arrived.current = resolve;
      router.push(href);
      setTimeout(resolve, 1500); // safety: never leave the page frozen
    }));
    t.finished.finally(() => { busy.current = false; });
  }, [pathname, router]);

  // Loading page: held until the JHV mark is written, then it lifts and the home page appears.
  useEffect(() => {
    if (!loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setReady(true); setGone(true); return; }
    // Fixed time counted from now (never from the start of the page load), so the loading content is always on screen
    // for the same time, even when the site loads fast or slow.
    const wait = SHOW_MS;
    const a = setTimeout(() => setReady(true), wait);
    const b = setTimeout(() => setGone(true), wait + LIFT_MS + 100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [loading]);

  // The navy start-up background (see app/layout.js) is only needed until the loading page is gone.
  useEffect(() => {
    if (!gone) return;
    document.documentElement.removeAttribute("data-home");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ECEEF1");
  }, [gone]);

  useEffect(() => {
    const k = (e) => {
      if (!ready) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (["ArrowRight", "ArrowDown"].includes(e.key) && step < last) go(stops[step + 1].href);
      if (["ArrowLeft", "ArrowUp"].includes(e.key) && step > 0) go(stops[step - 1].href);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, step, last, ready]);

  return (
    <TransitionContext.Provider value={go}>
      <div
        className="relative h-dvh overflow-hidden bg-shade"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const d = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(d) < 60) return;
          if (d < 0 && step < last) go(stops[step + 1].href);
          if (d > 0 && step > 0) go(stops[step - 1].href);
        }}
      >
        {/* Drawn behind the loading page from the start (nothing has to load later); its entrance animations wait until the loading page fades. */}
        <div data-wait={ready ? undefined : ""} inert={!ready} className="contents">
          {/* Portrait: edge to edge on phones, big on the right and bottom on desktop. The circle sits under it. */}
          <div className="portrait-in absolute right-0 top-0 z-10 h-[78dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(100dvh,64vw)]">
            <div className="absolute -right-[10%] top-[4%] aspect-square h-[80%] rounded-full bg-shade-deep" />
            <img src={person.portrait} alt={`Portrait of ${person.name}`} className="absolute inset-0 h-full w-full object-cover object-right-bottom" />
          </div>
          {/* Phone only: the photo fades into the loading-page navy (solid color, no lines) so the white text can sit over it */}
          <div className="fade-navy bg-navy-950 pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[56dvh] lg:hidden" />

          {/* Header: on phones only the crest in a round badge (so the face stays clear); on desktop the capsule with crest and name */}
          <div className="enter fixed left-3 top-3 z-40 sm:left-6 sm:top-5">
            <TransitionLink href="/" aria-label="Home" className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white shadow-sm lg:h-auto lg:w-auto lg:justify-start lg:gap-3 lg:py-2 lg:pl-3 lg:pr-6">
              <img src={person.logo} alt="" className="h-12 w-auto lg:h-11" />
              <span className="hidden text-xl italic tracking-tight lg:inline lg:text-2xl">{person.name}</span>
            </TransitionLink>
          </div>

          {/* The page's own text */}
          <main>{children}</main>

          {/* Controls */}
          <div className="enter absolute inset-x-5 bottom-5 z-30 flex flex-col items-start gap-4 lg:inset-x-auto lg:bottom-10 lg:left-16">
            <div className="flex w-full items-center gap-3 lg:w-auto">
              {step > 0 && (
                <TransitionLink href={stops[step - 1].href} aria-label="Previous" className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 transition-colors duration-200 hover:bg-accent hover:text-white">
                  <span className="rotate-180"><Arrow /></span>
                </TransitionLink>
              )}
              <TransitionLink id="next" href={nextStop.href} className="group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-full bg-accent py-1.5 pl-[3.25rem] pr-1.5 text-lg lg:flex-none lg:justify-start lg:pl-6 font-medium text-white ring-4 ring-white/90">
                <span key={`s${step}`} className="label-in flex-1 text-center lg:hidden">{slide.short}</span>
                <span key={`n${step}`} className="label-in hidden lg:inline">{slide.next}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-accent"><Arrow /></span>
              </TransitionLink>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm lg:flex">
              {stops.map((s, i) => (
                <TransitionLink key={s.href} href={s.href} aria-label={`Go to ${s.nav}`} aria-current={i === step ? "page" : undefined} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-accent" : "w-2 bg-accent/20 hover:bg-accent/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Loading page: home page only. Deep navy with white pinstripes, the crest and the JHV mark. When it is done it lifts
            from the bottom to the top and the home page is underneath. */}
        {loading && !gone && (
          <div data-loader className={`pinstripe-deep pointer-events-none fixed inset-0 z-50 grid place-items-center will-change-transform motion-reduce:transition-none ${ready ? "-translate-y-full transition-transform duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]" : "translate-y-0"}`}>
            <div className="flex flex-col items-center">
              <img src={person.logo} alt="" className="h-[clamp(150px,27dvh,230px)] w-auto" fetchPriority="high" />
              <div className="mt-2"><LoaderSignature /></div>
            </div>
          </div>
        )}
      </div>
    </TransitionContext.Provider>
  );
}