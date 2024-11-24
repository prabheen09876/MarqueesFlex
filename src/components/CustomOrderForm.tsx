import { useState, useRef } from 'react';
import { Upload, X, Send } from 'lucide-react';
import type { CustomOrder } from '../types';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CustomOrderForm() {
  const [formData, setFormData] = useState<Partial<CustomOrder>>({
    name: '',
    email: '',
    phone: '',
    description: '',
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + previewUrls.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const invalidFile = files.find(file => file.size > MAX_FILE_SIZE);
    if (invalidFile) {
      setError('Files must be less than 5MB');
      return;
    }

    setError('');
    
    // Store selected files
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview URLs for the new files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('description', formData.description || '');

      // Append each file to FormData
      selectedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      console.log('Submitting form with files:', selectedFiles);

      // In development, use relative URL, in production use the full URL
      const baseUrl = import.meta.env.MODE === 'production' 
        ? import.meta.env.VITE_API_URL || ''
        : '';
      
      const response = await fetch(`${baseUrl}/api/orders/custom`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const responseClone = response.clone();
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.error || 'Failed to submit order');
        } catch (jsonError) {
          // If JSON parsing fails, try to get the text content
          const textError = await responseClone.text();
          console.error('Error response text:', textError);
          throw new Error('Server error. Please try again later.');
        }
      }

      try {
        const data = await response.json();
        console.log('Order submitted successfully:', data);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          description: '',
          images: [],
        });
        setSelectedFiles([]);
        setPreviewUrls(prev => {
          // Revoke all URLs
          prev.forEach(url => URL.revokeObjectURL(url));
          return [];
        });
        setSuccess('Order submitted successfully! We will contact you soon.');
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setError('Failed to submit order. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="custom-order-form">
      <h2>Custom Order Form</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-fields">
        <div>
          <label htmlFor="name" className="label">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="label">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="input-field"
            required
            placeholder="+91 0000000000"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Project Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            required
            placeholder="Please describe your project requirements..."
          />
        </div>

        <div className="file-upload-section">
          <label className="label">Upload Images (Max 5 files, 5MB each)</label>
          <div 
            className="file-drop-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <Upload className="upload-icon" />
            <span>Click to upload images</span>
          </div>

          {previewUrls.length > 0 && (
            <div className="preview-container">
              {previewUrls.map((url, index) => (
                <div key={url} className="preview-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="remove-button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          'Submitting...'
        ) : (
          <>
            <Send size={20} />
            Submit Order
          </>
        )}
      </button>
    </form>
  );
}