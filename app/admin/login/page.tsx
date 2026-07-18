"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen islamic-pattern bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/30 dark:via-card dark:to-amber-950/30 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Islamic decorative top bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-5 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/30">
                <Star className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Hijab Paradise
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Masuk ke dashboard admin
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-5 py-3 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Admin
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hijabparadise.com"
                  className="w-full px-5 py-3 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full px-5 py-3 pr-12 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                ← Kembali ke Toko
              </Link>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; 2026 Hijab Paradise. All rights reserved.
        </p>
      </div>
    </div>
  );
}
