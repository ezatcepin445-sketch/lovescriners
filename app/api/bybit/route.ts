import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.bybit.com/v5/market/tickers?category=spot",
      {
        cache: "no-store",
      }
    );

    const text = await res.text();

    // Если Bybit вернул HTML (Cloudflare / блокировка)
    if (text.startsWith("<")) {
      return NextResponse.json([]);
    }

    const data = JSON.parse(text);

    if (!data?.result?.list) {
      return NextResponse.json([]);
    }

    const coins = data.result.list.map((c: any) => ({
      symbol: c.symbol,
      priceChangePercent: Number(c.price24hPcnt) * 100,
    }));

    return NextResponse.json(coins);
  } catch (error) {
    return NextResponse.json([]);
  }
}
