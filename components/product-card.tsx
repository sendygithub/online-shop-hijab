"use client";

import { Heart, ShoppingCart, Star, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  stock?: number;
  sold?: number;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onViewDetail: () => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onViewDetail,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      {/* Islamic geometric pattern accent top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 z-10" />

      {/* Image Container */}
      <div className="relative h-56 md:h-72 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-card transition-all duration-200 z-10 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {product.category}
        </div>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <span className="bg-white/90 dark:bg-card/90 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xl flex items-center gap-2 hover:bg-white dark:hover:bg-card transition-colors">
            <Eye className="w-4 h-4" />
            Lihat Detail
          </span>
        </button>

        {/* Sold count badge */}
        {product.sold && product.sold > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs">
            {product.sold} terjual
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1.5">
            ({product.rating})
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-foreground text-sm mb-1.5 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
