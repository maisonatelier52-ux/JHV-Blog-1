// The text area every page uses. The page's own content goes inside.
export default function Section({ children }) {
  return (
    <section className="absolute inset-x-0 bottom-0 top-24 z-20 flex flex-col justify-end overflow-hidden px-6 pb-[6.25rem] lg:inset-y-0 lg:right-auto lg:w-[56%] lg:justify-start lg:px-16 lg:pb-40 lg:pt-36">
      <div className="enter">{children}</div>
    </section>
  );
}
