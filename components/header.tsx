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
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/app/context/cart-context";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useSession, signOut } from "next-auth/react";
import CartDropdown from "@/components/cart-dropdown";

interface HeaderProps {
  onNavigateCart?: () => void;
}

export default function Header({ onNavigateCart }: HeaderProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const { getTotalItems } = useCart();
  const { isDark, toggleDarkMode, mounted } = useDarkMode();
  const { data: session } = useSession();
  const cartCount = getTotalItems();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="bg-white/95 dark:bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      {/* Islamic decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 group-hover:shadow-xl transition-shadow">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground leading-tight">
                  Hijab
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Paradise
                  </span>
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-wide uppercase">
                  Pakaian Muslim Modern
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari produk muslim..."
                  className="w-full px-5 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground text-sm transition-all"
                />
                <Search className="absolute right-4 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* Favorites */}
              <button className="p-2.5 hover:bg-muted rounded-xl transition-colors relative">
                <Heart className="w-5 h-5 text-foreground" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCartDropdown(true)}
                className="relative p-2.5 hover:bg-muted rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="p-2.5 hover:bg-muted rounded-xl transition-colors"
                >
                  <User className="w-5 h-5 text-foreground" />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-card border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info */}
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || "G"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {session?.user?.name || "Guest User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session?.user?.email || "Belum login"}
                          </p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] rounded-full font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="p-2">
                      <Link
                        href="/"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <Star className="w-4 h-4 text-emerald-500" />
                        Beranda
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 text-emerald-500" />
                        Keranjang
                      </Link>

                      {isAdmin && (
                        <>
                          <hr className="my-1 border-border/50" />
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setShowAccountMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                            Dashboard Admin
                          </Link>
                          <Link
                            href="/admin/add-product"
                            onClick={() => setShowAccountMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                          >
                            <Plus className="w-4 h-4 text-emerald-500" />
                            Tambah Produk
                          </Link>
                        </>
                      )}

                      <hr className="my-1 border-border/50" />

                      {session ? (
                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      ) : (
                        <Link
                          href="/admin/login"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors font-semibold"
                        >
                          <User className="w-4 h-4" />
                          Masuk Admin
                        </Link>
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="md:hidden mt-3 animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari produk muslim..."
                  className="w-full px-5 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground text-sm"
                />
                <Search className="absolute right-4 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Dropdown */}
      <CartDropdown
        isOpen={showCartDropdown}
        onClose={() => setShowCartDropdown(false)}
      />
    </header>
  );
}
