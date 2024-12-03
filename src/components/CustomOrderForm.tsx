import { useState } from 'react';
import { Send } from 'lucide-react';

interface ApiResponse {
  success: boolean;
  message: string;
}

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

export default function CustomOrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Select Category',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category === 'Select Category') {
      setError('Please select a product category');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/sendTelegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data: ApiResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to process server response');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit order');
      }

      setSuccess('Order submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Select Category',
        description: '',
      });
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 animate-fadeIn opacity-100">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg animate-fadeIn">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-lg animate-fadeIn">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
          <label className="block text-sm font-medium text-gray-700">Product Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white"
            required
          >
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 transition-all duration-300 hover:translate-x-1">
        <label className="block text-sm font-medium text-gray-700">Order Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          required
          placeholder="Please describe your custom order requirements..."
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            bg-[#808000] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 hover:bg-[#606000] transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Order
            </>
          )}
        </button>
      </div>
    </form>
  );
}