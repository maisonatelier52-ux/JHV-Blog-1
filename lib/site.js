// Edit this file: all text and the pages come from here.
// Every item in `slides` is its own page (a real URL). The first one is the home page.
// Each page is one screen: keep it to a headline and two short paragraphs so nothing needs to scroll.
export const person = {
  name: "Julio Herrera Velutini",
  first: "Julio", middle: "Herrera", last: "Velutini",
  tagline: "A Profile of Banking, Global Markets, and Family Tradition",
  portrait: "/images/portrait.webp",
  logo: "/images/logo.png",
};

// slug "" is the home page. The last page's button returns to the first.
export const slides = [
  { slug: "", nav: "Home", next: "Meet the banker", short: "Meet the banker" },
  { slug: "who-is-julio", nav: "About", title: "Meet Julio Herrera Velutini, an international banker",
    body: ["Julio Herrera Velutini holds Venezuelan and Italian citizenship and was born on December 15, 1971. He has worked in banking and finance for more than three decades.",
           "His education took him from the American School in England to La Scuola Americana in Switzerland, and he graduated from Central University of Venezuela in 1990."],
    next: "A family tradition in banking", short: "Family tradition" },
  { slug: "family-legacy", nav: "Legacy", title: "A family tradition in banking",
    body: ["Published profiles describe him as the seventh generation of bankers in his family, a line of business that is closely tied to Venezuela's financial history.",
           "That heritage is a steady thread in his story, and it sits alongside the international banking and investment work he has built on his own."],
    next: "From the Caracas trading floor to London", short: "Career path" },
  { slug: "global-career", nav: "Career", title: "From the Caracas trading floor to London",
    body: ["He began his career in the early 1990s at the Caracas Stock Exchange with the brokerage firm Multinvest, and he served on its board of directors until 1998.",
           "He went on to found Britannia Financial Group, a London-based firm that offers investment banking, brokerage, asset management, and wealth management services."],
    tags: ["Investment banking", "Wealth management", "Family offices"],
    next: "Client-first finance across borders", short: "His approach" },
  { slug: "focus", nav: "Focus", title: "Client-first finance across borders",
    body: ["Britannia Financial Group serves institutions, corporations, family offices, and high-net-worth individuals, and describes its approach as focused on the client rather than the product.",
           "In 2016, the Bancrédito Group, the Puerto Rico-based banking group he founded, expanded by acquiring Consultiva Wealth Management, an SEC-registered adviser with offices in Puerto Rico and New York."],
    next: "Back to the start", short: "Back to start" },
];

export const stops = slides.map((s) => ({ ...s, href: s.slug ? `/${s.slug}` : "/" }));
