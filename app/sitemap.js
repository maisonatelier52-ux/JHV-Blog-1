import { site, stops } from "@/lib/site";

export default function sitemap() {
  return stops.map((s) => ({
    url: new URL(s.href, site.url).toString(),
    lastModified: site.updated,
    changeFrequency: "monthly",
    priority: s.slug ? 0.8 : 1,
  }));
}
