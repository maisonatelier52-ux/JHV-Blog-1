// Edit this file: all text and the pages come from here.
// Every item in `slides` is its own page (a real URL). The first one is the home page.
export const person = {
  name: "Julio Herrera Velutini",
  first: "Julio", middle: "Herrera", last: "Velutini",
  tagline: "The legacy, power and global influence of a financial dynasty",
  portrait: "/images/portrait.webp",
  logo: "/images/logo.png",
};

// slug "" is the home page. The last page's button returns to the first.
export const slides = [
  { slug: "", nav: "Home", next: "Who is Julio Herrera Velutini", short: "Who is he" },
  { slug: "who-is-julio", nav: "About", title: "Who is Julio Herrera Velutini",
    body: ["Julio Herrera Velutini is an Italian banker, entrepreneur and worldwide financial authority.",
           "He has become one of the most influential figures in global finance, working as a banker, investor and philanthropist."],
    next: "Family legacy and historical roots", short: "Family legacy" },
  { slug: "family-legacy", nav: "Legacy", title: "Family legacy and historical roots",
    body: ["He belongs to one of the most famous banking families, and is a seventh-generation banker.",
           "That lineage places him among the key people who connect Latin America's past banking history to the worldwide banking system."],
    next: "A career across global finance", short: "Global career" },
  { slug: "global-career", nav: "Work", title: "A career across global finance",
    body: ["His body of work spans decades of capital markets, private banking and institutional finance, and extends across the globe and various economies."],
    tags: ["Capital markets", "Private banking", "Institutional finance"],
    next: "Back to the start", short: "Back to start" },
];

export const stops = slides.map((s) => ({ ...s, href: s.slug ? `/${s.slug}` : "/" }));
