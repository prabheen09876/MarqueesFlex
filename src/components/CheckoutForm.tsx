// CheckoutForm.tsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { CartItem } from '../types';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function CheckoutForm({ items, total, onSubmit, onCancel, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        if (!value.includes('@') || !value.includes('.')) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value || !value.trim()) return 'Phone is required';
        const cleanPhone = value.replace(/[-()\s]/g, '');
        if (!/^[0-9]{10}$/.test(cleanPhone)) {
          return 'Please enter a valid 10-digit phone number';
        }
        return '';
      case 'address':
        if (!value || !value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        if (value.trim().length > 200) return 'Address is too long';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (field !== 'notes') {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format phone number as user types
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

    // Touch all fields to show validation errors
    const allFields = ['name', 'email', 'phone', 'address'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitStatus('submitting');

    try {
      onSubmit(formData);
      setSubmitStatus('success');
      localStorage.removeItem('checkoutFormData'); // Clear saved form data
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
    }
  };

  const inputClassName = (fieldName: string) => `
    mt-1 block w-full rounded-md shadow-sm
    focus:border-[#659287] focus:ring-[#659287]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${errors[fieldName] && touched[fieldName] ? 'border-red-500' : 'border-gray-300'}
    transition-colors duration-200
  `;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#659287] mb-6">Checkout Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClassName('name')}
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputClassName('email')}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="10-digit mobile number"
            className={inputClassName('phone')}
            disabled={isSubmitting}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && touched.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-500" role="alert">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={3}
            className={inputClassName('address')}
            disabled={isSubmitting}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && touched.address && (
            <p id="address-error" className="mt-1 text-sm text-red-500" role="alert">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-[#659287] focus:ring-[#659287] disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="border-t pt-4 mt-6">
          <p className="text-lg font-semibold text-gray-700">Total Amount: ₹{total.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
              border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'submitting'}
            className={`px-6 py-2 text-sm font-medium text-white bg-[#659287] rounded-md 
              flex items-center space-x-2 transition-all duration-200
              ${(isSubmitting || submitStatus === 'submitting')
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#4e726a] hover:shadow-md'}`}
          >
            {(isSubmitting || submitStatus === 'submitting') ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Place Order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}