import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Luxe Hotel</h3>
            <p className="mb-4 text-blue-100">
              Experience unparalleled luxury and comfort in the heart of the city.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-200"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Rooms & Suites
                </a>
              </li>
              <li>
                <a
                  href="/amenities"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Amenities
                </a>
              </li>
              <li>
                <a
                  href="/dining"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Dining
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>123 Luxury Avenue, Cityville, State 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0" size={18} />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0" size={18} />
                <span>info@luxehotel.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4 text-blue-100">
              Subscribe to receive updates on special offers and events.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-blue-800">
          <p className="text-center text-blue-200">
            &copy; {new Date().getFullYear()} Luxe Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;