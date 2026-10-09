# Profile story site (Next.js 15, React 19, Tailwind CSS 3.4)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

- Every screen is its own page: `/`, `/who-is-julio`, `/family-legacy`, `/global-career`. The text is rendered by the pages (`app/page.js`, `app/[slug]/page.js`), not by React state.
- Text and pages: `lib/site.js` (add or remove items in `slides`; each one needs a `slug`).
- `components/Shell.js`: header, portrait, buttons, dots, iris transition, keyboard and swipe navigation, and the loader. The crest + JHV loading page only plays when the home page is opened (it lifts from the bottom to the top). Other pages, and refreshes on them, start straight away with no loading screen.
- Images: `public/images/portrait.webp` (transparent cutout) and `public/images/logo.png`. The browser tab icon is `app/icon.png`.
- Colors: `tailwind.config.js` (`accent` is the dark blue used on buttons and dots). The loading page is the only dark navy pinstripe screen (`.pinstripe-deep` in `app/globals.css`, `--stripe` / `--stripe-color`). Fonts: Playfair Display (headings, name) and Lora (text) in `app/layout.js`; the JHV loading mark uses My Soul from `app/fonts/my-soul.woff2` (`components/LoaderSignature.js`).
- Navigate with the buttons, dots, the crest, arrow keys or swipe.
