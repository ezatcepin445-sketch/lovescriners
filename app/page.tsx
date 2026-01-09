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
          gridTemplateColumns: "repeat(a
