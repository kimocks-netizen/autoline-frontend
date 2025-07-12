import { Link } from 'react-router-dom';
import NavItem from './NavItem';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">
                  AUTOLINE
                </span>
                <span className="text-primary-blue"> PANEL SHOP</span>
              </h1>
            </Link>
          </div>

        <div className="hidden md:flex items-center space-x-8">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About Us" />
          <NavItem to="/services" label="Services" />
          <NavItem to="/gallery" label="Gallery" /> 
          <NavItem to="/admin" label="Admin" /> 
          <Link
            to="/request-quote"
            className="whitespace-nowrap bg-gradient-to-r from-primary-red to-dark-red text-white py-2 px-6 rounded-md hover:opacity-70 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Request Quote
          </Link>
        </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;