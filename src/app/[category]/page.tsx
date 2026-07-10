import { notFound } from "next/navigation";
import FeedList from "@/components/FeedList";
import { getArticles } from "@/lib/queries";
import { parseCategory } from "@/lib/sources";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: raw } = await params;
  const category = parseCategory(raw);
  if (!category) notFound();

  const articles = await getArticles(category);

  return <FeedList articles={articles} />;
}
