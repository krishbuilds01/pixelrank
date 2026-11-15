import { NextResponse } from "next/server";
import { eventsForMonth } from "@/lib/calendar";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const now = new Date();
  const year = Number(url.searchParams.get("year") ?? now.getFullYear());
  const month = Number(url.searchParams.get("month") ?? now.getMonth() + 1);
  if (!year || month < 1 || month > 12) return NextResponse.json({ error: "Bad month" }, { status: 400 });
  return NextResponse.json({ year, month, events: await eventsForMonth(year, month) });
}
