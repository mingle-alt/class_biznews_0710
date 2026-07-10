import { NextResponse } from "next/server";
import { getSourceHealth } from "@/lib/queries";

export async function GET() {
  try {
    const sources = await getSourceHealth();
    return NextResponse.json({
      status: "ok",
      sources: sources.map((s) => ({
        slug: s.slug,
        name: s.name,
        isActive: s.isActive,
        lastFetchedAt: s.lastFetchedAt,
        articleCount: s._count.articles,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", message }, { status: 503 });
  }
}
