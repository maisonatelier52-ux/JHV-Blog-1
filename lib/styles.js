// Big type, sized by width on phones and by width and height on desktop, so nothing needs to scroll.
// Blog / magazine style (fonts are set in app/layout.js): Fraunces serif for the name, titles and tagline, Inter for the text.
export const nameSize = "font-display [font-size:clamp(3rem,13.6vw,5.8rem)] lg:[font-size:clamp(3.3rem,min(7.6vw,14dvh),9.4rem)] font-semibold leading-[0.95] tracking-[-0.025em]";
export const titleSize = "font-display [font-size:clamp(1.75rem,7.2vw,3.1rem)] lg:[font-size:clamp(2.1rem,min(4.4vw,7dvh),4.5rem)] font-semibold leading-[1.08] tracking-[-0.02em]";
export const taglineSize = "font-display italic font-normal [font-size:clamp(1.1rem,4.6vw,1.7rem)] lg:[font-size:clamp(1.25rem,min(2vw,3.2dvh),1.9rem)] leading-snug";
export const bodySize = "font-body font-normal [font-size:clamp(0.95rem,3.9vw,1.4rem)] lg:[font-size:clamp(1.08rem,min(1.68vw,2.8dvh),1.65rem)] leading-[1.55] lg:leading-[1.62]";
