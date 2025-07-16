import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Autoline Panel Shop</h3>
            <p>Premium panel beating and spray painting services in Pretoria. Give your car a brand new look with Autoline Panel Shop.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li><a href="/" className="hover:text-primary-blue">Home</a></li>
              <li><a href="/about" className="hover:text-primary-blue">About Us</a></li>
              <li><a href="/services" className="hover:text-primary-blue">Services</a></li>
              <li><a href="/gallery" className="hover:text-primary-blue">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:text-primary-blue">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-primary-blue">Privacy Policy</a></li>
            </ul>

            <h3 className="text-lg font-semibold mt-2 mb-2 bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100079610417267"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-blue text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://wa.me/27676308447?text=Hello%20Autoline%20Panel%20Shop,%20My%20car%20got%20into%20accident%20i%20need%20to%20enquire%20about%20quotation.."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-blue text-xl"
              >
                <FaWhatsapp />
              </a>
              <a
                href="tel:+27676308447"
                className="hover:text-primary-blue text-xl"
              >
                <FaPhoneAlt />
              </a>
              <a
                href="mailto:autolinepanelshop@gmail.com"
                className="hover:text-primary-blue text-xl"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-red to-dark-red bg-clip-text text-transparent">Contact Us</h3>
            <address className="not-italic space-y-1">
              <p>
                <a
                  href="https://share.google/tyS5jiaGyYCuHz4CM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-blue"
                >
                  121 Stormvoël Rd, Lindopark, Pretoria, 0186
                </a>
              </p>
              <p>
                <a
                  href="tel:+27676308447"
                  className="hover:text-primary-blue"
                >
                  +27 67 630 8447
                </a>
              </p>
              <p>
                <a
                  href="mailto:autolinepanelshop@gmail.com"
                  className="hover:text-primary-blue"
                >
                  autolinepanelshop@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Autoline Panel Shop. All rights reserved. Developed by:{" "}
            <a
              href="https://wa.me/27616583827?text=i%20Saw%20your%20work%20i%20want%20you%20to%20help%20me%20creating%20our%20website.%20What%20is%20your%20charges"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-blue bg-gradient-to-r from-dark-red to-primary-red bg-clip-text text-transparent "
            >
               Kimocks Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
