'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/i18n';

interface Product {
  _id: string;
  name: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  customizationOptions: {
    sizes: string[];
    materials: string[];
  };
  basePrice?: number;
  featured: boolean;
  active: boolean;
}

interface ProductPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathParams = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  const productId = pathParams.id as string;

  useEffect(() => {
    params.then((p) => setCurrentLocale(p.locale));
  }, [params]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.customizationOptions?.sizes?.length > 0) {
            setSelectedSize(data.customizationOptions.sizes[0]);
          }
          if (data.customizationOptions?.materials?.length > 0) {
            setSelectedMaterial(data.customizationOptions.materials[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleRequestQuote = () => {
    const enquiryData = {
      productId: product?._id,
      productName: product?.name,
      customization: {
        size: selectedSize,
        material: selectedMaterial,
        quantity,
        notes,
      },
    };
    
    // Store in sessionStorage to use on enquiry page
    sessionStorage.setItem('enquiryData', JSON.stringify(enquiryData));
    router.push(`/${currentLocale}/request-quote`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link
            href={`/${currentLocale}/services`}
            className="text-blue-600 hover:underline"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const getName = (nameObj: { en: string; hi: string; mr: string }) => {
    return nameObj[currentLocale] || nameObj.en;
  };

  const getDescription = (descObj: { en: string; hi: string; mr: string }) => {
    return descObj[currentLocale] || descObj.en;
  };

  const categoryIcons: Record<string, string> = {
    personal: '🎨',
    acrylic: '🏷️',
    led: '💡',
    standees: '📊',
    stickers: '🏷️',
    hoardings: '📢',
    banners: '🚩',
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href={`/${currentLocale}/home`}
              className="text-gray-600 hover:text-blue-600"
            >
              {t('common.home')}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={`/${currentLocale}/services`}
              className="text-gray-600 hover:text-blue-600"
            >
              {t('common.services')}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{getName(product.name)}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={getName(product.name)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {categoryIcons[product.category] || '📦'}
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Customization */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-blue-600 font-medium">
                {categoryIcons[product.category]} {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{getName(product.name)}</h1>
            <p className="text-gray-600 mb-6">{getDescription(product.description)}</p>

            {product.basePrice && (
              <div className="mb-6">
                <span className="text-2xl font-bold text-blue-600">
                  Starting at ₹{product.basePrice}
                </span>
                <span className="text-gray-500 text-sm ml-2">* Final price depends on customization</span>
              </div>
            )}

            {/* Customization Options */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('product.customization')}
              </h2>

              {/* Size Selection */}
              {product.customizationOptions?.sizes?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('product.selectSize')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.customizationOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Material Selection */}
              {product.customizationOptions?.materials?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('product.selectMaterial')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.customizationOptions.materials.map((material) => (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedMaterial === material
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('product.quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('product.notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('product.notesPlaceholder')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <button
                onClick={handleRequestQuote}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {t('product.requestQuote')}
                <Check className="ml-2 w-5 h-5" />
              </button>
              <p className="text-center text-gray-500 text-sm mt-2">
                We&apos;ll get back to you with a custom quote within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
