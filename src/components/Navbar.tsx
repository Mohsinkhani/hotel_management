import { Menu, X, User, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useProfile } from '../hooks/useProfile';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const profile = useProfile(user?.id);
  const handleAdminPanel = () => navigate('/admin');
  const ADMIN_EMAIL = 'admin1@lerelax.online';

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleBookNow = () => navigate('/booking');

  const handleLogout = async () => {
    if (window.confirm('Do you want to logout?')) {
      await supabase.auth.signOut();
      navigate('/auth');
    }
  };

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
            Lerelax Hotel
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((label, i) => {
              const link =
                label === 'Amenities'
                  ? '/amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return (
                <Link key={i} to={link} className={navLinkClass}>
                  {label}
                </Link>
              );
            })}

            <button onClick={handleBookNow} className={bookButtonClass}>
              Book Now
            </button>

            {/* Admin Panel button for desktop */}
           {user && user.email === ADMIN_EMAIL && (
  <button
    onClick={handleAdminPanel}
    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
  >
    Admin Panel
  </button>
)}

            <button
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!user ? (
              <Link to="/auth" className={iconButtonClass} aria-label="Login or Signup">
                <User size={20} />
                <span className="ml-2 hidden md:inline">Login / Signup</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {profile?.avatar_url && (
                  <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                )}
                <span>{profile?.full_name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className={iconButtonClass}
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                  <span className="ml-2 hidden md:inline">Logout</span>
                </button>
              </div>
            )}
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
                  ? '/amenities'
                  : `/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`;

              return (
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

              {/* Admin Panel button for mobile */}
              <button
                onClick={handleAdminPanel}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Admin Panel
              </button>

              <button
                onClick={toggleDarkMode}
                className={iconButtonClass}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {!user ? (
                <Link to="/auth" className={iconButtonClass} aria-label="Login or Signup">
                  <User size={20} />
                  <span className="ml-2">Login / Signup</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  {profile?.avatar_url && (
                    <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                  )}
                  <span>{profile?.full_name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className={iconButtonClass}
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                    <span className="ml-2">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;