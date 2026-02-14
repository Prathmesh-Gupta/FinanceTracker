"use client";

import "./globals.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  TrendingUp,
  Target,
  Menu,
} from "lucide-react";

import { CurrencyProvider } from "@/context/CurrencyContext";
import CurrencySwitcher from "@/components/CurrencySwitcher";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/investments", label: "Investments", icon: TrendingUp },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <CurrencyProvider>
          <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <aside
              className={`bg-black/40 backdrop-blur-lg border-r border-white/10
              transition-all duration-300
              ${open ? "w-64" : "w-20"}`}
            >
              <div className="p-4 flex items-center justify-between">
                {open && (
                  <h1 className="font-bold text-lg whitespace-nowrap">
                    Finance App
                  </h1>
                )}

                <button
                  onClick={() => setOpen(!open)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <Menu size={20} />
                </button>
              </div>

              <nav className="mt-4 space-y-2 px-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    Icon={item.icon}
                    open={open}
                  />
                ))}
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">
              <div className="flex justify-end mb-4">
                <CurrencySwitcher />
              </div>

              {children}
            </main>

          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}

function NavItem({
  href,
  label,
  Icon,
  open,
}: {
  href: string;
  label: string;
  Icon: any;
  open: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${active ? "bg-white/20" : "hover:bg-white/10"}`}
    >
      <Icon size={20} />

      {open && (
        <span className="text-sm whitespace-nowrap">
          {label}
        </span>
      )}

      {!open && (
        <span className="absolute left-16 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}
