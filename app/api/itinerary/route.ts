import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Itinerary API endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "Create itinerary endpoint" });
}
