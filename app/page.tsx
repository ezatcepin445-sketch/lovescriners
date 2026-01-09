"use client";

import React from "react";

export const dynamic = "force-dynamic";

type Coin = {
  symbol: string;
  priceChangePercent: number;
};

export default function Page() {
  const [coins, setCoins] = React.useState<Coin[]>([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/bybit")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoins(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  return (
    <main style={{ background: "#0b0f14", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner
      </h1>

      {error && (
        <div style={{ color: "#ef4444" }}>
          Ошибка загрузки данных
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {coins.slice(0, 24).map((c) => {
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


