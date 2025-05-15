import { Menu, X, User, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleBookNow = () => navigate('/booking');

  const navLinks = ['Home', 'Rooms', 'Amenities', 'About', 'Contact'];

  const navLinkClass =
    'text-blue-900 hover:text-green-900 transition-colors duration-200 font-medium';
  const iconButtonClass =
    'hover:bg-gray-100 p-2 rounded-full transition-colors duration-200';
  const bookButtonClass =
    'bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200 font-medium';

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md py-4 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-serif font-bold text-blue-900"
          >
            {/* <BookOpen className="mr-2" size={28} /> */}
            Lerelax Hotel
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((label, i) => {
              const link =
                label === 'Amenities'
                  ? '/#amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return label === 'Amenities' ? (
                <Link key={i}  to="/amenities" className={navLinkClass}>
                {label}
              </Link>
              ) : (
                <Link key={i} to={link} className={navLinkClass}>
                  {label}
                </Link>
              );
            })}

            <button onClick={handleBookNow} className={bookButtonClass}>
              Book Now
            </button>
            <button
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/login" className={iconButtonClass} aria-label="Login">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={iconButtonClass}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-b bg-white shadow-md rounded-b-lg">
            {navLinks.map((label, i) => {
              const link =
                label === 'Amenities'
                  ? '/#amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return label === 'Amenities' ? (
                <Link
                  key={i} to="/amenities"
                 className="block text-blue-900 hover:text-green-900 transition-colors duration-200 py-2 font-semibold"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={i}
                  to={link}
                  className="block text-blue-900 hover:text-green-900 transition-colors duration-200 py-2 font-semibold"
                >
                  {label}
                </Link>
              );
            })}

            <div className="flex flex-wrap gap-2 items-center pt-2">
              <button
                onClick={handleBookNow}
                className="flex-grow px-4 py-2 rounded-md shadow-md bg-green-700 hover:bg-green-800 text-white"
              >
                Book Now
              </button>
              <button
                onClick={toggleDarkMode}
                className={iconButtonClass}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login" className={iconButtonClass} aria-label="Login">
                <User size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
