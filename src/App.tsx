import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import RequestQuote from './pages/RequestQuote';
import AdminLogin from './pages/AdminLogin';
import AdminLanding from './pages/AdminLanding';
import AdminDashboard from './pages/AdminDashboard';
import InvoiceManagement from './pages/InvoiceManagement';
import GalleryEdit from './pages/GalleryEdit';
import ServicesEdit from './pages/ServicesEdit';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import { ToastProvider } from './components/ToastContext';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const checkLoginStatus = () => {
      // Check for both possible token storage methods
      const adminToken = localStorage.getItem('adminToken');
      const authData = localStorage.getItem('auth');
      
      let isLoggedIn = false;
      
      if (adminToken) {
        isLoggedIn = true;
      } else if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.token && parsed.expiresAt && Date.now() < parsed.expiresAt) {
            isLoggedIn = true;
          } else {
            // Token expired, remove it
            localStorage.removeItem('auth');
          }
        } catch (e) {
          // Invalid JSON, remove it
          localStorage.removeItem('auth');
        }
      }
      
      console.log('Login check:', { adminToken: !!adminToken, authData: !!authData, isLoggedIn });
      setIsLoggedIn(isLoggedIn);
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom login state change events
    const handleLoginStateChange = (event: CustomEvent) => {
      console.log('Login state change event:', event.detail);
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    window.addEventListener('loginStateChanged', handleLoginStateChange as EventListener);
    
    // Also check when the page becomes visible (in case of multiple tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLoginStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check more frequently to catch login state changes
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChanged', handleLoginStateChange as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/request-quote" element={<RequestQuote />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLanding />} />
            <Route path="/admin/quotes" element={<AdminDashboard />} />
            <Route path="/admin/invoices" element={<InvoiceManagement />} />
            <Route path="/admin/gallery-edit" element={<GalleryEdit />} />
            <Route path="/admin/services-edit" element={<ServicesEdit />} />
          </Routes>
          {!isLoggedIn && <FloatingWhatsAppButton />}
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;