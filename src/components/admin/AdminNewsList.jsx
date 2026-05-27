import { useState, useEffect } from "react";
import { NewsPostService } from "@/services/entities";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { format } from "date-fns";
import AdminNewsForm from "./AdminNewsForm";

export default function AdminNewsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    const all = await NewsPostService.list();
    setPosts(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await NewsPostService.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = async (post) => {
    const updated = await NewsPostService.update(post.id, { is_published: !post.is_published });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, is_published: !p.is_published } : p)));
  };

  if (editing !== null) {
    return (
      <AdminNewsForm
        post={editing === false ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl">News Posts</h2>
        <Button onClick={() => setEditing(false)} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 h-10 rounded-xl bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
            >
              {post.featured_image && (
                <img src={post.featured_image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {post.category && (
                    <span className="text-[10px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">{post.category}</span>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </span>
                  {post.views > 0 && (
                    <span className="text-[11px] text-muted-foreground">{post.views} views</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.is_published
                      ? "text-green-400 hover:bg-green-400/10"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                  title={post.is_published ? "Published" : "Draft"}
                >
                  {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditing(post)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}