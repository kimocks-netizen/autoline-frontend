import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GalleryCard from '../components/GalleryCard';
import GalleryModal from '../components/Modal';
import { API_ENDPOINTS } from '../utils/api';
import type { GalleryItem } from '../types/gallery';
import { FaSpinner } from 'react-icons/fa';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PUBLIC_GALLERY);
      
      if (response.data.status === 'success') {
        setGalleryItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
            <span className="text-lg">Loading gallery...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">OUR GALLERY</h2>
          </div>
          
          {galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No gallery items available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedItem(item)}
                >
                  <GalleryCard
                    beforeImage={item.before_image_url || ''}
                    afterImage={item.after_image_url || ''}
                    title={item.title}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedItem && (
          <GalleryModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            beforeImage={selectedItem.before_image_url || ''}
            afterImage={selectedItem.after_image_url || ''}
            title={selectedItem.title}
            description={selectedItem.description || ''}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
