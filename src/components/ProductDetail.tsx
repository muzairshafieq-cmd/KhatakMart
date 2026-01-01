import { X, ShoppingCart, Package, Calendar } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-32 w-32 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>
                  {product.description && (
                    <p className="text-gray-600">{product.description}</p>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <span className="text-4xl font-bold text-green-600">
                    Rs. {product.price.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Availability:</span>
                    <span
                      className={`font-semibold ${
                        product.is_available ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Stock Remaining:</span>
                      <span className="font-semibold text-orange-600">
                        Only {product.stock_quantity} left
                      </span>
                    </div>
                  )}

                  {product.manufacturing_date && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Manufacturing Date:</span>
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatDate(product.manufacturing_date)}
                      </span>
                    </div>
                  )}

                  {product.expiry_date && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expiry Date:</span>
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatDate(product.expiry_date)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.is_available}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Free Delivery
                  </p>
                  <p className="text-xs text-blue-600">
                    No delivery charges on all orders in DHA Phase 2, Islamabad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
