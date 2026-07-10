"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Category, SourceMeta } from "@/lib/sources";

export default function MobileSourceNav({
  category,
  sources,
}: {
  category: Category;
  sources: SourceMeta[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = pathname.split("/")[2] ?? "";

  return (
    <div className="border-b border-neutral-200 px-4 py-2 md:hidden dark:border-neutral-800">
      <select
        value={activeSlug}
        onChange={(e) => {
          const value = e.target.value;
          router.push(value ? `/${category}/${value}` : `/${category}`);
        }}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      >
        <option value="">전체보기</option>
        {sources.map((source) => (
          <option key={source.slug} value={source.slug}>
            {source.name}
          </option>
        ))}
      </select>
    </div>
  );
}
