import { jsonLdString } from "@/lib/seo";

// Renders one JSON-LD block (structured data for search engines). Server component, so it is in the HTML on first load.
export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
