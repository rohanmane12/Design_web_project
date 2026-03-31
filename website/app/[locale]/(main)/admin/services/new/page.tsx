'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    nameMr: '',
    descriptionEn: '',
    descriptionHi: '',
    descriptionMr: '',
    category: 'personal',
    sizes: '',
    materials: '',
    basePrice: '',
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
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setImages([...images, ...files]);
    
    // Create previews
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
      // Upload images first
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

      // Create service
      const serviceData = {
        name: {
          en: formData.nameEn,
          hi: formData.nameHi,
          mr: formData.nameMr,
        },
        description: {
          en: formData.descriptionEn,
          hi: formData.descriptionHi,
          mr: formData.descriptionMr,
        },
        category: formData.category,
        images: imageUrls,
        customizationOptions: {
          sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
          materials: formData.materials.split(',').map(m => m.trim()).filter(Boolean),
        },
        basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        featured: formData.featured,
        active: true,
      };

      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        router.push('/admin/services');
      } else {
        alert('Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Service</h1>
        <p className="text-gray-600 mt-1">Create a new service listing</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* English Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">English Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., Acrylic Name Plates"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (English) *
              </label>
              <textarea
                required
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="Describe the service..."
              />
            </div>
          </div>
        </div>

        {/* Hindi Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hindi Details (हिन्दी)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name (Hindi)
              </label>
              <input
                type="text"
                value={formData.nameHi}
                onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., एक्रिलिक नाम प्लेट"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Hindi)
              </label>
              <textarea
                value={formData.nameHi}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name (Marathi)
              </label>
              <input
                type="text"
                value={formData.nameMr}
                onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="e.g., ॲक्रिलिक नेम प्लेट्स"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Marathi)
              </label>
              <textarea
                value={formData.nameMr}
                onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="वर्णन..."
              />
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price (₹)
              </label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="999"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Sizes (comma separated)
              </label>
              <input
                type="text"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="A4, A3, Custom"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Materials (comma separated)
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Matte, Glossy, Premium"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Images</h2>
          <p className="text-sm text-gray-600 mb-4">Upload up to 5 images (max 10MB each)</p>
          
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
            
            {imagePreviews.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Options */}
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
            {loading ? 'Creating...' : 'Create Service'}
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
