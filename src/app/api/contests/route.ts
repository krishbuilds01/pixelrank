import { NextResponse } from "next/server";
import { getContests } from "@/lib/contests";
export async function GET() { return NextResponse.json({ contests: await getContests() }); }
