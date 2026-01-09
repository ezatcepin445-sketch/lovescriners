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
          args: ["tickers.*"],
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (!msg?.data) return;

      const list = Array.isArray(msg.data) ? msg.data : [msg.data];

      setCoins((prev) => {
        const updated = { ...prev };

        for (const t of list) {
          const symbol = t.symbol;
          const price = Number(t.lastPrice);
          const change = Number(t.price24hPcnt) * 100;

          if (!symbol || !price) continue;

          const history = updated[symbol]
            ? [...updated[symbol].history.slice(-19), price]
            : [price];

          updated[symbol] = {
            symbol,
            price,
            change,
            history,
          };
        }

        return updated;
      });
    };

    return () => ws.close();
  }, []);

  const coinsArray = Object.values(coins).slice(0, 24);

  return (
    <main style={{ background: "#0b0f14", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner
      </h1>

      {coinsArray.length === 0 && (
        <div style={{ color: "#64748b" }}>Loading market...</div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {coinsArray.map((c) => (
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

            <div style={{ fontSize: 13, marginTop: 4 }}>
              ${c.price.toFixed(6)}
            </div>

            <div
              style={{
                color: c.change >= 0 ? "#22c55e" : "#ef4444",
                marginTop: 6,
              }}
            >
              {c.change.toFixed(2)}%
            </div>

            {c.change > 10 && (
              <div style={{ marginTop: 6, color: "#22c55e" }}>
                🚀 PUMPING
              </div>
            )}

            {c.change < -10 && (
              <div style={{ marginTop: 6, color: "#ef4444" }}>
                💀 DUMPING
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

