import { notFound } from "next/navigation";
import Section from "@/components/Section";
import Words from "@/components/Words";
import { stops } from "@/lib/site";
import { bodySize, titleSize } from "@/lib/styles";

const pages = stops.filter((s) => s.slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages.find((s) => s.slug === slug);
  return { title: page?.nav };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = pages.find((s) => s.slug === slug);
  if (!page) notFound();

  return (
    <Section>
      <h1 className={`max-w-2xl ${titleSize}`}><Words text={page.title} /></h1>
      <div className={`mt-3 max-w-2xl space-y-2 lg:mt-8 lg:space-y-5 ${bodySize}`}>
        {page.body.map((t) => <p key={t}>{t}</p>)}
      </div>
      {page.tags && (
        <ul className="mt-3 flex flex-wrap gap-1.5 lg:mt-5 lg:gap-2">
          {page.tags.map((t) => <li key={t} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white lg:border-ink/20 lg:bg-white lg:px-4 lg:py-2 lg:text-base lg:text-ink">{t}</li>)}
        </ul>
      )}
    </Section>
  );
}
