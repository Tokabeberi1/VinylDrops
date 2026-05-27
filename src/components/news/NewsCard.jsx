import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Eye, Tag } from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  release: "bg-purple-500/20 text-purple-300",
  news: "bg-blue-500/20 text-blue-300",
  review: "bg-yellow-500/20 text-yellow-300",
  exclusive: "bg-pink-500/20 text-pink-300",
  interview: "bg-green-500/20 text-green-300",
  guide: "bg-cyan-500/20 text-cyan-300",
};

export default function NewsCard({ post, index = 0, featured = false }) {
  const date = post.published_at
    ? format(new Date(post.published_at), "MMM d, yyyy")
    : format(new Date(post.created_date), "MMM d, yyyy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 ${
        featured ? "md:flex" : ""
      }`}
    >
      {/* Cover Image */}
      <Link
        to={`/news/${post.id}`}
        className={`block overflow-hidden bg-secondary ${
          featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"
        }`}
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary">
            <span className="text-4xl">🎵</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className={`p-5 flex flex-col ${featured ? "md:w-1/2 md:p-8 justify-center" : ""}`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.category && (
            <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          {post.views > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Eye className="w-3 h-3" />
              {post.views.toLocaleString()}
            </span>
          )}
        </div>

        <Link to={`/news/${post.id}`}>
          <h3 className={`font-heading font-bold group-hover:text-primary transition-colors mb-2 ${
            featured ? "text-xl md:text-2xl" : "text-base"
          }`}>
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs text-muted-foreground">{post.author_name || "GrooveHQ"}</span>
          <Link
            to={`/news/${post.id}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}