import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useProducts } from '../hooks/useProducts';
import { getCategories } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import CustomOrderForm from '../components/CustomOrderForm';
import CategorySection from '../components/CategorySection';
import type { Product, CartItem } from '../types';
import { Sparkles, MessageSquare } from 'lucide-react';
import FlexBannerImage from '../assets/AD.png';
import GlowBoardImage from '../assets/glowboard.png';
import GlowBoard1Image from '../assets/glowboard1.png';
import GlowBoard2Image from '../assets/glowboard2.png';
import GlowSignImage from '../assets/glowsign.png';
import LightFrameImage from '../assets/lightframe.png';
import NeonSignImage from '../assets/neonsign.png';
import LetterBoardImage from '../assets/3dletterboard.png';
import FlexBoardImage from '../assets/flexboard.png';
import StandBannerImage from '../assets/standbanner.png';
import PosterImage from '../assets/poster1.png';

const features = [
  {
    id: '1',
    title: 'Quality Craftsmanship',
    description: 'We pride ourselves on delivering high-quality products that exceed our customers\' expectations',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14M9 17v1a2 2 0 002 2h3a2 2 0 002-2v-1M7 9h10a2 2 0 002-2V3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm0 2h3v2m0-4h3v2m0-4h3v2zM7 9h1v2H7v-2zm0 4h1v2H7v-2zm0 4h1v2H7v-2z" /></svg>
  },
  {
    id: '2',
    title: 'Fast Turnaround Times',
    description: 'We understand the importance of meeting deadlines, which is why we offer fast turnaround times for all our products',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: '3',
    title: 'Competitive Pricing',
    description: 'We offer competitive pricing for all our products, ensuring you get the best value for your money',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" /></svg>
  }
];

export default function StoreFront() {
  const heroRef = useScrollAnimation();
  const categoriesRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const productsRef = useScrollAnimation();
  const customOrderRef = useScrollAnimation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { products, loading, error, getProductsByCategory } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4">
      <section ref={heroRef as any} className="text-center py-12">
        <h1 className="text-6xl font-bold mb-4 text-heading ">
          Custom LED Frames & Neon Signs
        </h1>
        <p className="text-xl mb-8 text-body max-w-2xl mx-auto ">
          Transform your space with our custom-made LED signs. Perfect for businesses, events, or personal decor.
        </p>
        <button
          onClick={() => {
            const element = document.getElementById('products');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#808000] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 hover:bg-[#606000] transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Start Your Custom Order</span>
        </button>
      </section>

      <section ref={categoriesRef as any} className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center animate-fadeIn">
          Popular Categories
        </h2>
        {categoriesLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#808000]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter(category => category.featured)
              .map((category, index) => (
                <div 
                  key={category.id} 
                  className="card group cursor-pointer hover:shadow-lg transition-all duration-500"
                  style={{ 
                    animation: `fadeIn 0.8s ease-out forwards`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover transform transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-heading transition-transform duration-300 group-hover:translate-x-2">
                    {category.name}
                  </h3>
                  <p className="text-body text-sm transition-all duration-300 group-hover:text-primary">
                    {category.description}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>

      <section ref={featuresRef as any} className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="card text-center transform transition-all duration-500"
              style={{ 
                animation: `fadeIn 0.8s ease-out forwards`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-[#808000] text-white">
                {feature.icon()}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading transition-all duration-300 hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-body transition-all duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section ref={productsRef as any} id="products" className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
          Featured Collections
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#808000]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">
            {error}
          </div>
        ) : (
          <>
            <CategorySection
              title="Car Collection"
              products={getProductsByCategory('car')}
              onAddToCart={addToCart}
            />
            
            <CategorySection
              title="Anime Collection"
              products={getProductsByCategory('anime')}
              onAddToCart={addToCart}
            />
            
            <CategorySection
              title="Aesthetic Collection"
              products={getProductsByCategory('aesthetic')}
              onAddToCart={addToCart}
            />

            <h2 className="text-3xl font-bold my-8 text-heading text-center">
              Our Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => p.category === 'our-products')
                .map((product, index) => (
                  <div 
                    key={product.id}
                    className="transform transition-all duration-500"
                    style={{ animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s` }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </section>

      <section ref={customOrderRef as any} id="custom" className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center animate-fadeIn">
          Custom Order
        </h2>
        <CustomOrderForm />
      </section>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}