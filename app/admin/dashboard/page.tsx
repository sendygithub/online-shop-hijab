"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    name: string;
    image: string | null;
  };
}

interface Order {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
      fetchStats();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "processing":
        return "Diproses";
      case "shipped":
        return "Dikirim";
      case "delivered":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30">
        <div className="text-center">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-amber-50/50 dark:from-emerald-950/20 dark:to-amber-950/20 islamic-pattern">
      {/* Top Navigation */}
      <header className="bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50 sticky top-0 z-50">
        <div className="h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Hijab Paradise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/add-product"
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors font-medium"
              >
                Lihat Toko
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm p-6 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl shadow-sm p-6 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendapatan</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {stats.totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl shadow-sm p-6 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Produk</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl shadow-sm p-6 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Daftar Pesanan
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari pesanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="processing">Diproses</option>
                  <option value="shipped">Dikirim</option>
                  <option value="delivered">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="relative inline-block">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground mt-3">Memuat pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id,
                          )
                        }
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <div>
                        <p className="font-semibold text-foreground">
                          {order.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.email} • {order.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <p className="font-bold text-foreground">
                        Rp {order.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrder === order.id && (
                    <div className="ml-9 mt-4 space-y-4">
                      {/* Shipping Info */}
                      <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-500" />
                          Informasi Pengiriman
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {order.address}, {order.city} - {order.postalCode}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Pesanan:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          Item Pesanan
                        </h4>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-white dark:bg-card border border-border/30 rounded-xl p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden">
                                {item.product.image && (
                                  <img
                                    src={
                                      item.product.image || "/placeholder.svg"
                                    }
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Ukuran: {item.size} x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              Rp{" "}
                              {(item.price * item.quantity).toLocaleString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-2 pt-2">
                        <label className="text-sm text-muted-foreground">
                          Ubah Status:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="px-3 py-1.5 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 bg-muted/50 dark:bg-input text-foreground"
                        >
                          <option value="pending">Menunggu</option>
                          <option value="processing">Diproses</option>
                          <option value="shipped">Dikirim</option>
                          <option value="delivered">Selesai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
