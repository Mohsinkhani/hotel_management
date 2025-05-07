import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              Lerelax Hotel
            </h3>
            <p className="mb-6 text-blue-100 leading-relaxed">
              Experience unparalleled luxury and comfort in the heart of the city.
            </p>
            <div className="flex space-x-5">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Twitter size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-blue-400 to-blue-600">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-blue-100 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-all duration-200"></span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-blue-100 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-all duration-200"></span>
                  <span>Rooms & Suites</span>
                </a>
              </li>
              <li>
                <a
                  href="/amenities"
                  className="text-blue-100 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-all duration-200"></span>
                  <span>Amenities</span>
                </a>
              </li>
              <li>
                <a
                  href="/dining"
                  className="text-blue-100 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-all duration-200"></span>
                  <span>Dining</span>
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-blue-100 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-all duration-200"></span>
                  <span>Events</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-blue-400 to-blue-600">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="p-1.5 bg-blue-800 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="text-blue-300" size={16} />
                </div>
                <span className="text-blue-100">7328 king abdulaziz Rd, 4656, Almatar, Buqayq 33261</span>
              </li>
              <li className="flex items-center">
                <div className="p-1.5 bg-blue-800 rounded-lg mr-3 flex-shrink-0">
                  <Phone className="text-blue-300" size={16} />
                </div>
                <span className="text-blue-100">+966 560000517</span>
              </li>
              <li className="flex items-center">
                <div className="p-1.5 bg-blue-800 rounded-lg mr-3 flex-shrink-0">
                  <Mail className="text-blue-300" size={16} />
                </div>
                <span className="text-blue-100">info@lerelax.online</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-blue-400 to-blue-600">
              Newsletter
            </h3>
            <p className="mb-5 text-blue-100 leading-relaxed">
              Subscribe to receive updates on special offers and events.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-transparent bg-gradient-to-r from-transparent via-blue-700 to-transparent">
          <p className="text-center text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} Lerelax Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;