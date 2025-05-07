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
  };

  const navLinkClass = isScrolled
    ? 'text-gray-800 hover:text-blue-700'
    : 'text-white hover:text-blue-300';

  const iconButtonClass = isScrolled
    ? 'hover:bg-gray-100'
    : 'hover:bg-white/30';

  const bookButtonClass = isScrolled
    ? 'bg-blue-900 hover:bg-blue-800 text-white'
    : 'bg-white hover:bg-gray-100 text-blue-900';

  const navLinks = ['Home', 'Rooms', 'Amenities', 'About', 'Contact'];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className={`flex items-center text-2xl font-serif font-bold ${
              isScrolled ? 'text-blue-900' : 'text-white'
            }`}
          >
            {/* <BookOpen className="mr-2" size={28} /> */}
            Lerelaxs Hotel
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((label, i) => {
              const link =
                label === 'Amenities'
                  ? '/#amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return (
                <a
                  key={i}
                  href={link}
                  className={`transition-colors duration-200 font-medium ${navLinkClass}`}
                >
                  {label}
                </a>
              );
            })}

            <button
              className={`px-4 py-2 rounded-md shadow-md transition-colors duration-200 font-medium ${bookButtonClass}`}
            >
              Book Now
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${iconButtonClass}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a
              href="/login"
              className={`p-2 rounded-full transition-colors duration-200 ${iconButtonClass}`}
              aria-label="Login"
            >
              <User size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md transition-colors duration-200 ${iconButtonClass}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-b bg-white shadow-md rounded-b-lg">
            {navLinks.map((label, i) => {
              const link =
                label === 'Amenities'
                  ? '/#amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return (
                <a
                  key={i}
                  href={link}
                  className="block text-blue-900 hover:text-green-900 transition-colors duration-200 py-2 font-semibold"
                >
                  {label}
                </a>
              );
            })}
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <button className="flex-grow px-4 py-2 rounded-md shadow-md transition-colors duration-200 font-medium bg-green-700 hover:bg-green-800 text-white">
                Book Now
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 text-gray-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a
                href="/login"
                className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 text-gray-800"
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
