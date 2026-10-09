/*
 * The JHV mark for the loading page: a line draws out on each side and the letters are
 * written in from left to right. The letters are typed text (the My Soul script font, see
 * app/layout.js), not an image.
 *
 * The letters sit in the exact centre and the two side lines have the same length (flex-1 each).
 */
const line = "block h-px min-w-0 flex-1 origin-left [transform:scaleX(0)] animate-draw";

export default function LoaderSignature() {
  return (
    <div aria-hidden="true" className="flex w-[min(86vw,520px)] select-none items-center">
      {/* left line */}
      <i className={`${line} bg-greige/40`} style={{ animationDelay: "0ms", animationDuration: "600ms" }} />

      {/* the letters: the box is exactly as wide as the ink of "JHV" in My Soul (3.14em); indent-[0.135em] moves the J's left swash onto the box edge so the word is truly centred between the two lines */}
      <span
        className="mx-[3%] block w-[3.14em] shrink-0 -translate-y-[0.19em] indent-[0.135em] font-script [font-size:min(10.4vw,64px)] leading-none whitespace-nowrap text-greige [clip-path:inset(-30%_100%_-30%_-25%)] animate-sign will-change-[clip-path,opacity]"
        style={{ animationDelay: "120ms", animationDuration: "1200ms" }}
      >
        JHV
      </span>

      {/* right line, same length as the left one */}
      <i
        className={`${line} bg-[linear-gradient(90deg,rgba(185,178,165,0.4),rgba(185,178,165,0.14))]`}
        style={{ animationDelay: "600ms", animationDuration: "700ms" }}
      />
    </div>
  );
}
