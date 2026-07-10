export type Category = "domestic" | "global";

export interface SourceMeta {
  slug: string;
  name: string;
  shortName: string;
  category: Category;
  feedUrl: string;
  badgeColor: string;
}

export const SOURCES: SourceMeta[] = [
  {
    slug: "moef",
    name: "기획재정부",
    shortName: "기재부",
    category: "domestic",
    feedUrl: "https://www.moef.go.kr/com/detailRssTagService.do?bbsId=MOSFBBS_000000000028",
    badgeColor: "indigo",
  },
  {
    slug: "fed",
    name: "Federal Reserve",
    shortName: "Fed",
    category: "global",
    feedUrl: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    badgeColor: "emerald",
  },
  {
    slug: "ft",
    name: "Financial Times",
    shortName: "FT",
    category: "global",
    feedUrl: "https://www.ft.com/global-economy?format=rss",
    badgeColor: "amber",
  },
  {
    slug: "economist",
    name: "The Economist",
    shortName: "Economist",
    category: "global",
    feedUrl: "https://www.economist.com/finance-and-economics/rss.xml",
    badgeColor: "teal",
  },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  domestic: "국내 경제",
  global: "해외 경제",
};

export function sourcesByCategory(category: Category): SourceMeta[] {
  return SOURCES.filter((s) => s.category === category);
}

export function findSource(slug: string): SourceMeta | undefined {
  return SOURCES.find((s) => s.slug === slug);
}

export function parseCategory(value: string): Category | null {
  return value === "domestic" || value === "global" ? value : null;
}
