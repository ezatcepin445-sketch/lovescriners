"use client";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        color: "white",
        fontFamily: "system-ui, -apple-system",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>
        ❤️ LoveScriner
      </h1>

      <p style={{ color: "#9ca3af" }}>
        Build successful. Project is alive.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 12,
          background: "#020617",
          border: "1px solid #1f2937",
          maxWidth: 320,
        }}
      >
        <strong>BTCUSDT</strong>
        <div style={{ color: "#22c55e", marginTop: 6 }}>
          +4.23%
        </div>
      </div>
    </main>
  );
}
