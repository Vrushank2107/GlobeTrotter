import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Trips API endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "Create trip endpoint" });
}
