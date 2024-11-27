import { Plus } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-500 hover:shadow-xl hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-white/90 text-primary py-2 rounded-lg font-semibold transform transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4 transition-all duration-300 group-hover:bg-gray-50">
        <h3 className="text-lg font-semibold mb-2 text-heading transition-all duration-300 group-hover:translate-x-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 transition-all duration-300 group-hover:text-gray-800">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary animate-pulse">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <div className="text-sm text-gray-500 transition-all duration-300 group-hover:text-primary">
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );
}