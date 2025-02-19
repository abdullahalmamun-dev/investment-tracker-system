"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Wallet,
  PiggyBank,
  LineChart,
  Bell,
  FileText,
  Settings,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Profit & Loss",
    icon: Wallet,
    href: "/transactions",
    color: "text-violet-500",
  },
  {
    label: "Reports",
    icon: FileText,
    href: "/reports",
    color: "text-rose-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="flex md:hidden items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Investment Tracker</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div
        className={cn(
          "space-y-4 py-4 flex flex-col h-full bg-gray-50 dark:bg-gray-900",
          isMobileMenuOpen ? "block" : "hidden md:block"
        )}
      >
        <div className="px-3 py-2 flex-1">
          <h2 className="hidden md:block text-lg font-semibold tracking-tight mb-4">
            Investment Tracker
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
