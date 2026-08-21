import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { getPage } from "@/lib/db/queries";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: pageHandle } = await props.params;
  const page = await getPage(pageHandle);

  if (!page) return notFound();

  return {
    title: `${page.seo?.title || page.title} | স্বস্থ্যকর`,
    description: page.seo?.description || page.bodySummary,
  };
}

export default async function CMSPage(props: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageHandle } = await props.params;
  const page = await getPage(pageHandle);

  if (!page) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
        {page.title}
      </h1>
      <Prose className="leading-relaxed" html={page.body} />
    </div>
  );
}
