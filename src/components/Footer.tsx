import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info & Social Media */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-50 font-bold mb-4">MarqueesFlex</h3>
            <p className="text-gray-300">
              Your trusted partner for premium marquee solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xl text-gray-50 font-bold mb-4">Contact Us</h3>
            <div className="text-gray-300">
            
              <p>MarqueesFlex</p>
              <p>B-35, Vishwas Park Main Rd, Raja Puri</p>
              <p>Dwarka, New Delhi - 110059</p>
              <p>India</p>
              <p className="mt-4">
                <a href="tel:+919868040894" className="hover:text-blue-400">Phone: +91 9868040894</a>
              </p>
              <p>
                <a href="mailto:marqueesflex@gmail.com" className="hover:text-blue-400">Email: marqueesflex@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Google Maps */}
          <div className="w-full h-[300px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.770189750829!2d77.04967231118604!3d28.606670285153026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bfb2da4f36f%3A0xbfe50487c801adcb!2sMarqueesFlex!5e0!3m2!1sen!2sin!4v1733119673219!5m2!1sen!2sin"
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} MarqueesFlex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
