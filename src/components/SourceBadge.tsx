const BADGE_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

const FALLBACK_CLASSES = "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

export default function SourceBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-medium tracking-tight ${
        BADGE_CLASSES[color] ?? FALLBACK_CLASSES
      }`}
    >
      {label}
    </span>
  );
}
