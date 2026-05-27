import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ExternalLink, Star, TrendingUp, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import useWishlist from "../hooks/useWishlist";
import { useAuth } from "@/lib/AuthContext";
import { AffiliateClickService, ProductService } from "@/services/entities";

export default function ProductCard({ product, index = 0 }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const { user } = useAuth();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistAnimating(true);
    await toggleWishlist(product.id);
    setTimeout(() => setWishlistAnimating(false), 600);
  };

  const handleAffiliateClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await AffiliateClickService.create({
        product_id: product.id,
        product_title: product.title,
        user_email: user?.email || "anonymous",
        amazon_url: product.amazon_url,
      });
      await ProductService.update(product.id, {
        affiliate_clicks: (product.affiliate_clicks || 0) + 1,
      });
    } catch { /* ignore */ }
    window.open(product.amazon_url || "https://amazon.com", "_blank");
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-500"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {product.is_trending && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold backdrop-blur-sm">
            <TrendingUp className="w-3 h-3" /> TRENDING
          </span>
        )}
        {product.is_bestseller && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-semibold backdrop-blur-sm">
            <Award className="w-3 h-3" /> BESTSELLER
          </span>
        )}
        {product.is_limited_edition && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-semibold backdrop-blur-sm">
            <Zap className="w-3 h-3" /> LIMITED
          </span>
        )}
        {discount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-semibold">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        onClick={handleWishlistClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={wishlistAnimating && wishlisted ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center transition-all"
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            wishlisted ? "fill-primary text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        />
      </motion.button>

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-secondary relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-muted-foreground mb-1 font-medium">
            {product.artist || product.genre}
          </p>
          <h3 className="font-heading font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-medium">{product.rating}</span>
            {product.review_count > 0 && (
              <span className="text-xs text-muted-foreground">({product.review_count})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading font-bold text-lg">${product.price}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">${product.original_price}</span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAffiliateClick}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          BUY ON AMAZON
        </button>
      </div>
    </motion.div>
  );
}