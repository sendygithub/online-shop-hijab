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
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/app/context/cart-context";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onNavigateCart?: () => void;
}

export default function Header({ onNavigateCart }: HeaderProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    <>
      <header className="bg-white/95 dark:bg-card/95 backdrop-blur-xl sticky top-0 z-50 border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                <Star className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base md:text-lg text-foreground leading-tight">
                  Hijab
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Paradise
                  </span>
                </h1>
                <p className="text-[9px] md:text-[10px] text-muted-foreground tracking-widest uppercase">
                  Muslim Fashion
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop/Tablet */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Cari hijab, gamis, pashmina..."
                  className="w-full pl-5 pr-12 py-2.5 bg-muted/60 dark:bg-input border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-foreground placeholder:text-muted-foreground transition-all"
                />
                <Search className="absolute right-4 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>

              {/* Dark Mode Toggle - hidden on small mobile, shown on tablet+ */}
              <button
                onClick={toggleDarkMode}
                className="hidden sm:flex p-2.5 hover:bg-muted rounded-xl transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={onNavigateCart}
                className="relative p-2.5 hover:bg-muted rounded-xl transition-colors"
                aria-label="Keranjang"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-emerald-300/50 dark:shadow-emerald-800/50 badge-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Account - Desktop */}
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="p-2.5 hover:bg-muted rounded-xl transition-colors"
                >
                  <User className="w-5 h-5 text-foreground" />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-card border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
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

                    <nav className="p-2">
                      <Link
                        href="/"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <Home className="w-4 h-4 text-emerald-500" />
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
            <div className="md:hidden mt-3 animate-slide-up">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari hijab, gamis, pashmina..."
                  className="w-full pl-5 pr-12 py-3 bg-muted/60 dark:bg-input border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm text-foreground placeholder:text-muted-foreground transition-all"
                />
                <Search className="absolute right-4 top-3.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-card/95 backdrop-blur-xl border-t border-border/60 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 p-2 text-emerald-600 dark:text-emerald-400 min-w-[64px]"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Beranda</span>
          </Link>
          <button
            onClick={() => setShowMobileSearch(true)}
            className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground hover:text-foreground min-w-[64px]"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Cari</span>
          </button>
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-0.5 p-2 text-muted-foreground hover:text-foreground min-w-[64px]"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-2 bg-emerald-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[4px] flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <span className="text-[10px] font-medium">Keranjang</span>
          </Link>
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground hover:text-foreground min-w-[64px]"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Akun</span>
          </button>
        </div>
      </nav>
    </>
  );
}
