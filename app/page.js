import Section from "@/components/Section";
import Words from "@/components/Words";
import { person } from "@/lib/site";
import { bodySize, nameSize } from "@/lib/styles";

export default function HomePage() {
  return (
    <Section>
      <p className={`max-w-lg font-body italic ${bodySize}`}>{person.tagline}</p>
      <h1 className={`mt-3 lg:mt-5 ${nameSize}`}><Words text={person.first} /><br /><Words text={person.middle} start={2} /><br /><Words text={person.last} start={4} /></h1>
    </Section>
  );
}
