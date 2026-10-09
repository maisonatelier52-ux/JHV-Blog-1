// "use client";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { person, stops } from "@/lib/site";
// import { TransitionContext } from "@/lib/transition";
// import TransitionLink from "./TransitionLink";
// import Arrow from "./Arrow";
// import LoaderSignature from "./LoaderSignature";

// const LOADER_MS = 1550; // time from the start of the page load until the JHV mark has finished writing (see LoaderSignature)
// const LIFT_MS = 750; // the loading page lifts from the bottom to the top and shows the home page

// // Header, portrait, controls, page transition and the loader. The page text itself lives in the routes.
// export default function Shell({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   // The loading page only exists when the site is opened on the home page. Other pages (and refreshes on them) start straight away.
//   const [loading] = useState(pathname === "/");
//   const [ready, setReady] = useState(pathname !== "/");
//   const [gone, setGone] = useState(pathname !== "/");
//   const [iris, setIris] = useState({ k: 0 });
//   const busy = useRef(false);
//   const touchX = useRef(0);

//   const found = stops.findIndex((s) => s.href === pathname);
//   const step = Math.max(0, found);
//   const last = stops.length - 1;
//   const slide = stops[step];
//   const nextStop = stops[step === last ? 0 : step + 1];

//   const go = useCallback((href) => {
//     if (busy.current || href === pathname) return;
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push(href); return; }
//     const b = document.getElementById("next")?.getBoundingClientRect();
//     const w = window.innerWidth, h = window.innerHeight;
//     busy.current = true;
//     setIris((i) => ({ k: i.k + 1, x: b ? b.left + b.width / 2 : w / 2, y: b ? b.top + b.height / 2 : h - 60, x2: w * 0.74, y2: h * 0.3 }));
//     setTimeout(() => router.push(href), 650);
//     setTimeout(() => { busy.current = false; }, 1350);
//   }, [pathname, router]);

//   // Loading page: held until the JHV mark is written, then it lifts and the home page appears.
//   useEffect(() => {
//     if (!loading) return;
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setReady(true); setGone(true); return; }
//     // The loading page is on screen from the first paint, before this code runs. Counting from the start of the page load
//     // means we only wait for what is left, never a full extra delay.
//     const wait = Math.max(100, LOADER_MS - performance.now());
//     const a = setTimeout(() => setReady(true), wait);
//     const b = setTimeout(() => setGone(true), wait + LIFT_MS + 100);
//     return () => { clearTimeout(a); clearTimeout(b); };
//   }, [loading]);

//   // The navy start-up background (see app/layout.js) is only needed until the loading page is gone.
//   useEffect(() => {
//     if (!gone) return;
//     document.documentElement.removeAttribute("data-home");
//     document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ECEEF1");
//   }, [gone]);

//   useEffect(() => {
//     const k = (e) => {
//       if (!ready) return;
//       if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
//       if (["ArrowRight", "ArrowDown"].includes(e.key) && step < last) go(stops[step + 1].href);
//       if (["ArrowLeft", "ArrowUp"].includes(e.key) && step > 0) go(stops[step - 1].href);
//     };
//     window.addEventListener("keydown", k);
//     return () => window.removeEventListener("keydown", k);
//   }, [go, step, last, ready]);

//   return (
//     <TransitionContext.Provider value={go}>
//       <div
//         className="relative h-dvh overflow-hidden bg-shade"
//         onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
//         onTouchEnd={(e) => {
//           const d = e.changedTouches[0].clientX - touchX.current;
//           if (Math.abs(d) < 60) return;
//           if (d < 0 && step < last) go(stops[step + 1].href);
//           if (d > 0 && step > 0) go(stops[step - 1].href);
//         }}
//       >
//         {/* Drawn behind the loading page from the start (nothing has to load later); its entrance animations wait until the loading page fades. */}
//         <div data-wait={ready ? undefined : ""} inert={!ready} className="contents">
//           {/* Portrait: edge to edge on phones, big on the right and bottom on desktop. The circle sits under it. */}
//           <div className="portrait-in absolute right-0 top-0 z-10 h-[80dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(100dvh,64vw)]">
//             <div className="absolute -right-[10%] top-[4%] aspect-square h-[80%] rounded-full bg-shade-deep" />
//             <img src={person.portrait} alt={`Portrait of ${person.name}`} className="absolute inset-0 h-full w-full object-cover object-right-bottom" />
//           </div>
//           {/* Phone only: the photo melts into the page color so the text can sit over it */}
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[62dvh] bg-gradient-to-t from-shade from-40% via-shade/75 to-transparent lg:hidden" />

//           {/* Compact capsule header: crest and name */}
//           <div className="enter fixed left-3 top-3 z-40 sm:left-6 sm:top-5">
//             <TransitionLink href="/" aria-label="Home" className="flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-3 pr-6 shadow-sm">
//               <img src={person.logo} alt="" className="h-11 w-auto" />
//               <span className="text-xl italic tracking-tight sm:text-2xl">{person.name}</span>
//             </TransitionLink>
//           </div>

