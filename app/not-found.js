import Section from "@/components/Section";
import { bodySize, titleSize } from "@/lib/styles";

export default function NotFound() {
  return (
    <Section>
      <h1 className={`max-w-2xl ${titleSize}`}>This page could not be found.</h1>
      <p className={`mt-4 max-w-2xl font-body text-ink lg:mt-8 ${bodySize}`}>The address may have changed, or the page may never have existed.</p>
    </Section>
  );
}
