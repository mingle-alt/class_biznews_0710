import ArticleCard from "@/components/ArticleCard";
import { findSource } from "@/lib/sources";

interface FeedArticle {
  id: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: Date;
  source: {
    name: string;
    slug: string;
    badgeColor: string;
  };
}

export default function FeedList({ articles }: { articles: FeedArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-sm text-neutral-400 dark:text-neutral-500">
        아직 수집된 기사가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          link={article.link}
          summary={article.summary}
          publishedAt={article.publishedAt}
          sourceName={article.source.name}
          sourceShortName={findSource(article.source.slug)?.shortName ?? article.source.name}
          badgeColor={article.source.badgeColor}
        />
      ))}
    </div>
  );
}
