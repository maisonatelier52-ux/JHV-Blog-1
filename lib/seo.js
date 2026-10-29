import { person, site, stops } from "@/lib/site";

const abs = (path = "/") => new URL(path, site.url).toString();
const pathOf = (page) => (page.slug ? `/${page.slug}` : "/");

const ogImage = { url: site.ogImage, width: 1200, height: 630, alt: site.ogImageAlt, type: "image/jpeg" };

// Metadata for one page: title, description, canonical URL, Open Graph and Twitter card. Every page uses the same OG image.
export function pageMetadata(page) {
  const path = pathOf(page);
  return {
    title: { absolute: page.seoTitle },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: path,
      title: page.seoTitle,
      description: page.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.description,
      images: [{ url: site.ogImage, alt: site.ogImageAlt }],
    },
  };
}

// Schema.org entities, linked by @id so every page describes the same person, company and website.
const ids = {
  person: abs("/#person"),
  org: abs("/#britannia"),
  website: abs("/#website"),
};

function entities() {
  return [
    {
      "@type": "Person",
      "@id": ids.person,
      name: person.name,
      givenName: "Julio",
      familyName: "Herrera Velutini",
      alternateName: ["Julio Martín Herrera Velutini", "Julio M. Herrera Velutini"],
      birthDate: "1971-12-15",
      nationality: [
        { "@type": "Country", name: "Venezuela" },
        { "@type": "Country", name: "Italy" },
      ],
      jobTitle: "Banker and entrepreneur",
      description: "Italian-Venezuelan banker and entrepreneur, founder of Britannia Financial Group, with more than 30 years of experience in banking and finance.",
      image: abs(person.portrait),
      url: abs("/"),
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Central University of Venezuela" },
        { "@type": "EducationalOrganization", name: "The American School in England" },
        { "@type": "EducationalOrganization", name: "La Scuola Americana in Svizzera" },
      ],
      knowsAbout: ["Banking", "Investment banking", "Wealth management", "Capital markets", "Private banking"],
      knowsLanguage: ["en", "es", "it"],
      sameAs: site.sameAs,
    },
    {
      "@type": "Organization",
      "@id": ids.org,
      name: "Britannia Financial Group",
      legalName: "Britannia Financial Group Limited",
      url: "https://www.britannia.com/",
      description: "London-based financial group offering investment banking, securities, brokerage, asset management, and wealth management services.",
      foundingDate: "2016",
      founder: { "@id": ids.person },
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      url: abs("/"),
      name: site.name,
      alternateName: ["Julio Herrera Velutini profile", "juliovelutini.com"],
      description: "A profile of Julio Herrera Velutini: biography, family tradition in banking, and career in global finance.",
      inLanguage: site.language,
      about: { "@id": ids.person },
    },
  ];
}

// The JSON-LD @graph for one page: Person, Britannia, WebSite, plus this page and its breadcrumb trail.
export function pageJsonLd(page) {
  const url = abs(pathOf(page));
  const isHome = !page.slug;
  const home = stops[0];
  const webPage = {
    "@type": isHome || page.slug === "international-banker" ? "ProfilePage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.seoTitle,
    headline: page.title || person.name,
    description: page.description,
    inLanguage: site.language,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.person },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(site.ogImage), width: 1200, height: 630 },
    image: abs(site.ogImage),
    dateModified: site.updated,
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
  if (webPage["@type"] === "ProfilePage") webPage.mainEntity = { "@id": ids.person };

  const trail = isHome ? [home] : [home, page];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: trail.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.crumb,
      item: abs(pathOf(p)),
    })),
  };

  return { "@context": "https://schema.org", "@graph": [...entities(), webPage, breadcrumb] };
}

// Safe to place inside a <script> tag: "<" is escaped so the data can never close the tag.
export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
