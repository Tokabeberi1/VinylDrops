import { Link, useLocation } from "react-router-dom";
import { Home, Disc3, ShoppingBag, Sparkles, Heart, User, Newspaper } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/vinyl", icon: Disc3, label: "Vinyl" },
  { to: "/new-releases", icon: Sparkles, label: "New" },
  { to: "/news", icon: Newspaper, label: "News" },
  { to: "/wishlist", icon: Heart, label: "Saved" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}