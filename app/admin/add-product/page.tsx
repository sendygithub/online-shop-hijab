"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, X, Upload } from "lucide-react";
import { addProduct } from "@/actions";

interface Variant {
  id: string;
  size: string;
  stock: number;
}

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Hijab",
    image: null as File | null,
  });

  const [variants, setVariants] = useState<Variant[]>([
    { id: "1", size: "XS", stock: 0 },
    { id: "2", size: "S", stock: 0 },
    { id: "3", size: "M", stock: 0 },
    { id: "4", size: "L", stock: 0 },
    { id: "5", size: "XL", stock: 0 },
    { id: "6", size: "XXL", stock: 0 },
  ]);

  const categories = [
    "Hijab",
    "Gamis",
    "Tunik",
    "Pashmina",
    "Abaya",
    "Jilbab",
    "Aksesori",
  ];

  // Redirect if not admin
  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (id: string, stock: number) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, stock } : variant,
      ),
    );
  };

  const handleAddVariant = () => {
    const newId = String(
      Math.max(...variants.map((v) => Number.parseInt(v.id))) + 1,
    );
    setVariants((prev) => [...prev, { id: newId, size: "", stock: 0 }]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id));
  };

  const handleVariantSizeChange = (id: string, size: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, size } : variant,
      ),
    );
  };

  const uploadImageToBlob = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Gagal mengupload gambar");
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.price) {
      alert("Harap isi semua field wajib");
      return;
    }

    const totalStock = variants.reduce(
      (sum, variant) => sum + variant.stock,
      0,
    );
    if (totalStock === 0) {
      alert("Minimal ada 1 varian dengan stock > 0");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // Upload image to Vercel Blob if file selected
      if (formData.image) {
        imageUrl = await uploadImageToBlob(formData.image);
        setUploadedUrl(imageUrl);
      }

      // Use server action to add product
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("stock", String(totalStock));
      if (imageUrl) {
        submitData.append("imageUrl", imageUrl);
      }

      // Add sizes
      const activeVariants = variants.filter((v) => v.stock > 0);
      activeVariants.forEach((v) => {
        submitData.append("sizes", v.size);
      });

      await addProduct(submitData);

      alert("Produk berhasil ditambahkan!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Hijab",
        image: null,
      });
      setImagePreview(null);
      setUploadedUrl("");
      setVariants([
        { id: "1", size: "XS", stock: 0 },
        { id: "2", size: "S", stock: 0 },
        { id: "3", size: "M", stock: 0 },
        { id: "4", size: "L", stock: 0 },
        { id: "5", size: "XL", stock: 0 },
        { id: "6", size: "XXL", stock: 0 },
      ]);

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Terjadi kesalahan saat menambah produk");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-sm text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Tambah Produk Baru
          </h1>
          <p className="text-muted-foreground">
            Tambahkan produk pakaian muslim ke katalog Anda
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-lg border border-border p-8 shadow-sm"
          >
            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Upload Gambar Produk *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="group-hover:text-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-semibold text-foreground">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      atau drag and drop gambar di sini
                    </p>
                  </div>
                )}
              </div>
              {uploadedUrl && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ Gambar berhasil diupload ke Vercel Blob
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6 mb-8">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Nama Produk *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Hijab Voile Premium"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Deskripsi Produk *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan detail produk, bahan, dan keunggulan produk ini"
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground resize-none"
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Contoh: 89000"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Kategori *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-foreground">
                  Varian Produk (Ukuran & Stock)
                </label>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Varian
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {variants.map((variant) => (
                  <div key={variant.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Ukuran
                      </label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantSizeChange(variant.id, e.target.value)
                        }
                        placeholder="Contoh: S, M, L"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.id,
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Total Stock: {variants.reduce((sum, v) => sum + v.stock, 0)}{" "}
                unit
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
