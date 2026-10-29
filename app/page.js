import Section from "@/components/Section";
import Words from "@/components/Words";
import JsonLd from "@/components/JsonLd";
import { person, stops } from "@/lib/site";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import { nameSize, taglineSize } from "@/lib/styles";

const home = stops[0];

export const metadata = pageMetadata(home);

export default function HomePage() {
  return (
    <Section>
      <JsonLd data={pageJsonLd(home)} />
      <p className={`max-w-lg ${taglineSize}`}>{person.tagline}</p>
      <h1 className={`mt-3 lg:mt-5 ${nameSize}`}><Words text={person.first} /><br /><Words text={person.middle} start={2} /><br /><Words text={person.last} start={4} /></h1>
    </Section>
  );
}
