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

// Site-wide SEO settings. Used by lib/seo.js for titles, Open Graph, Twitter cards, canonical URLs, the sitemap and JSON-LD.
export const site = {
  url: "https://juliovelutini.com",
  name: "Julio Herrera Velutini",
  locale: "en_US",
  language: "en-US",
  ogImage: "/images/og-card.jpg", // 1200x630, used for every page
  ogImageAlt: "Silver heraldic crest with the JHV monogram on a royal blue background",
  updated: "2026-10-29", // last content update (ISO date), used in the sitemap and JSON-LD
  keywords: ["Julio Herrera Velutini", "Julio Martín Herrera Velutini", "Herrera Velutini", "Britannia Financial Group", "international banker", "Bancrédito", "Caracas Stock Exchange", "Venezuelan Italian banker"],
  // Only real, verified profiles belong here. Add LinkedIn, X, Instagram or Crunchbase URLs once you have the exact links.
  sameAs: ["https://en.wikipedia.org/wiki/Julio_Herrera_Velutini"],
  // Optional: Google Search Console / Bing verification codes.
  verification: { google: "", bing: "" },
};

// slug "" is the home page. The last page's button returns to the first.
export const slides = [
  { slug: "", nav: "Home", seoTitle: "Julio Herrera Velutini – Banker, Britannia Financial Group", description: "Profile of Julio Herrera Velutini, an Italian-Venezuelan banker born in 1971 and founder of London-based Britannia Financial Group. Biography and career.", crumb: "Home", next: "Meet the banker", short: "Meet the banker" },
  { slug: "international-banker", nav: "About", seoTitle: "Julio Herrera Velutini Biography: Early Life and Education", description: "Julio Herrera Velutini was born December 15, 1971. Read his biography, from schooling in England and Switzerland to Central University of Venezuela.", crumb: "Biography", title: "Meet Julio Herrera Velutini, an international banker",
    body: ["Julio Herrera Velutini holds Venezuelan and Italian citizenship and was born on December 15, 1971. He has worked in banking and finance for more than three decades.",
           "His education took him from the American School in England to La Scuola Americana in Switzerland, and he graduated from Central University of Venezuela in 1990."],
    next: "A family tradition in banking", short: "Family tradition" },
  { slug: "family-tradition-in-banking", nav: "Legacy", seoTitle: "Julio Herrera Velutini: A Family Tradition in Banking", description: "Published profiles describe Julio Herrera Velutini as the seventh generation of bankers in his family. Learn about the tradition behind his banking career.", crumb: "Family Tradition", title: "A family tradition in banking",
    body: ["Published profiles describe him as the seventh generation of bankers in his family, a line of business that is closely tied to Venezuela's financial history.",
           "That heritage is a steady thread in his story, and it sits alongside the international banking and investment work he has built on his own."],
    next: "From the Caracas trading floor to London", short: "Career path" },
  { slug: "caracas-to-london", nav: "Career", seoTitle: "Julio Herrera Velutini Career: From Caracas to London", description: "Julio Herrera Velutini began at the Caracas Stock Exchange in the early 1990s and later founded Britannia Financial Group in London. See his career path.", crumb: "Career", title: "From the Caracas trading floor to London",
    body: ["He began his career in the early 1990s at the Caracas Stock Exchange with the brokerage firm Multinvest, and he served on its board of directors until 1998.",
           "He went on to found Britannia Financial Group, a London-based firm that offers investment banking, brokerage, asset management, and wealth management services."],
    tags: ["Investment banking", "Wealth management", "Family offices"],
    next: "Client-first finance across borders", short: "His approach" },
  { slug: "client-first-finance", nav: "Focus", seoTitle: "Julio Herrera Velutini and Britannia Financial Group", description: "Britannia Financial Group offers investment banking, brokerage, and wealth management to institutions and family offices, with a client-first approach.", crumb: "Britannia and Bancrédito", title: "Client-first finance across borders",
    body: ["Britannia Financial Group serves institutions, corporations, family offices, and high-net-worth individuals, and describes its approach as focused on the client rather than the product.",
           "In 2016, the Bancrédito Group, the Puerto Rico-based banking group he founded, expanded by acquiring Consultiva Wealth Management, an SEC-registered adviser with offices in Puerto Rico and New York."],
    next: "Back to the start", short: "Back to start" },
];

export const stops = slides.map((s) => ({ ...s, href: s.slug ? `/${s.slug}` : "/" }));
