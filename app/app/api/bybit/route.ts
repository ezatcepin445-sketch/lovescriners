import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.bybit.com/v5/market/tickers?category=spot",
    { cache: "no-store" }
  );

  const json = await res.json();

  if (!json?.result?.list) {
    return NextResponse.json([]);
  }

  const coins = json.result.list.map((c: any) => ({
    symbol: c.symbol,
    priceChangePercent: String(Number(c.price24hPcnt) * 100),
  }));

  return NextResponse.json(coins);
}

