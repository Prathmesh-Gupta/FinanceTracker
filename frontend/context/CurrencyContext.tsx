"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Currency = "INR" | "USD" | "EUR" | "GBP" | "JPY";

interface CurrencyContextType {
  currency: Currency;
  symbol: string;
  rate: number;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [rate, setRate] = useState<number>(1);

  // Fetch exchange rate whenever currency changes
  useEffect(() => {
    const fetchRate = async () => {
      if (currency === "INR") {
        setRate(1);
        return;
      }

      try {
        const res = await fetch(
          `https://api.exchangerate-api.com/v4/latest/INR`
        );
        const data = await res.json();
        setRate(data.rates[currency]);
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
        setRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  const convertAmount = (amount: number) => {
    return amount * rate;
  };

  const symbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
      ? "$"
      : "€";

  return (
    <CurrencyContext.Provider
      value={{ currency, symbol, rate, setCurrency, convertAmount }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return context;
}
