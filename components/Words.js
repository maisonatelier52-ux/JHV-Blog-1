import { Fragment } from "react";

// The "word by word" headline effect: each word rises from behind an invisible edge, one after the other.
// text = the words to show; start = the position in the sequence (use it to continue after another <Words>).
// The speed lives in app/globals.css (.wi). Real text stays in the page, so search engines and screen readers read it normally.
export default function Words({ text, start = 0 }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      <span className="w"><span className="wi" style={{ "--i": start + i }}>{word}</span></span>{" "}
    </Fragment>
  ));
}
