const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Autoline Panel Shop</h3>
            <p>Premium panel beating and spray painting services in Pretoria</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-primary-blue">Home</a></li>
              <li><a href="/about" className="hover:text-primary-blue">About Us</a></li>
              <li><a href="/services" className="hover:text-primary-blue">Services</a></li>
              <li><a href="/gallery" className="hover:text-primary-blue">Gallery</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:text-primary-blue">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-primary-blue">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p>123 Panel Street</p>
              <p>Pretoria, 0001</p>
              <p>Phone: 012 345 6789</p>
              <p>Email: info@autolinepanels.co.za</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Autoline Panel Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;