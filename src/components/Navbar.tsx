import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Logo from '../assets/lo.png';
import CartModal from './CartModal';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <>
      <nav className="sticky top-4 left-0 right-0 z-50 mx-4">
        <div className="bg-[#FFFDD0]/90 backdrop-blur-sm rounded-full shadow-lg max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-16 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="MarqueesFlex Logo" className="h-7 w-auto" />
                <span className="ml-2 text-xl font-bold text-[#808000] transition-colors duration-300">
                  MarqueesFlex
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Products</a>
              <a href="#custom" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Custom Orders</a>
              <a href="#about" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">About</a>
              <Link to="/admin" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Admin</Link>
              <button
                onClick={handleCartClick}
                className="relative p-2 text-[#808000] hover:text-[#606000] transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <ShoppingCart className="h-6 w-6 transition-transform duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#808000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-[#808000] hover:text-[#606000] transition-all duration-300 transform hover:scale-110 active:scale-95 mr-2"
              >
                <ShoppingCart className="h-6 w-6 transition-transform duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#808000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-[#808000] hover:text-[#606000] transition-colors duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#FFFDD0]/95 backdrop-blur-sm rounded-3xl shadow-lg p-6 mx-4">
            <div className="flex flex-col space-y-4">
              <a href="#products" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Products</a>
              <a href="#custom" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Custom Orders</a>
              <a href="#about" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">About</a>
              <Link to="/admin" className="text-[#808000] hover:text-[#606000] transition-colors duration-300 font-medium">Admin</Link>
            </div>
          </div>
        )}
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}