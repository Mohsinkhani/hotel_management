import { Menu, X, User, Moon, Sun, LogOut, BookOpen, UserCircle, ChevronDown, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useProfile } from '../hooks/useProfile';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "home": "Home",
          "rooms": "Rooms",
          "amenities": "Amenities",
          "about": "About",
          "contact": "Contact",
          "book_now": "Book Now",
          "admin_panel": "Admin Panel",
          "login_signup": "Login / Signup",
          "profile_details": "Profile Details",
          "booking_history": "Booking History",
          "logout": "Logout",
          "english": "English",
          "arabic": "العربية",
          "lerelax_hotel": "Lerelax Hotel"
        }
      },
      ar: {
        translation: {
          "home": "الرئيسية",
          "rooms": "الغرف",
          "amenities": "المرافق",
          "about": "عن الفندق",
          "contact": "اتصل بنا",
          "book_now": "احجز الآن",
          "admin_panel": "لوحة التحكم",
          "login_signup": "تسجيل دخول / تسجيل",
          "profile_details": "تفاصيل الملف",
          "booking_history": "سجل الحجوزات",
          "logout": "تسجيل خروج",
          "english": "English",
          "arabic": "العربية",
          "lerelax_hotel": "فندق ليريلاكس"
        }
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const navigate = useNavigate();
  const profile = useProfile(user?.id);
  const handleAdminPanel = () => navigate('/admin');
  const ADMIN_EMAIL = 'admin1@lerelax.online';
  const { t, i18n } = useTranslation();

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
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);
  const toggleLanguageMenu = () => setIsLanguageOpen(!isLanguageOpen);
  const handleBookNow = () => navigate('/booking');

  const changeLanguage = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    if (window.confirm(t('logout_confirmation'))) {
      await supabase.auth.signOut();
      navigate('/auth');
      setIsProfileOpen(false);
    }
  };

  const navLinks = [t('home'), t('rooms'), t('amenities'), t('about'), t('contact')];

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
            {t('lerelax_hotel')}
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center space-x-4 ${i18n.language === 'ar' ? 'space-x-reverse' : ''}`}>
            {navLinks.map((label, i) => {
              const link =
                label === t('amenities')
                  ? '/amenities'
                  : `/${label.toLowerCase() === t('home').toLowerCase() ? '' : label.toLowerCase()}`;

              return (
                <Link key={i} to={link} className={navLinkClass}>
                  {label}
                </Link>
              );
            })}

            <button onClick={handleBookNow} className={bookButtonClass}>
              {t('book_now')}
            </button>

            {/* Admin Panel button for desktop */}
            {user && user.email === ADMIN_EMAIL && (
              <button
                onClick={handleAdminPanel}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
              >
                {t('admin_panel')}
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className={`${iconButtonClass} flex items-center`}
                aria-label="Change language"
              >
                <Languages size={20} />
                <span className="ml-1 hidden md:inline">{i18n.language === 'en' ? 'EN' : 'AR'}</span>
                <ChevronDown size={16} className={`ml-1 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {t('english')}
                  </button>
                  <button
                    onClick={() => changeLanguage('ar')}
                    className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'ar' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {t('arabic')}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!user ? (
              <Link to="/auth" className={`${iconButtonClass} flex items-center`} aria-label="Login or Signup">
                <User size={20} />
                <span className="ml-2 hidden md:inline">{t('login_signup')}</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                  aria-label="User profile"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-900" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white">
                      <UserCircle size={20} />
                    </div>
                  )}
                  <span className="hidden md:inline">{profile?.full_name || user.email.split('@')[0]}</span>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircle size={16} className="mr-2" />
                      {t('profile_details')}
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <BookOpen size={16} className="mr-2" />
                      {t('booking_history')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
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
                label === t('amenities')
                  ? '/amenities'
                  : `/${label.toLowerCase() === t('home').toLowerCase() ? '' : label.toLowerCase()}`;

              return (
                <Link
                  key={i}
                  to={link}
                  onClick={() => setIsOpen(false)}
                  className="block text-blue-900 hover:text-green-900 transition-colors duration-200 py-2 font-semibold"
                >
                  {label}
                </Link>
              );
            })}

            <div className="flex flex-wrap gap-2 items-center pt-2">
              <button
                onClick={() => {
                  handleBookNow();
                  setIsOpen(false);
                }}
                className="flex-grow px-4 py-2 rounded-md shadow-md bg-green-700 hover:bg-green-800 text-white"
              >
                {t('book_now')}
              </button>

              {/* Admin Panel button for mobile */}
              {user && user.email === ADMIN_EMAIL && (
                <button
                  onClick={() => {
                    handleAdminPanel();
                    setIsOpen(false);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  {t('admin_panel')}
                </button>
              )}

              {/* Mobile Language Switcher */}
              <div className="relative w-full">
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 w-full"
                  aria-label="Change language"
                >
                  <Languages size={20} />
                  <span>{i18n.language === 'en' ? t('english') : t('arabic')}</span>
                  <ChevronDown size={16} className={`ml-auto transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLanguageOpen && (
                  <div className="mt-1 ml-8 bg-white rounded-md shadow-inner py-1 border border-gray-200 w-32">
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t('english')}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ar');
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'ar' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t('arabic')}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className={iconButtonClass}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {!user ? (
                <Link 
                  to="/auth" 
                  onClick={() => setIsOpen(false)}
                  className={`${iconButtonClass} flex items-center`} 
                  aria-label="Login or Signup"
                >
                  <User size={20} />
                  <span className="ml-2">{t('login_signup')}</span>
                </Link>
              ) : (
                <div className="w-full">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 w-full"
                    aria-label="User profile"
                  >
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-900" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white">
                        <UserCircle size={20} />
                      </div>
                    )}
                    <span>{profile?.full_name || user.email.split('@')[0]}</span>
                    <ChevronDown size={16} className={`ml-auto transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mobile Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="mt-2 bg-white rounded-md shadow-inner py-1 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircle size={16} className="mr-2" />
                        {t('profile_details')}
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BookOpen size={16} className="mr-2" />
                        {t('booking_history')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
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