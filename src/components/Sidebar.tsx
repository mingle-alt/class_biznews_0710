"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category, SourceMeta } from "@/lib/sources";

function itemClasses(isActive: boolean) {
  return `block rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? "bg-neutral-900 font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
  }`;
}

export default function Sidebar({
  category,
  sources,
}: {
  category: Category;
  sources: SourceMeta[];
}) {
  const pathname = usePathname();
  const activeSlug = pathname.split("/")[2];

  return (
    <aside className="hidden w-48 shrink-0 border-r border-neutral-200 py-4 md:block dark:border-neutral-800">
      <nav className="flex flex-col gap-0.5 px-2">
        <Link href={`/${category}`} className={itemClasses(!activeSlug)}>
          전체보기
        </Link>
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={`/${category}/${source.slug}`}
            className={itemClasses(activeSlug === source.slug)}
          >
            {source.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
