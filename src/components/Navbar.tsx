import React, { useState, useEffect } from 'react';
import { Menu, X, User, Moon, Sun, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You could implement actual dark mode functionality here
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center text-2xl font-serif font-bold text-blue-900">
              <BookOpen className="mr-2" size={28} />
              <span>Luxe Hotel</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Home
            </a>
            <a
              href="/rooms"
              className="text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Rooms
            </a>
            <a
              href="/amenities"
              className="text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Amenities
            </a>
            <a
              href="/about"
              className="text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              Contact
            </a>
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md font-medium">
              Book Now
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="/login"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Login"
            >
              <User size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-b">
            <a
              href="/"
              className="block text-gray-800 hover:text-blue-700 transition-colors duration-200 py-2 font-medium"
            >
              Home
            </a>
            <a
              href="/rooms"
              className="block text-gray-800 hover:text-blue-700 transition-colors duration-200 py-2 font-medium"
            >
              Rooms
            </a>
            <a
              href="/amenities"
              className="block text-gray-800 hover:text-blue-700 transition-colors duration-200 py-2 font-medium"
            >
              Amenities
            </a>
            <a
              href="/about"
              className="block text-gray-800 hover:text-blue-700 transition-colors duration-200 py-2 font-medium"
            >
              About
            </a>
            <a
              href="/contact"
              className="block text-gray-800 hover:text-blue-700 transition-colors duration-200 py-2 font-medium"
            >
              Contact
            </a>
            <div className="flex justify-between items-center pt-2">
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md flex-grow mr-2 font-medium">
                Book Now
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a
                href="/login"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ml-2"
                aria-label="Login"
              >
                <User size={20} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;