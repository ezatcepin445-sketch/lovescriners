import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.binance.com/api/v3/ticker/24hr",
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
