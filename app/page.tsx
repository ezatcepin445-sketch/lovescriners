"use client";

import { useEffect, useState } from "react";

type Coin = {
  symbol: string;
  priceChangePercent: string;
};

export default function Page() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          fetch("/api/bybit")
        );
        const data = await res.json();

        // ✅ защита от ошибки Binance
        if (Array.isArray(data)) {
          setCoins(data);
        } else {
          console.error("Binance error:", data);
          setCoins([]);
        }
      } catch (e) {
        console.error(e);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main style={{ background: "#0b0f14", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner
      </h1>

      {loading && (
        <div style={{ color: "#9ca3af" }}>Loading market...</div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {coins.slice(0, 24).map((c) => {
          const change = Number(c.priceChangePercent);

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
                  color: change >= 0 ? "#22c55e" : "#ef4444",
                  marginTop: 6,
                }}
              >
                {change.toFixed(2)}%
              </div>

              {change > 10 && (
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


