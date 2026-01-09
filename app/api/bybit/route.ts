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

    // 👇 если Bybit вернул HTML — не ломаем билд
    if (text.startsWith("<")) {
      return NextResponse.json([]);
    }

    const data = JSON.parse(tex
