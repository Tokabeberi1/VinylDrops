import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { WishlistItemService } from "@/services/entities";

let cachedItems = [];
let listeners = new Set();

const GUEST_WISHLIST_KEY = 'groovehq_guest_wishlist';

function notifyListeners() {
  listeners.forEach((fn) => fn([...cachedItems]));
}

export default function useWishlist() {
  const [items, setItems] = useState(cachedItems);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    listeners.add(setItems);
    return () => listeners.delete(setItems);
  }, []);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        // Load from server for authenticated users
        const wishlist = await WishlistItemService.filter({ user_email: user.email });
        cachedItems = wishlist;
      } else {
        // Load from localStorage for guests
        const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
        cachedItems = guestWishlist ? JSON.parse(guestWishlist) : [];
      }
      notifyListeners();
    } catch (e) {
      console.error('Failed to load wishlist:', e);
      // Fallback to empty
      cachedItems = [];
      notifyListeners();
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [user, isAuthenticated, loadWishlist]);

  const isWishlisted = useCallback(
    (productId) => items.some((item) => {
      // For authenticated users, check product_id
      if (isAuthenticated) return item.product_id === productId;
      // For guests, check id field (which stores product_id)
      return item.id === productId || item.product_id === productId;
    }),
    [items, isAuthenticated]
  );

  const toggleWishlist = useCallback(async (productId) => {
    if (isAuthenticated && user) {
      // Authenticated user - use server
      const existing = cachedItems.find((item) => item.product_id === productId);
      if (existing) {
        await WishlistItemService.delete(existing.id);
        cachedItems = cachedItems.filter((item) => item.id !== existing.id);
      } else {
        const created = await WishlistItemService.create({
          product_id: productId,
          user_email: user.email,
        });
        cachedItems = [...cachedItems, created];
      }
    } else {
      // Guest user - use localStorage
      const existing = cachedItems.find((item) => item.id === productId);
      if (existing) {
        cachedItems = cachedItems.filter((item) => item.id !== productId);
      } else {
        cachedItems = [
          ...cachedItems,
          {
            id: productId,
            product_id: productId,
            created_at: new Date().toISOString(),
          },
        ];
      }
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(cachedItems));
    }
    notifyListeners();
  }, [user, isAuthenticated]);

  return { items, loading, isWishlisted, toggleWishlist, reload: loadWishlist };
}