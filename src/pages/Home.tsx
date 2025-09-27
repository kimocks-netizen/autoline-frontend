import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImage from '../images/wallpaper.jpg';
import Bumper from '../images/bumper2.png';
import ServiceCard from '../components/ServiceCard';
import { API_ENDPOINTS } from '../utils/api';
import type { ServiceItem } from '../types/services';

const Home = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback services data
  const fallbackServices = [
    {
      id: 'fallback-1',
      title: 'Bumper & Plastic Repair',
      description: 'When a bumper bashing occurs, who are you going to call? That\'s right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen.',
      image_url: Bumper,
      details: 'Professional bumper repair and plastic restoration services',
      display_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Panel Beating & Dent Removal',
      description: 'Expert panel beating services to restore your vehicle\'s bodywork to its original condition. We handle all types of dents and damage.',
      image_url: Bumper,
      details: 'Complete panel beating and dent removal services',
      display_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      title: 'Spray Painting & Refinishing',
      description: 'Professional spray painting services with color matching and high-quality finishes. We ensure your vehicle looks as good as new.',
      image_url: Bumper,
      details: 'Professional spray painting and color matching',
      display_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PUBLIC_SERVICES);
      
      if (response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        setServices(response.data.data);
      } else {
        // Use fallback services if API returns empty or no data
        setServices(fallbackServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
      // Use fallback services on error
      setServices(fallbackServices);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative"> 
          <img src={HeroImage} alt="Panel Beating" className="w-full h-[70vh] object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">AUTOLINE PANEL SHOP</h1>
              <p className="text-xl mb-8">Premium panel beating and spray painting services in Pretoria</p>
              <a 
                href="/request-quote" 
                className="bg-gradient-to-r from-primary-red to-dark-red text-white px-8 py-3 rounded-md text-lg font-medium hover:opacity-90 transition"
              >
                REQUEST A QUOTE
              </a>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">OUR SERVICES</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id}
                  title={service.title}
                  description={service.description || ''}
                  image={service.image_url || Bumper}
                  details={service.details || ''}
                />
              ))}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                {error}. Showing default services.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;