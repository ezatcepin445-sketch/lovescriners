"use client";
export const dynamic = "force-dynamic";

type Coin = {
  symbol: string;
  priceChangePercent: string;
};

async function getCoins(): Promise<Coin[]> {
  const res = await fetch(
    "https://api.binance.com/api/v3/ticker/24hr",
    { cache: "no-store" }
  );
  return res.json();
}

export default async function Page() {
  const coins = await getCoins();

  return (
    <main style={{ background: "#0b0f14", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>
        ❤️ LoveScriner
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {coins.slice(0, 24).map((c) => {
          const change = parseFloat(c.priceChangePercent);

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

