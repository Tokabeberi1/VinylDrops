import { useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { ProductService } from "@/services/entities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminProductForm({ product, onBack }) {
  const isEditing = !!product;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: product?.title || "",
    artist: product?.artist || "",
    description: product?.description || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    image_url: product?.image_url || "",
    amazon_url: product?.amazon_url || "",
    category: product?.category || "vinyl",
    genre: product?.genre || "",
    tags: product?.tags?.join(", ") || "",
    rating: product?.rating || 0,
    availability: product?.availability || "in_stock",
    status: product?.status || "active",
    is_trending: product?.is_trending || false,
    is_featured: product?.is_featured || false,
    is_bestseller: product?.is_bestseller || false,
    is_limited_edition: product?.is_limited_edition || false,
    is_new: product?.is_new || false,
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, use a local URL or Unsplash placeholder
    const reader = new FileReader();
    reader.onload = (event) => {
      // Store as data URL or use a placeholder
      updateField("image_url", event.target?.result || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop");
      toast.success("Image uploaded (local storage)");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.price) {
      toast.error("Title, category, and price are required");
      return;
    }
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price),
      original_price: Number(form.original_price) || undefined,
      rating: Number(form.rating) || 0,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      if (isEditing) {
        await ProductService.update(product.id, data);
        toast.success("Product updated");
      } else {
        await ProductService.create(data);
        toast.success("Product created");
      }
      setSaving(false);
      onBack();
    } catch (error) {
      toast.error("Failed to save product");
      setSaving(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </button>

      <h2 className="font-heading font-bold text-xl mb-6">
        {isEditing ? "Edit Product" : "New Product"}
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Title *</Label>
            <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs">Artist</Label>
            <Input value={form.artist} onChange={(e) => updateField("artist", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className="mt-1 rounded-xl bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Price *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-xs">Original Price</Label>
              <Input type="number" step="0.01" value={form.original_price} onChange={(e) => updateField("original_price", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Amazon Affiliate URL</Label>
            <Input value={form.amazon_url} onChange={(e) => updateField("amazon_url", e.target.value)} placeholder="https://amazon.com/dp/..." className="mt-1 rounded-xl bg-secondary border-border" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category *</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger className="mt-1 rounded-xl bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vinyl">Vinyl</SelectItem>
                  <SelectItem value="merch">Merch</SelectItem>
                  <SelectItem value="new_release">New Release</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger className="mt-1 rounded-xl bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Genre</Label>
              <Input value={form.genre} onChange={(e) => updateField("genre", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-xs">Availability</Label>
              <Select value={form.availability} onValueChange={(v) => updateField("availability", v)}>
                <SelectTrigger className="mt-1 rounded-xl bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="pre_order">Pre Order</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="rock, classic, 180g" className="mt-1 rounded-xl bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Rating (0-5)</Label>
              <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => updateField("rating", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-xs">Review Count</Label>
              <Input type="number" value={form.review_count} onChange={(e) => updateField("review_count", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Release Date</Label>
            <Input type="date" value={form.release_date} onChange={(e) => updateField("release_date", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
          </div>

          {/* Image */}
          <div>
            <Label className="text-xs">Product Image</Label>
            <div className="mt-1 flex items-center gap-3">
              {form.image_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                <Upload className="w-4 h-4" />
                Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <span className="text-xs text-muted-foreground">or paste URL:</span>
              <Input value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} placeholder="https://..." className="flex-1 rounded-xl bg-secondary border-border text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 mb-8 p-5 rounded-2xl bg-card border border-border">
        {[
          { key: "is_trending", label: "Trending" },
          { key: "is_featured", label: "Featured" },
          { key: "is_bestseller", label: "Bestseller" },
          { key: "is_limited_edition", label: "Limited Edition" },
          { key: "is_new", label: "New" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <Switch checked={form[key]} onCheckedChange={(v) => updateField(key, v)} />
            <Label className="text-xs">{label}</Label>
          </div>
        ))}
      </div>

      {/* Pros / Cons / Specs */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label className="text-xs">Pros (one per line)</Label>
          <Textarea value={form.pros} onChange={(e) => updateField("pros", e.target.value)} rows={4} className="mt-1 rounded-xl bg-secondary border-border" />
        </div>
        <div>
          <Label className="text-xs">Cons (one per line)</Label>
          <Textarea value={form.cons} onChange={(e) => updateField("cons", e.target.value)} rows={4} className="mt-1 rounded-xl bg-secondary border-border" />
        </div>
        <div>
          <Label className="text-xs">Specs (JSON)</Label>
          <Textarea value={form.specs} onChange={(e) => updateField("specs", e.target.value)} rows={4} placeholder={'{"Format": "180g Vinyl"}'} className="mt-1 rounded-xl bg-secondary border-border" />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
      </button>
    </div>
  );
}