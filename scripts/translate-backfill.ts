import "dotenv/config";
import { prisma } from "@/lib/db";
import { translateToKorean } from "@/lib/translate";

const KOREAN_RE = /[가-힣]/;

async function main() {
  const allArticles = await prisma.article.findMany({
    where: { source: { category: "global" } },
    select: { id: true, title: true, summary: true },
  });

  const articles = allArticles.filter((a) => !KOREAN_RE.test(a.title));

  console.log(
    `${allArticles.length} global articles total, ${articles.length} still need translation...`,
  );

  let done = 0;
  let failed = 0;
  for (const article of articles) {
    const translated = await translateToKorean(article.title, article.summary);

    if (!KOREAN_RE.test(translated.title)) {
      failed += 1;
      console.log(`  [skip] still untranslated: ${article.title.slice(0, 60)}`);
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { title: translated.title, summary: translated.summary },
    });

    done += 1;
    if (done % 10 === 0) console.log(`  ${done}/${articles.length}`);
  }

  console.log(`Done. Attempted ${done}, ${done - failed} translated, ${failed} still failed.`);
}

main()
  .catch((err) => {
    console.error("Fatal error in translate-backfill:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
