import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../types';
import CheckoutForm from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting order with data:', formData);

      const response = await fetch('/api/orders/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        })
      });

      let data: ApiResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to process server response');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear cart and close
      items.forEach(item => onRemove(item.id));
      onClose();
      alert('Order placed successfully! We will contact you soon.');
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-[#659287]">
              {showCheckoutForm ? 'Checkout' : 'Shopping Cart'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-[#659287]"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {showCheckoutForm ? (
              <CheckoutForm
                items={items}
                total={total}
                onSubmit={handleCheckout}
                onCancel={() => setShowCheckoutForm(false)}
                isSubmitting={isSubmitting}
              />
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#659287]">{item.name}</h3>
                      <p className="text-sm text-[#B1C29E]">₹{item.price.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 rounded-md hover:bg-gray-200 text-[#659287]"
                          disabled={isSubmitting}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-200 text-[#659287]"
                          disabled={isSubmitting}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-500 hover:text-red-500"
                      disabled={isSubmitting}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!showCheckoutForm && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-[#659287]">Total:</span>
                <span className="font-semibold text-[#659287]">
                  ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <button
                disabled={items.length === 0 || isSubmitting}
                onClick={() => setShowCheckoutForm(true)}
                className="w-full bg-[#659287] text-white py-2 rounded-full hover:bg-[#B1C29E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}