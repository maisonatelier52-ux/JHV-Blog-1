import Reveal from "./Reveal";

// The text area every page uses. The page's own content goes inside.
export default function Section({ children }) {
  return (
    <section className="absolute inset-x-0 bottom-0 top-24 z-20 flex flex-col justify-end overflow-hidden px-6 pb-[7rem] lg:inset-y-0 lg:right-auto lg:w-[calc(100%_-_min(79.1dvh,64vw)_+_3rem)] lg:justify-start lg:pl-[clamp(4rem,7.5vw,9rem)] lg:pr-12 lg:pb-40 lg:pt-36">
      <div className="text-white lg:text-ink"><Reveal>{children}</Reveal></div>
    </section>
  );
}
