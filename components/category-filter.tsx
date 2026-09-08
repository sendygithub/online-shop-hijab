"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mb-8 md:mb-10">
      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-card border border-border shadow-lg rounded-full items-center justify-center hover:bg-muted transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-card border border-border shadow-lg rounded-full items-center justify-center hover:bg-muted transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      {/* Scrollable categories */}
      <div
        ref={scrollRef}
        className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth px-1 md:px-8 py-1"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`shrink-0 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-200 text-sm whitespace-nowrap ${
              selectedCategory === category
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/40 scale-[1.02]"
                : "bg-white dark:bg-card text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-border/60 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
