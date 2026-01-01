import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout, OrderConfirmation } from './components/Checkout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, supabase } from './lib/supabase';

type View = 'home' | 'checkout' | 'order-confirmation' | 'admin';

function AppContent() {
  const { admin } = useAuth();
  const [view, setView] = useState<View>('home');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [showCategoryProducts, setShowCategoryProducts] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#admin') {
      setView('admin');
    }
  }, []);

  const handleCategorySelect = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .eq('is_available', true);

      if (error) throw error;

      if (data) {
        setCategoryProducts(data);
        setShowCategoryProducts(true);
      }
    } catch (error) {
      console.error('Error loading category products:', error);
    }
  };

  const handleCheckoutSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setView('order-confirmation');
  };

  const handleBackHome = () => {
    setView('home');
    setShowCategoryProducts(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'admin') {
    if (!admin) {
      return <AdminLogin onLoginSuccess={() => setView('admin')} />;
    }
    return <AdminDashboard />;
  }

  if (view === 'order-confirmation') {
    return <OrderConfirmation orderNumber={orderNumber} onBackHome={handleBackHome} />;
  }

  if (view === 'checkout') {
    return (
      <Checkout
        onBack={() => setView('home')}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header onCartClick={() => setShowCart(true)} />

      {showCategoryProducts && categoryProducts.length > 0 ? (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setShowCategoryProducts(false)}
              className="text-green-600 hover:text-green-700 mb-6 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8">Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="h-48 bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <HomePage
          onViewProduct={setSelectedProduct}
          onCategorySelect={handleCategorySelect}
        />
      )}

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => setView('checkout')}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
