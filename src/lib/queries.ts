import { prisma } from "@/lib/db";
import type { Category } from "@/lib/sources";

export async function getArticles(category: Category, sourceSlug?: string) {
  return prisma.article.findMany({
    where: {
      source: {
        category,
        ...(sourceSlug ? { slug: sourceSlug } : {}),
      },
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });
}

export async function getSourceHealth() {
  return prisma.source.findMany({
    select: {
      slug: true,
      name: true,
      isActive: true,
      lastFetchedAt: true,
      _count: { select: { articles: true } },
    },
    orderBy: { name: "asc" },
  });
}
