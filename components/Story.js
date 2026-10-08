"use client";
import { useEffect, useRef, useState } from "react";
import { person, slides } from "@/lib/site";

const Arrow = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
    <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const R = 46;
const C = 2 * Math.PI * R;
// Big type, sized by width on phones and by width and height on desktop, so nothing needs to scroll.
const nameSize = "[font-size:clamp(3.4rem,15.5vw,6.5rem)] lg:[font-size:clamp(3.5rem,min(9vw,16dvh),11rem)] font-semibold leading-[0.95] tracking-tight";
const titleSize = "[font-size:clamp(2.1rem,9.2vw,3.6rem)] lg:[font-size:clamp(2.2rem,min(5vw,7.4dvh),5.2rem)] font-semibold leading-[1.05] tracking-tight";
const bodySize = "[font-size:clamp(1.05rem,4.6vw,1.5rem)] lg:[font-size:clamp(1.05rem,min(1.75vw,2.8dvh),1.7rem)] leading-[1.55]";

export default function Story() {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [step, setStep] = useState(0);
  const [iris, setIris] = useState({ k: 0 });
  const cur = useRef(0);
  const busy = useRef(false);
  const touchX = useRef(0);
  const last = slides.length - 1;
  const slide = slides[step];

  const go = (n) => {
    n = Math.max(0, Math.min(last, n));
    if (busy.current || n === cur.current) return;
    cur.current = n;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(n); return; }
    const b = document.getElementById("next")?.getBoundingClientRect();
    const w = window.innerWidth, h = window.innerHeight;
    busy.current = true;
    setIris((i) => ({ k: i.k + 1, x: b ? b.left + b.width / 2 : w / 2, y: b ? b.top + b.height / 2 : h - 60, x2: w * 0.74, y2: h * 0.3 }));
    setTimeout(() => setStep(n), 650);
    setTimeout(() => { busy.current = false; }, 1350);
  };

  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 1.5 + Math.random() * 4);
      setPct(p);
      if (p >= 100) { clearInterval(t); setTimeout(() => setReady(true), 400); setTimeout(() => setGone(true), 1700); }
    }, 55);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const k = (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(cur.current + 1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(cur.current - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div
      className="relative h-dvh overflow-hidden bg-shade"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 60) go(cur.current + (d < 0 ? 1 : -1)); }}
    >
      {ready && (
        <>
          {/* Portrait: edge to edge on phones, big on the right and bottom on desktop. The circle sits under it. */}
          <div className="reveal absolute right-0 top-0 z-10 h-[80dvh] w-full lg:bottom-0 lg:top-auto lg:h-dvh lg:w-[min(100dvh,64vw)]">
            <div className="absolute -right-[10%] top-[4%] aspect-square h-[80%] rounded-full bg-shade-deep" />
            <img src={person.portrait} alt={`Portrait of ${person.name}`} className="absolute inset-0 h-full w-full object-cover object-right-bottom" />
          </div>
          {/* Phone only: the photo melts into the page color so the text can sit over it */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[62dvh] bg-gradient-to-t from-shade from-40% via-shade/75 to-transparent lg:hidden" />

          {/* Compact capsule header: crest and name */}
          <div className="enter fixed left-3 top-3 z-40 sm:left-6 sm:top-5">
            <button onClick={() => go(0)} aria-label="Home" className="flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-3 pr-6 shadow-sm">
              <img src={person.logo} alt="" className="h-11 w-auto" />
              <span className="text-xl italic tracking-tight sm:text-2xl">{person.name}</span>
            </button>
          </div>

          {/* Text */}
          <section key={step} className="absolute inset-x-0 bottom-0 top-24 z-20 flex flex-col justify-end overflow-hidden px-6 pb-[6.25rem] lg:inset-y-0 lg:right-auto lg:w-[56%] lg:justify-start lg:px-16 lg:pb-40 lg:pt-36">
            <div className="enter">
              {step === 0 ? (
                <>
                  <p className={`max-w-lg font-body italic text-ink ${bodySize}`}>{person.tagline}</p>
                  <h1 className={`mt-3 lg:mt-5 ${nameSize}`}>{person.first}<br />{person.middle}<br />{person.last}</h1>
                </>
              ) : (
                <>
                  <h2 className={`max-w-2xl ${titleSize}`}>{slide.title}</h2>
                  <div className={`mt-4 max-w-2xl space-y-3 font-body text-ink lg:mt-8 lg:space-y-5 ${bodySize}`}>
                    {slide.body.map((t) => <p key={t}>{t}</p>)}
                  </div>
                  {slide.tags && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {slide.tags.map((t) => <li key={t} className="rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-medium lg:text-base">{t}</li>)}
                    </ul>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Controls */}
          <div className="enter absolute bottom-5 left-5 z-30 flex flex-col items-start gap-4 lg:bottom-10 lg:left-16">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button onClick={() => go(step - 1)} aria-label="Previous" className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-ink ring-4 ring-white/90 hover:bg-ink hover:text-white">
                  <span className="rotate-180"><Arrow /></span>
                </button>
              )}
              <button id="next" onClick={() => go(step === last ? 0 : step + 1)} className="group flex items-center gap-4 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-lg font-medium text-white ring-4 ring-white/90">
                <span className="lg:hidden">{slide.short}</span>
                <span className="hidden lg:inline">{slide.next}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"><Arrow /></span>
              </button>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm lg:flex">
              {slides.map((s, i) => (
                <button key={s.nav} onClick={() => go(i)} aria-label={`Go to ${s.nav}`} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-ink" : "w-2 bg-ink/20 hover:bg-ink/40"}`} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Page transition: a black iris opens from the button, then closes onto the portrait */}
      {iris.k > 0 && (
        <div key={iris.k} className="iris pointer-events-none fixed inset-0 z-[45] bg-ink" style={{ "--x": `${iris.x}px`, "--y": `${iris.y}px`, "--x2": `${iris.x2}px`, "--y2": `${iris.y2}px` }} />
      )}

      {/* Loader: white, circular progress around the crest, then fades to the home */}
      {!gone && (
        <div className={`pointer-events-none fixed inset-0 z-50 grid place-items-center bg-white text-ink transition-all duration-1000 ease-out motion-reduce:transition-none ${ready ? "scale-105 opacity-0" : "opacity-100"}`}>
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
  );
}
