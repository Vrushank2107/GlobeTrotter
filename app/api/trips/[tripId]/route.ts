import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Trip detail API endpoint" });
}

export async function PUT() {
  return NextResponse.json({ message: "Update trip endpoint" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Delete trip endpoint" });
}
