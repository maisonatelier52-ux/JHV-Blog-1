import Section from "@/components/Section";
import { person } from "@/lib/site";
import { bodySize, nameSize } from "@/lib/styles";

export default function HomePage() {
  return (
    <Section>
      <p className={`max-w-lg font-body italic text-ink ${bodySize}`}>{person.tagline}</p>
      <h1 className={`mt-3 lg:mt-5 ${nameSize}`}>{person.first}<br />{person.middle}<br />{person.last}</h1>
    </Section>
  );
}
