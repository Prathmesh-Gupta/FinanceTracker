"use client";

import { useCurrency } from "@/context/CurrencyContext";
import type { Currency } from "@/context/CurrencyContext";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Currency:</span>

      <select
        value={currency}
        onChange={(e) =>
          setCurrency(e.target.value as Currency)
        }
        className="bg-black border border-white/20 rounded px-2 py-1 text-sm"
      >
        <option value="INR">🇮🇳 INR</option>
        <option value="USD">🇺🇸 USD</option>
        <option value="EUR">🇪🇺 EUR</option>
        <option value="GBP">🇬🇧 GBP</option>
        <option value="JPY">🇯🇵 JPY</option>
      </select>
    </div>
  );
}
