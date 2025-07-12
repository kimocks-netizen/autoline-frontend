import { type FC } from 'react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

const GalleryModal: FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  beforeImage, 
  afterImage, 
  title, 
  description 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
        <div className="flex justify-between items-center bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div>
            <h4 className="font-semibold mb-2">Before</h4>
            <img src={beforeImage} alt={`Before ${title}`} className="rounded-lg shadow" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">After</h4>
            <img src={afterImage} alt={`After ${title}`} className="rounded-lg shadow" />
          </div>
        </div>
        
        <div className="px-6 pb-6">
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;