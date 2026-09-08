"use client";

import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react";

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
  const hasDiscount = product.sold && product.sold > 50;

  return (
    <div className="group relative bg-white dark:bg-card rounded-3xl overflow-hidden border border-border/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 dark:hover:shadow-emerald-900/20 transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] product-img-container overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-card/95 backdrop-blur-md text-foreground px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg border border-border/50">
          {product.category}
        </div>

        {/* Hot / Best Seller Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 right-auto mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3 fill-white" />
            Best Seller
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white dark:hover:bg-card transition-all duration-200 hover:scale-110 border border-border/50 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 dark:text-gray-500 group-hover:text-red-400"
            }`}
          />
        </button>

        {/* Quick View & Add to Cart - Mobile optimized overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail();
              }}
              className="flex-1 bg-white/95 dark:bg-card/95 backdrop-blur-md text-foreground py-2.5 rounded-xl font-semibold text-xs shadow-xl flex items-center justify-center gap-1.5 hover:bg-white dark:hover:bg-card transition-colors border border-border/50"
            >
              <Eye className="w-3.5 h-3.5" />
              Detail
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-xs shadow-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200 dark:text-gray-700"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">
            ({product.rating})
          </span>
        </div>

        {/* Product Name */}
        <h3
          className="font-semibold text-sm text-foreground mb-1.5 line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
          onClick={onViewDetail}
        >
          {product.name}
        </h3>

        {/* Sold count */}
        {product.sold && product.sold > 0 && (
          <p className="text-[11px] text-muted-foreground mb-2">
            {product.sold} terjual
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & CTA */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-end justify-between gap-2 mb-3">
            <div>
              <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">
                Rp {(product.price * 1.2).toLocaleString("id-ID")}
              </p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 hover:shadow-xl active:shadow-md text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
