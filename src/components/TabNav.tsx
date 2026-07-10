import Link from "next/link";
import { CATEGORY_LABEL, type Category } from "@/lib/sources";

const CATEGORIES: Category[] = ["domestic", "global"];

export default function TabNav({ active }: { active: Category }) {
  return (
    <nav className="flex gap-1 border-b border-neutral-200 px-4 dark:border-neutral-800">
      {CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <Link
            key={category}
            href={`/${category}`}
            className={`-mb-px border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                : "border-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            }`}
          >
            {CATEGORY_LABEL[category]}
          </Link>
        );
      })}
    </nav>
  );
}
