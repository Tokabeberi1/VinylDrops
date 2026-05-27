import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Save to localStorage as mock subscription
      const subscriptions = JSON.parse(localStorage.getItem("newsletter_subscriptions") || "[]");
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem("newsletter_subscriptions", JSON.stringify(subscriptions));
      }
    } catch (e) {
      console.error('Subscription error:', e);
    }
    setSuccess(true);
    setLoading(false);
    setEmail("");
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.1),transparent_70%)]" />
          <div className="relative">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">STAY UPDATED</p>
            <h2 className="font-heading font-bold text-2xl md:text-4xl mb-3">Never Miss a Deal</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
              Get notified about the hottest drops, rare finds, and exclusive deals before anyone else.
            </p>

            {success ? (
              <div className="flex items-center justify-center gap-2 text-accent font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>You're subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-5 rounded-xl bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            {error && <p className="text-destructive text-xs mt-3">{error}</p>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}