import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Expenses API endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "Create expense endpoint" });
}
