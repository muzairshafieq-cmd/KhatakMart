import { useEffect, useState } from 'react';
import { Package, Truck, Clock, Shield } from 'lucide-react';
import { supabase, Category, Product } from '../lib/supabase';
import { ProductCard } from './ProductCard';

interface HomePageProps {
  onViewProduct: (product: Product) => void;
  onCategorySelect: (categoryId: string) => void;
}

export function HomePage({ onViewProduct, onCategorySelect }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesResult, productsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_available', true)
          .order('created_at', { ascending: false })
          .limit(8),
      ]);

      if (categoriesResult.data) setCategories(categoriesResult.data);
      if (productsResult.data) setFeaturedProducts(productsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Khattak MART
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-green-50">
              Your trusted online grocery store in Islamabad
            </p>
            <p className="text-lg mb-8">
              Quality groceries, frozen foods, and packaged milk delivered to your doorstep
            </p>
            <button
              onClick={() => {
                const section = document.getElementById('products');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-50 transition"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Free Delivery</h3>
                <p className="text-sm text-gray-600">No delivery charges</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quick Service</h3>
                <p className="text-sm text-gray-600">Fast order processing</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quality Products</h3>
                <p className="text-sm text-gray-600">Fresh & genuine items</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Easy Payment</h3>
                <p className="text-sm text-gray-600">COD & Easypaisa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Shop by Category
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-center group"
                >
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
                    <Package className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Products
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Khattak MART</h3>
              <p className="text-gray-300 mb-2">
                Your trusted online grocery store
              </p>
              <p className="text-gray-400">DHA Phase 2, Islamabad, Pakistan</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Cash on Delivery (COD)</li>
                <li>Easypaisa: +92 315 5770026</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">
                WhatsApp: +92 315 5770026
              </p>
              <p className="text-gray-400 mt-4">
                Free delivery on all orders
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Khattak MART. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
