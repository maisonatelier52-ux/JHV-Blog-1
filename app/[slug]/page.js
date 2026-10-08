import { notFound } from "next/navigation";
import Section from "@/components/Section";
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
      <h1 className={`max-w-2xl ${titleSize}`}>{page.title}</h1>
      <div className={`mt-4 max-w-2xl space-y-3 font-body text-ink lg:mt-8 lg:space-y-5 ${bodySize}`}>
        {page.body.map((t) => <p key={t}>{t}</p>)}
      </div>
      {page.tags && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {page.tags.map((t) => <li key={t} className="rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-medium lg:text-base">{t}</li>)}
        </ul>
      )}
    </Section>
  );
}
