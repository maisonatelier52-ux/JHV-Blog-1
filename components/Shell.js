"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { person, stops } from "@/lib/site";
import { TransitionContext } from "@/lib/transition";
import TransitionLink from "./TransitionLink";
import Arrow from "./Arrow";

const R = 46;
const C = 2 * Math.PI * R;

// Header, portrait, controls, page transition and the loader. The page text itself lives in the routes.
export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // The loader only exists when the site is opened on the home page. Other pages (and refreshes on them) start straight away.
  const [loading] = useState(pathname === "/");
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(pathname !== "/");
  const [gone, setGone] = useState(pathname !== "/");
  const [iris, setIris] = useState({ k: 0 });
  const busy = useRef(false);
  const touchX = useRef(0);

  const found = stops.findIndex((s) => s.href === pathname);
  const step = Math.max(0, found);
  const last = stops.length - 1;
  const slide = stops[step];
  const nextStop = stops[step === last ? 0 : step + 1];

  const go = useCallback((href) => {
    if (busy.current || href === pathname) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push(href); return; }
    const b = document.getElementById("next")?.getBoundingClientRect();
    const w = window.innerWidth, h = window.innerHeight;
    busy.current = true;
    setIris((i) => ({ k: i.k + 1, x: b ? b.left + b.width / 2 : w / 2, y: b ? b.top + b.height / 2 : h - 60, x2: w * 0.74, y2: h * 0.3 }));
    setTimeout(() => router.push(href), 650);
    setTimeout(() => { busy.current = false; }, 1350);
  }, [pathname, router]);

  useEffect(() => {
    if (!loading) return;
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 1.5 + Math.random() * 4);
      setPct(p);
      if (p >= 100) { clearInterval(t); setTimeout(() => setReady(true), 400); setTimeout(() => setGone(true), 1700); }
    }, 55);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    const k = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (["ArrowRight", "ArrowDown"].includes(e.key) && step < last) go(stops[step + 1].href);
      if (["ArrowLeft", "ArrowUp"].includes(e.key) && step > 0) go(stops[step - 1].href);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, step, last]);

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
        {/* Held back (display: none) until the loader is done, so the entrance animations play when it lifts. */}
        <div data-wait={ready ? undefined : ""} className="contents">
          {/* Portrait: edge to edge on phones, big on the right and bottom on desktop. The circle sits under it. */}
          <div className="reveal absolute right-0 top-0 z-10 h-[80dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(100dvh,64vw)]">
            <div className="absolute -right-[10%] top-[4%] aspect-square h-[80%] rounded-full bg-shade-deep" />
            <img src={person.portrait} alt={`Portrait of ${person.name}`} className="absolute inset-0 h-full w-full object-cover object-right-bottom" />
          </div>
          {/* Phone only: the photo melts into the page color so the text can sit over it */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[62dvh] bg-gradient-to-t from-shade from-40% via-shade/75 to-transparent lg:hidden" />

          {/* Compact capsule header: crest and name */}
          <div className="enter fixed left-3 top-3 z-40 sm:left-6 sm:top-5">
            <TransitionLink href="/" aria-label="Home" className="flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-3 pr-6 shadow-sm">
              <img src={person.logo} alt="" className="h-11 w-auto" />
              <span className="text-xl italic tracking-tight sm:text-2xl">{person.name}</span>
            </TransitionLink>
          </div>

          {/* The page's own text */}
          <main>{children}</main>

          {/* Controls */}
          <div className="enter absolute bottom-5 left-5 z-30 flex flex-col items-start gap-4 lg:bottom-10 lg:left-16">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <TransitionLink href={stops[step - 1].href} aria-label="Previous" className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 hover:bg-ink hover:text-white">
                  <span className="rotate-180"><Arrow /></span>
                </TransitionLink>
              )}
              <TransitionLink id="next" href={nextStop.href} className="group flex items-center gap-4 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-lg font-medium text-white ring-4 ring-white/90">
                <span className="lg:hidden">{slide.short}</span>
                <span className="hidden lg:inline">{slide.next}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"><Arrow /></span>
              </TransitionLink>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm lg:flex">
              {stops.map((s, i) => (
                <TransitionLink key={s.href} href={s.href} aria-label={`Go to ${s.nav}`} aria-current={i === step ? "page" : undefined} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-ink" : "w-2 bg-ink/20 hover:bg-ink/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Page transition: a black iris opens from the button, then closes onto the portrait */}
        {iris.k > 0 && (
          <div key={iris.k} className="iris pointer-events-none fixed inset-0 z-[45] bg-ink" style={{ "--x": `${iris.x}px`, "--y": `${iris.y}px`, "--x2": `${iris.x2}px`, "--y2": `${iris.y2}px` }} />
        )}

        {/* Loader: home page only. White, circular progress around the crest, then fades to the home */}
        {loading && !gone && (
          <div data-loader className={`pointer-events-none fixed inset-0 z-50 grid place-items-center bg-white text-ink transition-all duration-1000 ease-out motion-reduce:transition-none ${ready ? "scale-105 opacity-0" : "opacity-100"}`}>
            <div className="text-center">
              <div className="relative mx-auto h-52 w-52">
                <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                  <circle cx="50" cy="50" r="49" fill="none" stroke="#0A0A0A" strokeOpacity=".3" strokeWidth=".6" strokeDasharray="1 3" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r={R} fill="none" stroke="#0A0A0A" strokeOpacity=".1" strokeWidth="1.6" />
                  <circle cx="50" cy="50" r={R} fill="none" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
                </svg>
                <div className="absolute inset-0 grid place-items-center"><img src={person.logo} alt="" className="h-28 w-auto" /></div>
              </div>
              <p className="mt-8 text-xl italic">{person.name}</p>
            </div>
          </div>
        )}
      </div>
    </TransitionContext.Provider>
  );
}
