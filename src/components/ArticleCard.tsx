import SourceBadge from "@/components/SourceBadge";
import { formatRelativeTime } from "@/lib/format";

export interface ArticleCardProps {
  title: string;
  link: string;
  summary: string | null;
  publishedAt: Date;
  sourceName: string;
  sourceShortName: string;
  badgeColor: string;
}

export default function ArticleCard({
  title,
  link,
  summary,
  publishedAt,
  sourceShortName,
  badgeColor,
}: ArticleCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-neutral-200 px-4 py-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <SourceBadge label={sourceShortName} color={badgeColor} />
        <time className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          {formatRelativeTime(publishedAt)}
        </time>
      </div>
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {summary && (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {summary}
        </p>
      )}
    </a>
  );
}
