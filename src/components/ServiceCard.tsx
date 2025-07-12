import { useState, type FC } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  details: string;
}

const ServiceCard: FC<ServiceCardProps> = ({ title, description, image, details }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">{description}</p>
        <button 
          onClick={() => setIsOpen(true)}
          className="mt-4 bg-gradient-to-r from-primary-blue to-dark-blue text-white px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          Read More
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <img src={image} alt={title} className="w-full h-64 object-cover rounded" />
              <p className="text-gray-700">{description}</p>
              <p className="text-gray-700">{details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;