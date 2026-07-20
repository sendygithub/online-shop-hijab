"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import CategoryFilter from "@/components/category-filter";
import ProductCard from "@/components/product-card";
import ProductDetailModal from "@/components/product-detail-modal";
import Pagination from "@/components/pagination";
import { useCart } from "@/app/context/cart-context";
import {
  Star,
  ShoppingBag,
  Shield,
  Truck,
  Award,
  ChevronRight,
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    // Add multiple quantities
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
    <main className="min-h-screen bg-background flex flex-col islamic-pattern">
      <Header onNavigateCart={handleNavigateCart} />

      {/* Hero Section - Islamic Elegant */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 via-transparent to-amber-900/5" />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                Koleksi Pakaian Muslim Terbaru
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                Tampil Elegan
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Berhijab
                </span>{" "}
                dengan Gaya
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Temukan koleksi pakaian muslim modern dengan kualitas terbaik.
                Dari hijab hingga gamis, semua hadir dengan desain yang elegan
                dan nyaman dipakai sehari-hari.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  Belanja Sekarang
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="border-2 border-border hover:border-emerald-400 text-foreground font-semibold px-8 py-3.5 rounded-xl transition-all duration-200">
                  Lihat Koleksi
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {products.length}+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Produk Tersedia
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    500+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pelanggan Puas
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    100%
                  </p>
                  <p className="text-xs text-muted-foreground">Garansi Halal</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image Gallery */}
            <div className="relative lg:pl-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img
                      src="/islamic-dress-gamis-women.jpg"
                      alt="Gamis Muslim"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src="/modern-hijab-voile-pink.jpg"
                      alt="Hijab Modern"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src="/pashmina-floral-pattern.jpg"
                      alt="Pashmina Floral"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img
                      src="/abaya-arabian-dress-black-elegant.jpg"
                      alt="Abaya Elegant"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
              className="bg-white dark:bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products-section"
        className="container mx-auto px-4 py-8 flex-grow"
      >
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            Koleksi Kami
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Produk Pilihan
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
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
            {/* Products Grid - Masonry-like with varied cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard
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
                </div>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-lg text-muted-foreground">
                  Tidak ada produk di kategori ini
                </p>
                <button
                  onClick={() => handleCategoryChange("Semua")}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                >
                  Lihat semua produk
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
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Dapatkan Info Terbaru</h2>
          <p className="text-emerald-100 mb-8 max-w-md mx-auto">
            Berlangganan newsletter untuk mendapatkan promo dan koleksi terbaru
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-5 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Islamic Theme */}
      <footer className="bg-gradient-to-b from-card to-card/95 text-foreground py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    Hijab
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Paradise
                    </span>
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Toko online pakaian muslim terpercaya sejak 2023, menyediakan
                koleksi pakaian muslim berkualitas dengan harga terjangkau.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
                >
                  TikTok
                </a>
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
                >
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Kategori</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Hijab
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Gamis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Tunik
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Pashmina
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Abaya
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Layanan</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Pengiriman Gratis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Garansi Kualitas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Tukar Balik
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Customer Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Hubungi Kami</h4>
              <p className="text-muted-foreground text-sm mb-2">
                <span className="font-semibold text-foreground">WhatsApp:</span>{" "}
                +62 812 3456 7890
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                info@hijabparadise.com
              </p>
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Newsletter
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="flex-1 px-3 py-2 rounded-xl border border-border text-sm text-foreground bg-white dark:bg-input focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Hijab Paradise. Semua hak
              dilindungi.
            </p>
          </div>
        </div>
      </footer>

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
