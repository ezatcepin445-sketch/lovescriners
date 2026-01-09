"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

      const data = Array.isArray(msg.data) ? msg.data : [msg.data];

      setCoins((prev) => {
        const updated = { ...prev };

        for (const t of data) {
          const symbol = t.symbol;
          const price = parseFloat(t.lastPrice || "0");
          const change = parseFloat(t.price24hPcnt || "0") * 100;

          if (!symbol || !price) continue;

          const prevCoin = updated[symbol];

          const history = prevCoin
            ? [...prevCoin.history.slice(-19), price]
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
    <main
      style={{
        background: "#0b0f14",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Inter, sans-serif",
      }}
    >
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
          <motion.div
            key={c.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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

            {/* mini chart */}
            <svg width="100%" height="40" style={{ marginTop: 8 }}>
              <polyline
                fill="none"
                stroke={c.change >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                points={c.history
                  .map((p, i) => `${i * 10},${40 - p}`)
                  .join(" ")}
              />
            </svg>

            {/* badges */}
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

            {Math.abs(c.change) > 15 && (
              <div style={{ marginTop: 4, color: "#facc15" }}>
                ⚠️ HIGH RISK
              </div>
            )}

            {c.history.length < 5 && (
              <div style={{ marginTop: 4, color: "#38bdf8" }}>
                🆕 NEW
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