//           {/* The page's own text */}
//           <main>{children}</main>

//           {/* Controls */}
//           <div className="enter absolute bottom-5 left-5 z-30 flex flex-col items-start gap-4 lg:bottom-10 lg:left-16">
//             <div className="flex items-center gap-3">
//               {step > 0 && (
//                 <TransitionLink href={stops[step - 1].href} aria-label="Previous" className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 hover:bg-accent hover:text-white">
//                   <span className="rotate-180"><Arrow /></span>
//                 </TransitionLink>
//               )}
//               <TransitionLink id="next" href={nextStop.href} className="group flex items-center gap-4 rounded-full bg-accent py-1.5 pl-6 pr-1.5 text-lg font-medium text-white ring-4 ring-white/90">
//                 <span className="lg:hidden">{slide.short}</span>
//                 <span className="hidden lg:inline">{slide.next}</span>
//                 <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-accent"><Arrow /></span>
//               </TransitionLink>
//             </div>
//             <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm lg:flex">
//               {stops.map((s, i) => (
//                 <TransitionLink key={s.href} href={s.href} aria-label={`Go to ${s.nav}`} aria-current={i === step ? "page" : undefined} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-accent" : "w-2 bg-accent/20 hover:bg-accent/40"}`} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Page transition: an iris with the loading page background (deep navy + white pinstripes) opens from the button, then closes onto the portrait */}
//         {iris.k > 0 && (
//           <div key={iris.k} className="iris pinstripe-deep pointer-events-none fixed inset-0 z-[45]" style={{ "--x": `${iris.x}px`, "--y": `${iris.y}px`, "--x2": `${iris.x2}px`, "--y2": `${iris.y2}px` }} />
//         )}

//         {/* Loading page: home page only. Deep navy with white pinstripes, the crest and the JHV mark. When it is done it lifts
//             from the bottom to the top and the home page is underneath. */}
//         {loading && !gone && (
//           <div data-loader className={`pinstripe-deep pointer-events-none fixed inset-0 z-50 grid place-items-center will-change-transform motion-reduce:transition-none ${ready ? "-translate-y-full transition-transform duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]" : "translate-y-0"}`}>
//             <div className="flex flex-col items-center">
//               <img src={person.logo} alt="" className="h-[clamp(150px,27dvh,230px)] w-auto" fetchPriority="high" />
//               <div className="mt-2"><LoaderSignature /></div>
//             </div>
//           </div>
//         )}
//       </div>
//     </TransitionContext.Provider>
//   );
// }

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { person, stops } from "@/lib/site";
import { TransitionContext } from "@/lib/transition";
import TransitionLink from "./TransitionLink";
import Arrow from "./Arrow";
import LoaderSignature from "./LoaderSignature";

const SHOW_MS = 1700; // how long the loading content stays on screen (the JHV mark finishes writing at ~1.3s, then it rests). Raise it to show longer.
const LIFT_MS = 750; // the loading page lifts from the bottom to the top and shows the home page

// Header, portrait, controls, page transition and the loader. The page text itself lives in the routes.
export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // The loading page only exists when the site is opened on the home page. Other pages (and refreshes on them) start straight away.
  const [loading] = useState(pathname === "/");
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
          <div className="portrait-in absolute right-0 top-0 z-10 h-[80dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(100dvh,64vw)]">
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
                <TransitionLink href={stops[step - 1].href} aria-label="Previous" className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 hover:bg-accent hover:text-white">
                  <span className="rotate-180"><Arrow /></span>
                </TransitionLink>
              )}
              <TransitionLink id="next" href={nextStop.href} className="group flex items-center gap-4 rounded-full bg-accent py-1.5 pl-6 pr-1.5 text-lg font-medium text-white ring-4 ring-white/90">
                <span className="lg:hidden">{slide.short}</span>
                <span className="hidden lg:inline">{slide.next}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-accent"><Arrow /></span>
              </TransitionLink>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm lg:flex">
              {stops.map((s, i) => (
                <TransitionLink key={s.href} href={s.href} aria-label={`Go to ${s.nav}`} aria-current={i === step ? "page" : undefined} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-accent" : "w-2 bg-accent/20 hover:bg-accent/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Page transition: an iris with the loading page background (deep navy + white pinstripes) opens from the button, then closes onto the portrait */}
        {iris.k > 0 && (
          <div key={iris.k} className="iris pinstripe-deep pointer-events-none fixed inset-0 z-[45]" style={{ "--x": `${iris.x}px`, "--y": `${iris.y}px`, "--x2": `${iris.x2}px`, "--y2": `${iris.y2}px` }} />
        )}

        {/* Loading page: home page only. Deep navy with white pinstripes, the crest and the JHV mark. When it is done it lifts
            from the bottom to the top and the home page is underneath. */}
        {loading && !gone && (
          <div data-loader className={`pinstripe-deep pointer-events-none fixed inset-0 z-50 grid place-items-center will-change-transform motion-reduce:transition-none ${ready ? "-translate-y-full transition-transform duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]" : "translate-y-0"}`}>
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