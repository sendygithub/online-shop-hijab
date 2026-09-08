"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import CategoryFilter from "@/components/category-filter";
import ProductCard from "@/components/product-card";
import ProductDetailModal from "@/components/product-detail-modal";
import Pagination from "@/components/pagination";
import Footer from "@/components/footer";
import { useCart } from "@/app/context/cart-context";
import {
  Star,
  ShoppingBag,
  Shield,
  Truck,
  Award,
  ChevronRight,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string | null;
  rating: number;
  stock: number;
  sold: number;
}

const categories = [
  "Semua",
  "Hijab",
  "Gamis",
  "Tunik",
  "Pashmina",
  "Abaya",
  "Jilbab",
  "Aksesori",
];
const PRODUCTS_PER_PAGE = 8;

export default function Home() {
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch-on-mount: ambil produk sekali saat halaman dibuka.
  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Semua"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIdx,
    startIdx + PRODUCTS_PER_PAGE,
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const handleAddToCart = (productId: number) => {
    addItem(Number(productId));
  };

  const handleAddToCartFromModal = (
    productId: number,
    size: string,
    quantity: number,
  ) => {
    for (let i = 0; i < quantity; i++) {
      addItem(Number(productId));
    }
  };

  const handleNavigateCart = () => {
    router.push("/checkout");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header onNavigateCart={handleNavigateCart} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/8 via-transparent to-amber-900/8 dark:from-emerald-950/30 dark:to-amber-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.06),transparent_50%)]" />

        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-5 md:mb-6 border border-emerald-200/60 dark:border-emerald-800/50">
                <Flame className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                Promo Spesial Bulan Ini
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-5 leading-[1.1] tracking-tight">
                Tampil Elegan
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-400 dark:via-emerald-500 dark:to-teal-500 bg-clip-text text-transparent">
                  Berhijab
                </span>{" "}
                Berkelas
              </h1>

              <p className="text-sm md:text-base text-muted-foreground max-w-lg mb-6 md:mb-8 leading-relaxed">
                Temukan koleksi pakaian muslim premium dengan bahan pilihan dan
                desain eksklusif. Dari hijab hingga gamis, hadir untuk
                menyempurnakan setiap momen berhijab Anda.
              </p>

              <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
                <button
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-200/60 dark:shadow-emerald-900/40 hover:shadow-2xl transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
                >
                  Belanja Sekarang
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white dark:bg-card border-2 border-border hover:border-emerald-400 text-foreground font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                >
                  Lihat Koleksi
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 md:gap-10 pt-6 md:pt-8 border-t border-border/60">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    {products.length}+
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Produk Tersedia
                  </p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    2K+
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pelanggan Puas
                  </p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    100%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Garansi Halal
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image Gallery */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src="/islamic-dress-gamis-women.jpg"
                      alt="Gamis Muslim"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src="/modern-hijab-voile-pink.jpg"
                      alt="Hijab Modern"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src="/pashmina-floral-pattern.jpg"
                      alt="Pashmina Floral"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src="/abaya-arabian-dress-black-elegant.jpg"
                      alt="Abaya Elegant"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
              {/* Floating promo card */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-card rounded-2xl p-4 shadow-2xl border border-border/60 max-w-[220px] animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Diskon Spesial
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Hingga 50% off
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4 -mt-4 mb-8 md:mb-12">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">
                  Flash Sale Hari Ini
                </h3>
                <p className="text-emerald-100 text-sm">
                  Diskon hingga 50% untuk produk pilihan
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("products-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg active:scale-[0.98] shrink-0"
            >
              Lihat Promo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              icon: Truck,
              title: "Gratis Ongkir",
              desc: "Min. belanja Rp100rb",
            },
            { icon: Shield, title: "Garansi Halal", desc: "100% terjamin" },
            { icon: Award, title: "Kualitas Premium", desc: "Bahan terbaik" },
            {
              icon: ShoppingBag,
              title: "Mudah Ditukar",
              desc: "Garansi 7 hari",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-card rounded-2xl p-4 md:p-5 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm text-foreground mb-0.5 md:mb-1">
                {feature.title}
              </h3>
              <p className="text-[11px] text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products-section"
        className="container mx-auto px-4 py-6 md:py-8 flex-grow"
      >
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4 border border-emerald-200/60 dark:border-emerald-800/50">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            Koleksi Kami
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3 tracking-tight">
            Produk Pilihan
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base px-4">
            Berbagai pilihan busana muslim berkualitas untuk tampilan terbaik
            Anda
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: Number(product.id),
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    description: product.description || "",
                    image: product.image || "/placeholder.svg",
                    rating: product.rating,
                    stock: product.stock,
                    sold: product.sold,
                  }}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => handleAddToCart(Number(product.id))}
                  onViewDetail={() =>
                    handleViewDetail({
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      description: product.description || "",
                      image: product.image || "/placeholder.svg",
                      rating: product.rating,
                      stock: product.stock,
                      sold: product.sold,
                    })
                  }
                />
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-lg text-foreground font-semibold mb-2">
                  Tidak ada produk di kategori ini
                </p>
                <p className="text-muted-foreground mb-6 text-sm">
                  Coba pilih kategori lain atau lihat semua produk kami
                </p>
                <button
                  onClick={() => handleCategoryChange("Semua")}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm inline-flex items-center gap-1"
                >
                  Lihat semua produk
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-12 md:py-16 text-center relative z-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
              Dapatkan Info Terbaru
            </h2>
            <p className="text-emerald-100 text-sm md:text-base mb-6 md:mb-8">
              Berlangganan newsletter untuk mendapatkan promo eksklusif dan
              koleksi terbaru
            </p>
            <div className="flex gap-2 md:gap-3">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl text-foreground bg-white/95 dark:bg-card focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg text-sm"
              />
              <button className="px-5 md:px-6 py-3 md:py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-colors shadow-lg text-sm active:scale-[0.98]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={{
            id: Number(selectedProduct.id),
            name: selectedProduct.name,
            category: selectedProduct.category,
            price: selectedProduct.price,
            description: selectedProduct.description || "",
            image: selectedProduct.image || "/placeholder.svg",
            rating: selectedProduct.rating,
            stock: selectedProduct.stock,
            sold: selectedProduct.sold,
          }}
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </main>
  );
}
