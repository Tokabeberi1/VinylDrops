import { useState } from "react";
import { NewsPostService } from "@/services/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill";
import { ArrowLeft, Upload } from "lucide-react";

const categories = ["release", "news", "review", "exclusive", "interview", "guide"];

export default function AdminNewsForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    featured_image: post?.featured_image || "",
    category: post?.category || "news",
    author_name: post?.author_name || "",
    tags: post?.tags?.join(", ") || "",
    is_featured: post?.is_featured || false,
    is_published: post?.is_published || false,
    published_at: post?.published_at || new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      set("featured_image", event.target?.result || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (post?.id) {
        await NewsPostService.update(post.id, data);
      } else {
        await NewsPostService.create(data);
      }
      setSaving(false);
      onSave();
    } catch (error) {
      console.error('Failed to save post:', error);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-heading font-bold text-xl">{post ? "Edit Post" : "New Post"}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Post title..." />
        </div>
        <div className="space-y-2">
          <Label>Author Name</Label>
          <Input value={form.author_name} onChange={(e) => set("author_name", e.target.value)} placeholder="e.g. GrooveHQ Team" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Excerpt</Label>
        <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown on cards..." rows={2} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Publish Date</Label>
          <Input type="date" value={form.published_at?.slice(0, 10)} onChange={(e) => set("published_at", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Tags (comma separated)</Label>
          <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="vinyl, rock, 2024" />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex gap-3 items-start">
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {form.featured_image && (
            <img src={form.featured_image} alt="" className="h-12 w-20 object-cover rounded-lg border border-border" />
          )}
        </div>
        {form.featured_image && (
          <Input value={form.featured_image} onChange={(e) => set("featured_image", e.target.value)} placeholder="or paste image URL" className="text-xs" />
        )}
        {!form.featured_image && (
          <Input value={form.featured_image} onChange={(e) => set("featured_image", e.target.value)} placeholder="or paste image URL" className="text-xs mt-2" />
        )}
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label>Content *</Label>
        <div className="rounded-xl overflow-hidden border border-border">
          <ReactQuill
            value={form.content}
            onChange={(v) => set("content", v)}
            theme="snow"
            placeholder="Write your post content here..."
            style={{ minHeight: 300 }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "code-block"],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
          <Label>Published</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
          <Label>Featured (shows large on news page)</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving || !form.title || !form.content}>
          {saving ? "Saving..." : post ? "Save Changes" : "Publish Post"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}