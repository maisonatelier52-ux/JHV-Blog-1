# Profile story site (Next.js 15, React 19, Tailwind CSS 3.4)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

- Every screen is its own page: `/`, `/international-banker`, `/family-tradition-in-banking`, `/caracas-to-london`, `/client-first-finance`. The text is rendered by the pages (`app/page.js`, `app/[slug]/page.js`), not by React state.
- Text and pages: `lib/site.js` (add or remove items in `slides`; each one needs a `slug`).
- `components/Shell.js`: header, portrait, buttons, dots, iris transition, keyboard and swipe navigation, and the loader. The crest + JHV loading page is an intro page of its own, shown only when the home page is opened. It stays until you click or tap anywhere on it (or press a key), then it lifts and shows the home page; it never opens by itself. A small arrow icon in a ring (no text) at the bottom shows that it can be opened. A failsafe in `app/layout.js` removes it only if the site's scripts fail to start within 10 seconds. Other pages, and refreshes on them, start straight away.
- Images: `public/images/portrait.webp` (transparent cutout) and `public/images/logo.png`. The browser tab icon is `app/icon.png`.
- Colors: `tailwind.config.js` (`accent` is the dark blue used on buttons and dots). The loading page is the only dark navy pinstripe screen (`.pinstripe-deep` in `app/globals.css`, `--stripe` / `--stripe-color`). Fonts (stored in `app/fonts`, set in `app/layout.js`, no Google download needed): Libre Baskerville (regular weight) for the name, titles, tagline and paragraphs, Inter for the small capital labels (header name, buttons, tags); all sizes are in `lib/styles.js`. The left edge of the header, text and bottom buttons is one value, `clamp(4rem,7.5vw,9rem)`, used in `components/Shell.js` and `components/Section.js`. The JHV loading mark uses My Soul from `app/fonts/my-soul.woff2` (`components/LoaderSignature.js`).
- Navigate with the buttons, dots, the crest, arrow keys or swipe.


## SEO

- Domain, OG image, keywords, `sameAs` profile links and verification codes: `site` in `lib/site.js`. Titles and descriptions for each page: `seoTitle` and `description` on each item in `slides`.
- `lib/seo.js` builds the page metadata (title, description, canonical, Open Graph, Twitter card) and the JSON-LD graph (Person, Britannia Financial Group, WebSite, ProfilePage or WebPage, BreadcrumbList). `components/JsonLd.js` prints it.
- Every page uses the same social card: `public/images/og-card.jpg` (1200x630).
- `app/sitemap.js` creates `/sitemap.xml` and `app/robots.js` creates `/robots.txt`.
- After deploying: add the domain in Google Search Console, submit `http://www.juliovelutini.com/sitemap.xml` (the site URL is set once in `lib/site.js`; change it to https when SSL is on), and check the structured data with Google's Rich Results Test and the Schema Markup Validator.
