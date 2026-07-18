"use client";

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
  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
              selectedCategory === category
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                : "bg-white dark:bg-card text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-border/60 hover:border-emerald-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
