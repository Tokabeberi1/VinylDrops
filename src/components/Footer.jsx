import { Link } from "react-router-dom";
import { Disc3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading font-bold text-lg">
                GROOVE<span className="text-primary">HQ</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate destination for music culture, vinyl collectors, and merch lovers.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Shop</h4>
            <div className="space-y-2">
              <Link to="/vinyl" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Vinyl Deals</Link>
              <Link to="/merch" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Merch Deals</Link>
              <Link to="/new-releases" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">New Releases</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Account</h4>
            <div className="space-y-2">
              <Link to="/profile" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
              <Link to="/wishlist" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Legal</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Privacy Policy</p>
              <p className="text-sm text-muted-foreground">Terms of Service</p>
              <p className="text-sm text-muted-foreground">Affiliate Disclosure</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 GrooveHQ. All rights reserved. As an Amazon Associate, we earn from qualifying purchases.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♡ for music lovers
          </p>
        </div>
      </div>
    </footer>
  );
}