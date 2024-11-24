import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import CustomOrderForm from '../components/CustomOrderForm';
import type { Product, CartItem } from '../types';
import { Sparkles, MessageSquare } from 'lucide-react';
import FlexBannerImage from '../assets/AD.png';

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

];

const categories = [
  {
    id: '1',
    name: 'Neon Signs',
    description: 'Custom-made neon signs for businesses and homes',
    image: 'https://plus.unsplash.com/premium_photo-1673601435829-42d9bf5414b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG5lb24lMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: '2',
    name: 'Flex Banners',
    description: 'High-quality flex banners for indoor and outdoor use',
    image: FlexBannerImage
  },
  {
    id: '3',
    name: 'LED Photo Frames',
    description: 'Illuminated photo frames for a unique display',
    image: 'https://i.pinimg.com/736x/63/4c/c1/634cc1e3914901728d06d9479bc1552c.jpg'
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
      <section className="text-center py-12">
        <h1 className="text-6xl font-bold mb-4 text-heading ">
          Custom LED Frames & Neon Signs
        </h1>
        <p className="text-xl mb-8 text-body max-w-2xl mx-auto">
          Transform your space with our custom-made LED signs. Perfect for businesses, events, or personal decor.
        </p>
        <a
          href="#custom"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Start Your Custom Order</span>
        </a>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="card group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading">
                {category.name}
              </h3>
              <p className="text-body">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="card text-center">
              <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: 'var(--background-primary)' }}>
                {feature.icon()}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading">
                {feature.title}
              </h3>
              <p className="text-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
          Our Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section id="custom" className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-heading text-center">
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