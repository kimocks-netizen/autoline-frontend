import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GalleryCard from '../components/GalleryCard';
import GalleryModal from '../components/Modal';
import Before1 from '../images/before1.jpg';
import After1 from '../images/after1.jpg';
import Before2 from '../images/before2b.png';
import After2 from '../images/after2.jpg';
import type { GalleryItem } from '../types';

const galleryItems: GalleryItem[] = [
  {
    beforeImage: Before1,
    afterImage: After1,
    title: "Side Collision Repair",
    description: "Complete Side Collision Repair reconstruction after major collision damage."
  },
    {
    beforeImage: Before2,
    afterImage: After2,
    title: "Front Collision Repair",
    description: "Complete Front Collision Repair reconstruction after major collision damage."
  },
    {
    beforeImage: Before1,
    afterImage: After1,
    title: "Side Collision Repair",
    description: "Complete Side Collision Repair reconstruction after major collision damage."
  },
  // Add more items as needed
];

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">OUR GALLERY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedItem(item)}
              >
                <GalleryCard
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
        {selectedItem && (
          <GalleryModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            {...selectedItem}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
