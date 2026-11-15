import { NextResponse } from "next/server";
import { collegeRows } from "@/lib/board";
export async function GET() { return NextResponse.json({ colleges: collegeRows() }); }
