import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import RequestQuote from './pages/RequestQuote';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import GalleryEdit from './pages/GalleryEdit';
//import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/gallery-edit" element={<GalleryEdit />} />
        </Routes>
        {/*<FloatingWhatsAppButton />*/}
      </div>
    </Router>
  );
}

export default App;