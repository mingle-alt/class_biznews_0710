import { notFound } from "next/navigation";
import TabNav from "@/components/TabNav";
import Sidebar from "@/components/Sidebar";
import MobileSourceNav from "@/components/MobileSourceNav";
import { sourcesByCategory, parseCategory } from "@/lib/sources";

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category: raw } = await params;
  const category = parseCategory(raw);
  if (!category) notFound();

  const sources = sourcesByCategory(category);

  return (
    <div className="flex min-h-screen flex-col">
      <TabNav active={category} />
      <MobileSourceNav category={category} sources={sources} />
      <div className="flex flex-1">
        <Sidebar category={category} sources={sources} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
