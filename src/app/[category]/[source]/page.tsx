import { notFound } from "next/navigation";
import FeedList from "@/components/FeedList";
import { getArticles } from "@/lib/queries";
import { findSource, parseCategory } from "@/lib/sources";

export default async function SourcePage({
  params,
}: {
  params: Promise<{ category: string; source: string }>;
}) {
  const { category: raw, source: sourceSlug } = await params;
  const category = parseCategory(raw);
  if (!category) notFound();

  const source = findSource(sourceSlug);
  if (!source || source.category !== category) notFound();

  const articles = await getArticles(category, sourceSlug);

  return <FeedList articles={articles} />;
}
