import { NextResponse } from "next/server";
import { boardRows } from "@/lib/board";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const scope = url.searchParams.get("scope") ?? "global";
  let rows = await boardRows();
  if (scope === "college") { const c = url.searchParams.get("college"); if (c) rows = rows.filter((r) => r.college.toLowerCase() === c.toLowerCase()); }
  if (scope === "country") { const c = url.searchParams.get("country"); if (c) rows = rows.filter((r) => r.country.toLowerCase() === c.toLowerCase()); }
  const branch = url.searchParams.get("branch"); if (branch) rows = rows.filter((r) => r.branch === branch);
  const batch = url.searchParams.get("batch"); if (batch) rows = rows.filter((r) => String(r.batch) === batch);
  return NextResponse.json({ rows: rows.slice(0, 100) });
}
