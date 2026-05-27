import { motion } from "framer-motion";

export default function HeroSection({ title, subtitle, description, gradient = "from-primary/20 via-transparent to-accent/10" }) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(138,43,226,0.1),transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4"
        >
          {subtitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl mb-4 leading-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}