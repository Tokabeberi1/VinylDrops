import { useState, useEffect, useMemo } from "react";
import { ProductService } from "@/services/entities";

export default function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    const query = { status: "active" };
    if (category) query.category = category;
    const data = await ProductService.filter(query);
    setProducts(data);
    setLoading(false);
  };

  // Load products on mount and when category changes
  useEffect(() => {
    loadProducts();
  }, [category]);

  // Reload products when page regains focus (visibility change or window focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadProducts();
      }
    };

    const handleWindowFocus = () => {
      loadProducts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [category]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.artist?.toLowerCase().includes(q) ||
          p.genre?.toLowerCase().includes(q)
      );
    }

    // Genre
    if (filters.genre) {
      result = result.filter((p) => p.genre?.toLowerCase() === filters.genre.toLowerCase());
    }

    // Price range
    if (filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice && filters.maxPrice < 500) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    // Rating
    if (filters.minRating) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    // Availability
    if (filters.availability) {
      result = result.filter((p) => p.availability === filters.availability);
    }

    // Quick filters
    if (filters.is_trending) result = result.filter((p) => p.is_trending);
    if (filters.is_bestseller) result = result.filter((p) => p.is_bestseller);
    if (filters.is_limited_edition) result = result.filter((p) => p.is_limited_edition);
    if (filters.is_new) result = result.filter((p) => p.is_new);

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "trending":
        result.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0));
        break;
      case "name_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // featured
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, filters, sortBy, searchQuery]);

  return {
    products: filtered,
    allProducts: products,
    loading,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };
}