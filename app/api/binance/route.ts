import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.bybit.com/v5/market/tickers?category=spot",
    { cache: "no-store" }
  );

  const json = await res.json();

  const coins = json.result.list.map((c: any) => ({
    symbol: c.symbol,
    priceChangePercent: c.price24hPcnt,
  }));

  return NextResponse.json(coins);
}
