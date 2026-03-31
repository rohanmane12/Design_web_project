'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    titleMr: '',
    descriptionEn: '',
    descriptionHi: '',
    descriptionMr: '',
    category: 'personal',
    featured: false,
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls: string[] = [];
      
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
          imageUrls.push(data.secure_url);
        }
      }

      const portfolioData = {
        title: {
          en: formData.titleEn,
          hi: formData.titleHi,
          mr: formData.titleMr,
        },
        description: {
          en: formData.descriptionEn,
          hi: formData.descriptionHi,
          mr: formData.descriptionMr,
        },
        category: formData.category,
        images: imageUrls,
        featured: formData.featured,
        active: true,
      };

      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      });

      if (res.ok) {
        router.push('/admin/portfolio');
      } else {
        alert('Failed to create portfolio item');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Failed to create portfolio item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Portfolio Item</h1>
        <p className="text-gray-600 mt-1">Showcase your best work</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* English Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">English Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English) *</label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Project Title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (English) *</label>
              <textarea
                required
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="Describe the project..."
              />
            </div>
          </div>
        </div>

        {/* Hindi Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hindi Details (हिन्दी)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Hindi)</label>
              <input
                type="text"
                value={formData.titleHi}
                onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="शीर्षक"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Hindi)</label>
              <textarea
                value={formData.descriptionHi}
                onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="विवरण..."
              />
            </div>
          </div>
        </div>

        {/* Marathi Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Marathi Details (मराठी)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Marathi)</label>
              <input
                type="text"
                value={formData.titleMr}
                onChange={(e) => setFormData({ ...formData, titleMr: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="शीर्षक"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Marathi)</label>
              <textarea
                value={formData.descriptionMr}
                onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="वर्णन..."
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Category</h2>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Project Images</h2>
          <p className="text-sm text-gray-600 mb-4">Upload up to 10 images (max 10MB each)</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {imagePreviews.length < 10 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Featured */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-700">Mark as Featured</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Portfolio Item'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
