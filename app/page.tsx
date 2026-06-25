"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import CategoryFilter from "@/components/category-filter";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/pagination";
import { useCart } from "@/app/context/cart-context";

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
const PRODUCTS_PER_PAGE = 4;

export default function Home() {
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = (productId: string) => {
    addItem(Number(productId));
    router.push("/checkout");
  };

  const handleNavigateCart = () => {
    router.push("/checkout");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header onNavigateCart={handleNavigateCart} />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-12 py-8 bg-gradient-to-r from-primary/10 to-pink-200/10 rounded-2xl px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Hijab Paradise
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Koleksi pakaian muslim modern dengan kualitas terbaik dan harga
            terjangkau. Dapatkan gaya yang elegan dan nyaman dengan produk
            pilihan kami.
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
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  }}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Tidak ada produk di kategori ini
                </p>
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
      </div>

      <footer className="bg-gradient-to-b from-secondary to-secondary/80 text-foreground py-16 mt-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">
                Hijab Paradise
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Toko online pakaian muslim terpercaya sejak 2023, menyediakan
                koleksi pakaian muslim berkualitas dengan harga terjangkau.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  TikTok
                </a>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Kategori</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Hijab
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Gamis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Tunik
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pashmina
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Abaya
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Layanan</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pengiriman Gratis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Garansi Kualitas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Tukar Balik
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Hubungi Kami</h4>
              <p className="text-muted-foreground text-sm mb-2">
                <span className="font-semibold">WhatsApp:</span> +62 812 3456
                7890
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                <span className="font-semibold">Email:</span>{" "}
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
                    className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-white dark:bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
