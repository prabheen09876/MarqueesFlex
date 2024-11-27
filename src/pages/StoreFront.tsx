import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
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

const products: Product[] = [
  {
    id: '1',
    name: 'Custom Neon Sign',
    description: 'Personalized LED neon sign, perfect for home or business',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1595794279832-5f7d62ca6b0a?auto=format&fit=crop&q=80&w=800',
    category: 'neon'
  },
  {
    id: '2',
    name: 'Premium Flex Banner',
    description: 'High-quality flex banner with UV-resistant ink',
    price: 79.99,
    image: FlexBannerImage,
    category: 'banner'
  },
  {
    id: '3',
    name: 'LED Photo Frame',
    description: 'Illuminated photo frame with crystal-clear display',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
    category: 'frame'
  },
  // New Anime Products
  {
    id: '4',
    name: 'Naruto LED Frame',
    description: 'Custom LED frame featuring Naruto characters',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'anime'
  },
  {
    id: '5',
    name: 'Dragon Ball Z Frame',
    description: 'Illuminated frame with Dragon Ball Z artwork',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'anime'
  },
  // Aesthetic Products
  {
    id: '6',
    name: 'Vaporwave Aesthetic Frame',
    description: 'Retro vaporwave style LED frame',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'aesthetic'
  },
  {
    id: '7',
    name: 'Minimalist LED Design',
    description: 'Clean, minimalist LED frame design',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'aesthetic'
  },
  // Car Products
  {
    id: '8',
    name: 'Sports Car Frame',
    description: 'LED frame featuring luxury sports cars',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'cars'
  },
  {
    id: '9',
    name: 'Classic Cars Collection',
    description: 'Vintage and classic cars LED frame collection',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    category: 'cars'
  }
];

const categories = [
  {
    id: '1',
    name: 'Neon Signs',
    description: 'Custom-made neon signs for businesses and homes',
    image: NeonSignImage
  },
  {
    id: '2',
    name: 'Flex Banners',
    description: 'High-quality flex banners for indoor and outdoor use',
    image: FlexBannerImage
  },
  {
    id: '3',
    name: 'Glow Boards',
    description: 'Illuminated display boards with stunning visual effects',
    image: GlowBoardImage
  },
  {
    id: '4',
    name: 'Light Frames',
    description: 'Modern LED frames for eye-catching displays',
    image: LightFrameImage
  },
  {
    id: '5',
    name: '3D Letter Boards',
    description: 'Three-dimensional letter boards for impactful signage',
    image: LetterBoardImage
  },
  {
    id: '6',
    name: 'Stand Banners',
    description: 'Portable stand banners perfect for events and exhibitions',
    image: StandBannerImage
  },
  {
    id: '7',
    name: 'Premium Posters',
    description: 'High-resolution posters for promotional and decorative use',
    image: PosterImage
  },
  {
    id: '8',
    name: 'Glow Signs',
    description: 'Vibrant glow signs for businesses and events',
    image: GlowSignImage
  }
];

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
      <section ref={heroRef as any} className="text-center py-12 animate-blurIn">
        <h1 className="text-6xl font-bold mb-4 text-heading animate-float">
          Custom LED Frames & Neon Signs
        </h1>
        <p className="text-xl mb-8 text-body max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          Transform your space with our custom-made LED signs. Perfect for businesses, events, or personal decor.
        </p>
        <button
          onClick={() => {
            const element = document.getElementById('custom');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#0A3981] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 hover:bg-[#1F509A] transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Start Your Custom Order</span>
        </button>
      </section>

      <section ref={categoriesRef as any} className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center animate-fadeIn">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
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
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
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
              <div className="inline-block p-3 rounded-full mb-4 bg-[#0A3981] text-white">
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
        
        <CategorySection
          title="Anime Collection"
          products={products.filter(p => p.category === 'anime')}
          onAddToCart={addToCart}
        />
        
        <CategorySection
          title="Aesthetic Collection"
          products={products.filter(p => p.category === 'aesthetic')}
          onAddToCart={addToCart}
        />
        
        <CategorySection
          title="Car Collection"
          products={products.filter(p => p.category === 'cars')}
          onAddToCart={addToCart}
        />

        <h2 className="text-3xl font-bold my-8 text-heading text-center">
          Our Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(p => ['neon', 'banner', 'frame', 'flex'].includes(p.category)).map((product, index) => (
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