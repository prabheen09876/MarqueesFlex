import { useState } from 'react';
import { Send } from 'lucide-react';

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function CustomOrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          placeholder="+91 0000000000"
        />
      </div>

      <div className="space-y-2 transition-all duration-300 hover:translate-y-1">
        <label className="block text-sm font-medium text-gray-700">Project Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          required
          placeholder="Please describe your project requirements..."
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-[#0A3981] text-white rounded-lg font-semibold transform transition-all duration-300 hover:bg-[#1F509A] hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="inline-flex items-center space-x-2 group">
              <Send className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              <span>Submit Order</span>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}