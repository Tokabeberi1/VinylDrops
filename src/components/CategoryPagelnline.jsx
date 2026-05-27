import { useState } from "react";
import { Search } from "lucide-react";
import HeroSection from "./HeroSection";
import FilterBar from "./FilterBar";
import ProductGrid from "./ProductGrid";
import useProducts from "../hooks/useProducts";

export default function CategoryPage({ category, title, subtitle, description }) {
  const { products, loading, filters, setFilters, sortBy, setSortBy, searchQuery, setSearchQuery } =
    useProducts(category);

  return (
    <div>
      <HeroSection title={title} subtitle={subtitle} description={description} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        {/* Search + Mobile Controls Row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {/* Mobile filter + sort controls (FilterBar handles drawer + sort) */}
          <div className="lg:hidden flex-shrink-0">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar filters */}
          <div className="hidden lg:block">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-4">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}