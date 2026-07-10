import "dotenv/config";
import Parser from "rss-parser";
import { prisma } from "@/lib/db";
import { translateToKorean } from "@/lib/translate";

const USER_AGENT =
  process.env.FEED_USER_AGENT ??
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const FETCH_TIMEOUT_MS = 10_000;
const ARTICLE_RETENTION_DAYS = 90;

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    "User-Agent": USER_AGENT,
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

function toSummary(description?: string): string | null {
  if (!description) return null;
  const text = description.replace(/<[^>]+>/g, "").trim();
  return text.length > 0 ? text.slice(0, 500) : null;
}

async function fetchSource(source: {
  id: string;
  slug: string;
  name: string;
  category: string;
  feedUrl: string;
}) {
  try {
    const feed = await parser.parseURL(source.feedUrl);

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const existing = await prisma.article.findUnique({ where: { link: item.link } });
      if (existing) continue;

      const publishedAt = item.isoDate
        ? new Date(item.isoDate)
        : item.pubDate
          ? new Date(item.pubDate)
          : new Date();

      let title = item.title;
      let summary = toSummary(item.contentSnippet ?? item.summary ?? item.content);

      if (source.category === "global") {
        const translated = await translateToKorean(title, summary);
        title = translated.title;
        summary = translated.summary;
      }

      await prisma.article.create({
        data: {
          title,
          link: item.link,
          summary,
          publishedAt,
          sourceId: source.id,
        },
      });
    }

    await prisma.$transaction([
      prisma.source.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date() },
      }),
      prisma.fetchLog.create({
        data: {
          sourceId: source.id,
          status: "success",
          itemCount: feed.items.length,
        },
      }),
    ]);

    console.log(`[ok] ${source.name}: ${feed.items.length} items processed`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await prisma.fetchLog.create({
      data: {
        sourceId: source.id,
        status: "error",
        message,
      },
    });

    console.error(`[fail] ${source.name}: ${message}`);
  }
}

async function pruneOldArticles() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - ARTICLE_RETENTION_DAYS);

  const { count } = await prisma.article.deleteMany({
    where: { publishedAt: { lt: cutoff } },
  });

  if (count > 0) {
    console.log(`[prune] removed ${count} articles older than ${ARTICLE_RETENTION_DAYS} days`);
  }
}

async function main() {
  const sources = await prisma.source.findMany({ where: { isActive: true } });

  console.log(`Fetching ${sources.length} active sources...`);

  const results = await Promise.allSettled(sources.map(fetchSource));

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) {
    console.error(`${failed} source(s) threw unexpectedly (outside per-source handling)`);
  }

  await pruneOldArticles();
}

main()
  .catch((err) => {
    console.error("Fatal error in fetch-feeds:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
