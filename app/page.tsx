"use client";

import { useEffect, useState } from "react";

type Coin = {
  symbol: string;
  priceChangePercent: number;
};

export default function Page() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.bybit.com/v5/public/spot");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: "subscribe",
          args: ["tickers.BTCUSDT", "tickers.ETHUSDT", "tickers.SOLUSDT"]
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.data) {
        const c = data.data;

        setCoins((prev) => {
          const filtered = prev.filter((x) => x.symbol !== c.symbol);
          return [
            ...filtered,
            {
              symbol: c.symbol,
              priceChangePercent: Number(c.price24hPcnt) * 100,
            },
          ];
        });

        setLoading(false);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <main
      style={{
        background: "#0b0f14",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner
      </h1>

      {loading && (
        <div style={{ color: "#9ca3af" }}>
          Loading market data...
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        {coins.map((c) => {
          const change = c.priceChangePercent;

          return (
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

              <div
                style={{
                  marginTop: 6,
                  color: change >= 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {change.toFixed(2)}%
              </div>

              {change > 5 && (
                <div style={{ marginTop: 8, color: "#22c55e" }}>
                  🚀 PUMPING
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

  );
}
