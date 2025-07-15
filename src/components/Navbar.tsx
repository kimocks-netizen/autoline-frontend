import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavItem from './NavItem';
import { Menu, X } from 'lucide-react';

const Navbar = ({ darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navBackground = darkMode 
    ? 'bg-gray-900/80 backdrop-blur-md' 
    : 'bg-white/80 backdrop-blur-md';

  const mobileNavBackground = darkMode 
    ? 'bg-gray-800/95 border-gray-700' 
    : 'bg-white/95 border-gray-200';

  return (
    <>
      {/* Main navbar */}
      <nav className={`fixed top-0 left-0 w-full ${navBackground} shadow-md z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">
                  AUTOLINE
                </span>
                <span className={darkMode ? "text-blue-300" : "text-primary-blue"}> PANEL SHOP</span>
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem to="/" label="Home" darkMode={darkMode} />
              <NavItem to="/about" label="AboutUs" darkMode={darkMode} />
              <NavItem to="/services" label="Services" darkMode={darkMode} />
              <NavItem to="/gallery" label="Gallery" darkMode={darkMode} />
              <NavItem to="/admin" label="Admin" darkMode={darkMode} />
              <Link
                to="/request-quote"
                className="whitespace-nowrap bg-gradient-to-r from-primary-red to-dark-red text-white py-2 px-6 rounded-md hover:opacity-70 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Request Quote
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={darkMode ? "text-gray-200" : "text-gray-800"}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav height */}
      <div className="h-16 md:hidden" />

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Mobile Nav Content */}
          <div 
            ref={mobileNavRef}
            className={`fixed top-16 left-0 right-0 ${mobileNavBackground} border-t shadow-lg z-50 transition-all duration-300`}
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              <NavItem 
                to="/" 
                label="Home" 
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <hr className={darkMode ? "border-gray-700" : "border-gray-200"} />
              <NavItem 
                to="/about" 
                label="About Us" 
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <hr className={darkMode ? "border-gray-700" : "border-gray-200"} />
              <NavItem 
                to="/services" 
                label="Services" 
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <hr className={darkMode ? "border-gray-700" : "border-gray-200"} />
              <NavItem 
                to="/gallery" 
                label="Gallery" 
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <hr className={darkMode ? "border-gray-700" : "border-gray-200"} />
              <NavItem 
                to="/admin" 
                label="Admin" 
                onClick={() => setIsOpen(false)}
                darkMode={darkMode}
              />
              <div className="px-2 pt-2">
                <Link
                  to="/request-quote"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-gradient-to-r from-primary-red to-dark-red text-white py-2 rounded-md hover:opacity-80 transition-all duration-300 font-semibold"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;