"use client";

import { useEffect, useState } from "react";

type Coin = {
  symbol: string;
  price: number;
  change: number;
  history: number[];
};

export default function Page() {
  const [coins, setCoins] = useState<Record<string, Coin>>({});

  useEffect(() => {
    const ws = new WebSocket("wss://stream.bybit.com/v5/public/spot");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: "subscribe",
          args: [
            "tickers.BTCUSDT",
            "tickers.ETHUSDT",
            "tickers.SOLUSDT",
            "tickers.DOGEUSDT",
            "tickers.PEPEUSDT",
          ],
        })
      );
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (!msg.data) return;

      const d = msg.data;
      const price = Number(d.lastPrice);
      const change = Number(d.price24hPcnt) * 100;

      setCoins((prev) => {
        const prevHistory = prev[d.symbol]?.history || [];
        const history = [...prevHistory.slice(-19), price];

        return {
          ...prev,
          [d.symbol]: {
            symbol: d.symbol,
            price,
            change,
            history,
          },
        };
      });
    };

    return () => ws.close();
  }, []);

  return (
    <main style={{ background: "#0b0f14", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner (LIVE)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
        }}
      >
        {Object.values(coins).map((c) => (
          <div
            key={c.symbol}
            style={{
              background: "#020617",
              border: "1px solid #1f2937",
              borderRadius: 14,
              padding: 14,
              color: "white",
            }}
          >
            <strong>{c.symbol}</strong>

            <div style={{ fontSize: 18, marginTop: 6 }}>
              ${c.price.toFixed(6)}
            </div>

            <div
              style={{
                color: c.change >= 0 ? "#22c55e" : "#ef4444",
                marginTop: 4,
              }}
            >
              {c.change.toFixed(2)}%
            </div>

            {c.change > 10 && (
              <div style={{ marginTop: 6, color: "#22c55e" }}>
                🚀 PUMPING
              </div>
            )}

            <MiniChart data={c.history} />
          </div>
        ))}
      </div>
    </main>
  );
}

/* ---------- мини-график ---------- */

function MiniChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: 50 }}>
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
      />
    </svg>
  );
}
