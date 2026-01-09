import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.bybit.com/v5/market/tickers?category=spot"
  );

  const data = await res.json();

  const coins = data.result.list.map((c: any) => ({
    symbol: c.symbol,
    priceChangePercent: Number(c.price24hPcnt) * 100,
  }));

  return NextResponse.json(coins);
}
