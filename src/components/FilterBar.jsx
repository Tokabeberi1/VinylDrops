import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const genres = ["Rock", "Hip Hop", "Jazz", "Pop", "Electronic", "R&B", "Classical", "Metal", "Indie", "Country", "Soul", "Punk"];
const ratings = [4, 3, 2, 1];

export default function FilterBar({ filters, onFiltersChange, sortBy, onSortChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minInput, setMinInput] = useState(filters.minPrice?.toString() || "0");
  const [maxInput, setMaxInput] = useState(filters.maxPrice?.toString() || "500");

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSortChange("featured");
    setMinInput("0");
    setMaxInput("500");
  };

  const handleMinChange = (e) => {
    const value = e.target.value;
    // Allow any numeric value while typing
    setMinInput(value);
  };

  const handleMinBlur = () => {
    // Only validate and update filter on blur
    let newMin = parseInt(minInput) || 0;
    newMin = Math.max(0, Math.min(newMin, 500));
    newMin = Math.min(newMin, filters.maxPrice || 500);
    setMinInput(newMin.toString());
    updateFilter("minPrice", newMin);
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    // Allow any numeric value while typing
    setMaxInput(value);
  };

  const handleMaxBlur = () => {
    // Only validate and update filter on blur
    let newMax = parseInt(maxInput) || 500;
    newMax = Math.max(0, Math.min(newMax, 500));
    newMax = Math.max(newMax, filters.minPrice || 0);
    setMaxInput(newMax.toString());
    updateFilter("maxPrice", newMax);
  };

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "" && (Array.isArray(v) ? v.length > 0 : true));

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Price Range
        </label>
        {/* Input Fields */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
            <input
              type="number"
              min="0"
              max="500"
              value={minInput}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
            <input
              type="number"
              min="0"
              max="500"
              value={maxInput}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              placeholder="500"
              className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        {/* Slider */}
        <Slider
          min={0}
          max={500}
          step={5}
          value={[filters.minPrice || 0, filters.maxPrice || 500]}
          onValueChange={([min, max]) => {
            setMinInput(min.toString());
            setMaxInput(max.toString());
            updateFilter("minPrice", min);
            updateFilter("maxPrice", max);
          }}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${filters.minPrice || 0}</span>
          <span>${filters.maxPrice || 500}</span>
        </div>
      </div>

      {/* Genre */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Genre
        </label>
        <div className="flex flex-wrap gap-1.5">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => updateFilter("genre", filters.genre === genre ? "" : genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.genre === genre
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => updateFilter("minRating", filters.minRating === r ? 0 : r)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.minRating === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Availability
        </label>
        <div className="flex flex-wrap gap-1.5">
          {["in_stock", "pre_order", "low_stock"].map((avail) => (
            <button
              key={avail}
              onClick={() => updateFilter("availability", filters.availability === avail ? "" : avail)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.availability === avail
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {avail.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "is_trending", label: "Trending" },
            { key: "is_bestseller", label: "Bestseller" },
            { key: "is_limited_edition", label: "Limited Edition" },
            { key: "is_new", label: "New" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => updateFilter(key, filters[key] ? false : true)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters[key]
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-destructive hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-sm">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                Clear
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Sort + Mobile Filter Toggle */}
      <div className="flex items-center gap-2 lg:mb-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              !
            </span>
          )}
        </button>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] lg:w-[180px] h-10 rounded-xl bg-secondary border-0 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="name_asc">A - Z</SelectItem>
            <SelectItem value="name_desc">Z - A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold">Filters</h3>
                  <button onClick={() => setMobileOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}