# Profile story site (Next.js 15, React 19, Tailwind CSS 3.4)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

- Every screen is its own page: `/`, `/who-is-julio`, `/family-legacy`, `/global-career`. The text is rendered by the pages (`app/page.js`, `app/[slug]/page.js`), not by React state.
- Text and pages: `lib/site.js` (add or remove items in `slides`; each one needs a `slug`).
- `components/Shell.js`: header, portrait, buttons, dots, iris transition, keyboard and swipe navigation, and the loader. The loader only plays when the home page is opened, never on the other pages.
- Images: `public/images/portrait.webp` (transparent cutout) and `public/images/logo.png`. The browser tab icon is `app/icon.png`.
- Colors: `tailwind.config.js`. Fonts: Playfair Display (headings, name) and Lora (text) in `app/layout.js`.
- Navigate with the buttons, dots, the crest, arrow keys or swipe.
