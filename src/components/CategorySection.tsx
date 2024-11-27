import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface CategorySectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function CategorySection({ title, products, onAddToCart }: CategorySectionProps) {
  const sectionRef = useScrollAnimation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={sectionRef as any} className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-heading animate-fadeIn">
        {title}
      </h3>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div className="flex space-x-6 p-1">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="w-72 flex-shrink-0"
                style={{ 
                  animation: `fadeIn 0.8s ease-out forwards`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}