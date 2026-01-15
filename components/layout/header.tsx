"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { Moon, Sun, Scissors } from "lucide-react";
import { APP_NAME, IS_MARKETPLACE_MODE } from "@/lib/config";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Scissors className="h-6 w-6" />
            <span>{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-6">
            {IS_MARKETPLACE_MODE && (
              <Link
                href="/barbers"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
              >
                Browse Barbers
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Dashboard
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
