// Sizes sized by width on phones and by width and height on desktop, so nothing needs to scroll.
// Type style (fonts are set in app/layout.js): Libre Baskerville, regular weight, for the name, titles, tagline and text; Inter for small labels.
// The name is set in capitals, like the hero of the biography pages.
export const nameSize = "font-display uppercase font-normal [font-size:clamp(2.4rem,10.4vw,4.4rem)] lg:[font-size:clamp(2.6rem,min(5.4vw,10.5dvh),5.5rem)] leading-[1.08] tracking-[0.005em]";
export const titleSize = "t-title font-display font-normal [font-size:clamp(1.5rem,6.2vw,2.5rem)] lg:[font-size:clamp(1.9rem,min(3.4vw,6dvh),3.5rem)] leading-[1.15] tracking-[-0.01em]";
export const taglineSize = "font-display font-normal [font-size:clamp(0.95rem,3.9vw,1.25rem)] lg:[font-size:clamp(1rem,min(1.45vw,2.6dvh),1.3rem)] leading-snug";
export const bodySize = "t-body font-display font-normal [font-size:clamp(0.9rem,3.6vw,1.1rem)] lg:[font-size:clamp(0.95rem,min(1.1vw,2.2dvh),1.1rem)] leading-[1.6]";
// Small labels (header name, buttons, tags): Inter, capitals, wide letter spacing.
export const labelSize = "font-body font-medium uppercase tracking-[0.14em]";
