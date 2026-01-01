import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();

  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Khattak MART</h1>
              <p className="text-xs text-green-100">DHA Phase 2, Islamabad</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-green-200 transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('categories');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-green-200 transition"
            >
              Categories
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('products');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-green-200 transition"
            >
              Products
            </button>
          </nav>

          <button
            onClick={onCartClick}
            className="relative bg-white text-green-600 p-2 rounded-full hover:bg-green-50 transition"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-green-200 transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('categories');
                section?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-green-200 transition"
            >
              Categories
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('products');
                section?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-green-200 transition"
            >
              Products
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
