import "dotenv/config";
import { prisma } from "@/lib/db";
import { SOURCES } from "@/lib/sources";

async function main() {
  for (const source of SOURCES) {
    await prisma.source.upsert({
      where: { slug: source.slug },
      update: {
        name: source.name,
        category: source.category,
        feedUrl: source.feedUrl,
        badgeColor: source.badgeColor,
        isActive: true,
      },
      create: {
        slug: source.slug,
        name: source.name,
        category: source.category,
        feedUrl: source.feedUrl,
        badgeColor: source.badgeColor,
      },
    });
  }

  const { count } = await prisma.source.updateMany({
    where: { slug: { notIn: SOURCES.map((s) => s.slug) }, isActive: true },
    data: { isActive: false },
  });

  console.log(`Seeded ${SOURCES.length} sources. Deactivated ${count} removed source(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
