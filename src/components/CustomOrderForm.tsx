import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendTelegramMessage } from '../api/sendTelegram';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const productCategories = [
  'Select Category',
  'Neon Light Text',
  'Neon Light Decor',
  'Glowsigns',
  'Light Frames',
  'Flex Banners',
  '3D Letter Banner',
  'Glow Boards',
  'Stand Banners',
  'Digital Boards',
  'Other'
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
}

export default function CustomOrderForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    category: 'Select Category',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        if (!PHONE_REGEX.test(value.replace(/[-()\s]/g, ''))) {
          return 'Please enter a valid 10-digit Indian phone number';
        }
        return '';
      case 'category':
        if (!value || value === 'Select Category') return 'Please select a category';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Please provide more details (at least 10 characters)';
        if (value.trim().length > 500) return 'Description is too long (maximum 500 characters)';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendTelegramMessage({
        orderType: 'custom',
        ...formData
      });

      // Store order in localStorage
      const orders = JSON.parse(localStorage.getItem('customOrders') || '[]');
      const newOrder = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem('customOrders', JSON.stringify(orders));

      toast.success('Custom order submitted successfully! We will contact you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Select Category',
        description: '',
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Error submitting custom order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (fieldName: string) => `
    w-full px-4 py-2 border rounded-lg 
    focus:ring-2 focus:ring-primary focus:border-transparent 
    transition-all duration-300
    ${errors[fieldName] && touched[fieldName]
      ? 'border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:ring-[#659287]/20'
    }
    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 animate-fadeIn opacity-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClassName('name')}
            disabled={isSubmitting}
            required
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClassName('email')}
            disabled={isSubmitting}
            required
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClassName('phone')}
            disabled={isSubmitting}
            required
          />
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">
            Product Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${inputClassName('category')} bg-white`}
            disabled={isSubmitting}
            required
          >
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && touched.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
        <label className="block text-sm font-medium text-gray-700">
          Order Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={4}
          className={inputClassName('description')}
          disabled={isSubmitting}
          required
          placeholder="Please describe your custom order requirements..."
        />
        {errors.description && touched.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            bg-[#808000] text-white px-6 py-3 rounded-lg font-semibold 
            inline-flex items-center space-x-2 
            hover:bg-[#606000] transform transition-all duration-300 
            hover:scale-105 hover:shadow-lg
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Order</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}