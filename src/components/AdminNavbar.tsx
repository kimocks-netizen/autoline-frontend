import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BellIcon } from 'lucide-react';
import NavItem from './NavItem';
import LogoImage from '../images/logo.png';
const AdminNavbar = ({ darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navBackground = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-white text-gray-800';

  const mobileNavBackground = darkMode
    ? 'bg-gray-800/95 border-gray-700'
    : 'bg-white/95 border-gray-200';

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full ${navBackground} shadow-md z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + Title */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={LogoImage} alt="Autoline Logo" className="h-10 w-auto rounded-md" />
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">AUTOLINE</span>
                <span className={darkMode ? "text-blue-300" : "text-primary-blue"}> ADMIN</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavItem to="/admin/dashboard" label="Quotes" darkMode={darkMode} />
              <NavItem to="/admin/invoices" label="Invoices" darkMode={darkMode} />
              <NavItem to="/admin/gallery-edit" label="Gallery Edit" darkMode={darkMode} />
              <button
                className="relative p-2 rounded-full hover:bg-gray-700 hover:text-white transition"
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary-red to-dark-red text-white py-2 px-4 rounded-md hover:opacity-80 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
            {/* Mobile Bell + Toggle */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Bell Icon */}
              <button className="relative p-2 rounded-full hover:bg-gray-700 hover:text-white transition">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
              </button>

              {/* Hamburger Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={darkMode ? "text-white" : "text-gray-800"}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={mobileNavRef}
            className={`fixed top-16 left-0 right-0 z-50 ${mobileNavBackground} border-t shadow-lg transition-all duration-300`}
          >
            <div className="flex flex-col px-4 py-4 space-y-2">
              <NavItem
                to="/admin/dashboard"
                label="Quotes"
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <NavItem
                to="/admin/invoices"
                label="Invoices"
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <NavItem
                to="/admin/gallery-edit"
                label="Gallery Edit"
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-center mt-2 bg-gradient-to-r from-primary-red to-dark-red text-white py-2 px-4 rounded-md hover:opacity-80 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminNavbar;
