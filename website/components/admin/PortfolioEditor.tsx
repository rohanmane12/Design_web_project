'use client';

import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PortfolioEditorProps {
  mode: 'create' | 'edit';
  portfolioId?: string;
}

interface PortfolioPayload {
  title: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  featured: boolean;
  active: boolean;
}

const categories = [
  { value: 'personal', label: 'Personal Designs' },
  { value: 'acrylic', label: 'Acrylic Name Plates' },
  { value: 'led', label: 'LED Signages' },
  { value: 'standees', label: 'Standees' },
  { value: 'stickers', label: 'Stickers' },
  { value: 'hoardings', label: 'Hoardings' },
  { value: 'banners', label: 'Banners' },
  { value: 'other', label: 'Other' },
];

export default function PortfolioEditor({ mode, portfolioId }: PortfolioEditorProps) {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const isEditMode = mode === 'edit';
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    titleMr: '',
    descriptionEn: '',
    descriptionHi: '',
    descriptionMr: '',
    category: 'personal',
    featured: false,
    active: true,
  });

  useEffect(() => {
    if (!isEditMode || !portfolioId) return;

    const loadPortfolio = async () => {
      try {
        const res = await fetch(`/api/admin/portfolio/${portfolioId}`);
        if (!res.ok) throw new Error('Failed to load portfolio item');

        const item: PortfolioPayload = await res.json();
        setFormData({
          titleEn: item.title?.en ?? '',
          titleHi: item.title?.hi ?? '',
          titleMr: item.title?.mr ?? '',
          descriptionEn: item.description?.en ?? '',
          descriptionHi: item.description?.hi ?? '',
          descriptionMr: item.description?.mr ?? '',
          category: item.category ?? 'personal',
          featured: Boolean(item.featured),
          active: item.active !== false,
        });
        setExistingImages(item.images ?? []);
      } catch (loadError) {
        console.error(loadError);
        setError('Failed to load portfolio details.');
      } finally {
        setPageLoading(false);
      }
    };

    void loadPortfolio();
  }, [isEditMode, portfolioId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 10) {
      setError('Maximum 10 images allowed.');
      return;
    }

    setError('');
    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async () => {
    const uploadedUrls: string[] = [];

    for (const image of newImages) {
      const uploadData = new FormData();
      uploadData.append('file', image);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) throw new Error('Failed to upload image');

      const data = await res.json();
      uploadedUrls.push(data.secure_url || data.url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const uploadedUrls = await uploadNewImages();
      const fallbackTitle = formData.titleEn.trim();
      const fallbackDescription = formData.descriptionEn.trim();
      const payload = {
        title: {
          en: fallbackTitle,
          hi: formData.titleHi.trim() || fallbackTitle,
          mr: formData.titleMr.trim() || fallbackTitle,
        },
        description: {
          en: fallbackDescription,
          hi: formData.descriptionHi.trim() || fallbackDescription,
          mr: formData.descriptionMr.trim() || fallbackDescription,
        },
        category: formData.category,
        images: [...existingImages, ...uploadedUrls],
        featured: formData.featured,
        active: formData.active,
      };

      const endpoint = isEditMode ? `/api/admin/portfolio/${portfolioId}` : '/api/admin/portfolio';
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} portfolio item`);
      }

      router.push(`/${locale}/admin/portfolio`);
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : 'Failed to save portfolio item.');
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/${locale}/admin/portfolio`)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to portfolio
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isEditMode ? 'Update project details and imagery.' : 'Add a project to the portfolio.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">English Details</h2>
          <div className="space-y-4">
            <input type="text" required value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Project title" />
            <textarea required value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={3} className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Project description" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Hindi Details</h2>
          <div className="space-y-4">
            <input type="text" value={formData.titleHi} onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Optional. Falls back to English if empty" />
            <textarea value={formData.descriptionHi} onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })} rows={3} className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Optional. Falls back to English if empty" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Marathi Details</h2>
          <div className="space-y-4">
            <input type="text" value={formData.titleMr} onChange={(e) => setFormData({ ...formData, titleMr: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Optional. Falls back to English if empty" />
            <textarea value={formData.descriptionMr} onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })} rows={3} className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Optional. Falls back to English if empty" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Category</h2>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              {categories.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Publishing</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-medium text-gray-700">Featured project</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-medium text-gray-700">Visible on site</span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-2 text-xl font-bold text-gray-900">Images</h2>
          <p className="mb-4 text-sm text-gray-600">Upload up to 10 images total.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {existingImages.map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
                <img src={image} alt={`Existing portfolio ${index + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(index)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {newImagePreviews.map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
                <img src={image} alt={`New portfolio ${index + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeNewImage(index)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {existingImages.length + newImagePreviews.length < 10 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-all hover:border-blue-500 hover:bg-blue-50">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : isEditMode ? 'Update Portfolio Item' : 'Create Portfolio Item'}
          </button>
          <button type="button" onClick={() => router.push(`/${locale}/admin/portfolio`)} className="rounded-xl border-2 border-gray-200 px-6 py-4 font-semibold transition-all hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
