"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { person, stops } from "@/lib/site";
import { TransitionContext } from "@/lib/transition";
import TransitionLink from "./TransitionLink";
import Arrow from "./Arrow";
import LoaderSignature from "./LoaderSignature";

const LIFT_MS = 700; // loading page: how long it takes to lift away once you click

// Header, portrait, controls, and page transition. The page text itself lives in the routes.
export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // The loading page only exists when the site is opened on the home page. Other pages (and refreshes on them) start straight away.
  const [loading] = useState(pathname === "/");
  const [ready, setReady] = useState(pathname !== "/");
  const [gone, setGone] = useState(pathname !== "/");
  const touchX = useRef(0);
  const wrap = useRef(null);
  const open = useRef(() => {}); // opens the home page (lifts the loading page)

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

  // LOADING PAGE: it is a page of its own (navy pinstripes, crest, JHV mark) and it stays fixed until YOU open it:
  // click or tap anywhere on it, or press a key. It never opens by itself. Then it lifts and the home page is underneath.
  useEffect(() => {
    if (!loading) return;
    let done = false;
    const finish = () => { if (done) return; done = true; setReady(true); };
    open.current = finish;
    const key = (e) => { if (!e.altKey && !e.ctrlKey && !e.metaKey) finish(); };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); };
  }, [loading]);

  // Tell the failsafe in app/layout.js that the site's scripts have started.
  useEffect(() => { document.documentElement.setAttribute("data-hydrated", ""); }, []);

  // Once it has lifted, take it out of the page.
  useEffect(() => {
    if (!loading || !ready) return;
    const t = setTimeout(() => setGone(true), LIFT_MS + 100);
    return () => clearTimeout(t);
  }, [loading, ready]);

  // The navy start-up background (see app/layout.js) is only needed until the loading page is gone.
  useEffect(() => {
    if (!gone) return;
    document.documentElement.removeAttribute("data-home");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ECEEF1");
  }, [gone]);

  // While the loading page is up, nothing behind it can be tabbed to or clicked.
  useEffect(() => { if (wrap.current) wrap.current.inert = !ready; }, [ready]);

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
          if (!ready) return;
          const d = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(d) < 60) return;
          if (d < 0 && step < last) go(stops[step + 1].href);
          if (d > 0 && step > 0) go(stops[step - 1].href);
        }}
      >
        <div ref={wrap} data-wait={ready ? undefined : ""} className="contents">
          {/* Portrait. The photo is a cut-out (1104 x 1395), so it is never stretched or cropped on the sides:
              - phone: fills the top 78% of the screen edge to edge, head kept at the top;
              - desktop: full screen height, as wide as the photo needs (79.1dvh), sitting in the bottom-right corner, so the suit runs off the edge. The circle sits under it. */}
          <div className="portrait-in absolute right-0 top-0 z-10 h-[78dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(79.1dvh,64vw)]">
            {/* <div className="absolute -right-[10%] top-[4%] aspect-square h-[80%] rounded-full bg-shade-deep" /> */}
            <img src={person.portrait} width={1104} height={1395} alt={`Portrait of ${person.name}`} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[right_top] lg:object-contain lg:object-right-bottom" />
          </div>
          {/* Header: on phones only the crest in a round badge (so the face stays clear); on desktop the capsule with crest and name */}
          <div className="enter fixed left-4 top-4 z-40 flex items-center gap-2 sm:left-6 sm:top-5 lg:left-[clamp(4rem,7.5vw,9rem)] lg:top-7 lg:items-stretch lg:gap-3">
            <TransitionLink href="/" aria-label="Home" className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white shadow-sm lg:h-auto lg:w-auto lg:justify-start lg:gap-3 lg:py-2 lg:pl-3 lg:pr-6">
              <img src={person.logo} alt="" className="h-12 w-auto lg:h-11" />
              <span className="hidden font-display text-[0.95rem] font-semibold uppercase tracking-[0.05em] lg:inline lg:text-[1.05rem]">{person.name}</span>
            </TransitionLink>
          </div>

          {/* Phone only: the photo fades into dark navy so the white text can sit over it */}
          <div className="fade-navy bg-navy-950 pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[56dvh] lg:hidden" />

          {/* The page's own text */}
          <main>{children}</main>

          {/* Controls */}
          <div className="enter absolute inset-x-6 bottom-5 z-30 flex flex-col items-start gap-4 lg:inset-x-auto lg:bottom-10 lg:left-[clamp(4rem,7.5vw,9rem)]">
            <div className="flex w-full items-center gap-3 lg:w-auto">
              {step > 0 && (
                <TransitionLink href={stops[step - 1].href} aria-label="Previous" className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 transition-colors duration-200 hover:bg-accent hover:text-white">
                  <span className="rotate-180"><Arrow /></span>
                </TransitionLink>
              )}
              <TransitionLink id="next" href={nextStop.href} className="group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-full bg-accent py-1.5 pl-[3.25rem] pr-1.5 text-[0.8rem] font-medium uppercase tracking-[0.14em] lg:flex-none lg:justify-start lg:pl-6 text-white ring-4 ring-white/90">
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

        {/* Loading page: home page only. Deep navy with white pinstripes, the crest and the JHV mark. It stays fixed until the site
            you click / tap anywhere on it or press a key; then it lifts from the bottom to the top and the home page is underneath. */}
        {loading && !gone && (
          <div
            data-loader
            role="button"
            tabIndex={ready ? -1 : 0}
            aria-label="Open the site"
            onClick={() => open.current()}
            className={`pinstripe-deep fixed inset-0 z-50 grid place-items-center will-change-transform motion-reduce:transition-none ${ready ? "pointer-events-none -translate-y-full transition-transform duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]" : "cursor-pointer translate-y-0"}`}
          >
            <div className="flex flex-col items-center">
              <img src={person.logo} alt="" className="h-[clamp(150px,27dvh,230px)] w-auto" fetchPriority="high" />
              <div className="mt-2"><LoaderSignature /></div>
            </div>
            {/* Icon hint instead of text: a thin ring with an arrow that gently bobs upward (the page lifts up when you click) */}
            <span aria-hidden="true" className="loader-hint absolute inset-x-0 bottom-[max(2rem,7dvh)] flex justify-center">
              <span className="relative grid h-14 w-14 place-items-center rounded-full border border-greige/70 text-greige">
                <span className="hint-ring absolute inset-0 rounded-full border border-greige/60" />
                <svg className="hint-arrow h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
              </span>
            </span>
          </div>
        )}
      </div>
    </TransitionContext.Provider>
  );
}