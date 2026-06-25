"use client";

import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Plus,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/cart-context";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onNavigateCart: () => void;
}

export default function Header({ onNavigateCart }: HeaderProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { getTotalItems } = useCart();
  const { isDark, toggleDarkMode, mounted } = useDarkMode();
  const { data: session } = useSession();
  const cartCount = getTotalItems();

  if (!mounted) return null;

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="bg-white dark:bg-card sticky top-0 z-50 shadow-lg">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                HP
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  Hijab Paradise
                </h1>
                <p className="text-xs text-muted-foreground">
                  Pakaian Muslim Modern
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-input text-foreground"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-foreground" />
                ) : (
                  <Moon className="w-6 h-6 text-foreground" />
                )}
              </button>

              <button className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors">
                <Heart className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={onNavigateCart}
                className="relative p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                >
                  <User className="w-6 h-6 text-foreground" />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">
                        {session?.user?.name || "Guest User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session?.user?.email || "Belum login"}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                    <nav className="p-2">
                      <Link
                        href="/"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors"
                      >
                        Beranda
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors"
                      >
                        Keranjang
                      </Link>

                      {isAdmin && (
                        <>
                          <hr className="my-2 border-border" />
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setShowAccountMenu(false)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard Admin
                          </Link>
                          <Link
                            href="/admin/add-product"
                            onClick={() => setShowAccountMenu(false)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Produk
                          </Link>
                        </>
                      )}

                      <hr className="my-2 border-border" />

                      {session ? (
                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            signOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors font-semibold flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      ) : (
                        <Link
                          href="/admin/login"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-2 text-sm text-primary hover:bg-muted dark:hover:bg-muted rounded-md transition-colors font-semibold"
                        >
                          Masuk Admin
                        </Link>
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
