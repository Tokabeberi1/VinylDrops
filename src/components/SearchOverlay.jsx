import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "@/services/entities";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      const saved = localStorage.getItem("recentSearches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const all = await ProductService.filter({ status: "active" });
      const q = query.toLowerCase();
      const filtered = all.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.artist?.toLowerCase().includes(q) ||
          p.genre?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
      setResults(filtered.slice(0, 8));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (product) => {
    const searches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    navigate(`/product/${product.id}`);
    onClose();
  };

  const handleSearch = (term) => {
    setQuery(term);
  };

  const trendingTerms = ["Pink Floyd", "Beatles Vinyl", "Limited Edition", "Hip Hop Merch", "New Drops"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
        >
          <div className="max-w-2xl mx-auto px-4 pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vinyl, merch, artists..."
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-sm"
                />
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!query && (
              <div className="space-y-6">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-sm"
                      >
                        <TrendingUp className="w-3 h-3" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {query && (
              <div className="space-y-1">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">No results for "{query}"</p>
                  </div>
                ) : (
                  results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                        {product.image_url && (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {product.artist} · ${product.price}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}