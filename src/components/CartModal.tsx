import React, { useEffect, useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';
import { toast } from 'react-hot-toast';
import { sendTelegramNotification } from '../utils/api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowCheckoutForm(false); // Reset checkout form when modal closes
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);

      // Prepare order message
      const orderMessage = `
🛍️ New Order!
${items.map(item => `
- ${item.name}
  Quantity: ${item.quantity}
  Price: ₹${formatPrice(item.price)}
`).join('')}

Total: ₹${formatPrice(totalPrice)}
      `;

      // Use the utility function instead of direct fetch
      await sendTelegramNotification(orderMessage);

      // Clear cart and show success message
      clearCart();
      toast.success('Order placed successfully!');
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className={`w-screen max-w-md transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="h-full bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-[#FFFDD0]">
              <h2 className="text-xl font-semibold text-[#808000]">
                {showCheckoutForm ? 'Checkout' : `Your Cart (${totalItems} items)`}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6 text-[#808000]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#FFFDD0]">
              {showCheckoutForm ? (
                <div className="p-6">
                  <CheckoutForm
                    items={items}
                    total={totalPrice}
                    onSubmit={handleCheckout}
                    onCancel={() => setShowCheckoutForm(false)}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ) : totalItems === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mb-4 animate-bounce" />
                  <h3 className="text-xl font-medium text-[#808000] mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#808000] text-white rounded-full hover:bg-[#606000] transition-all duration-300 hover:scale-105 transform"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      )}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-[#808000]">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-600">₹{formatPrice(item.price)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            disabled={isSubmitting}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            disabled={isSubmitting}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with total and checkout button */}
            {!showCheckoutForm && totalItems > 0 && (
              <div className="border-t p-6 bg-[#FFFDD0]">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-[#808000]">Total</span>
                  <span className="font-medium text-[#808000]">
                    ₹{formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#808000] text-white rounded-full hover:bg-[#606000] transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
