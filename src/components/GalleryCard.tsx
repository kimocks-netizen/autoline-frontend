import { useState } from 'react';

type GalleryCardProps = {
  beforeImage: string;
  afterImage: string;
  title: string;
};

const GalleryCard: React.FC<GalleryCardProps> = ({ beforeImage, afterImage, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsHovered((prev) => !prev);
      e.preventDefault(); // Prevent page scroll on Space
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Toggle preview of ${title}`}
      className="relative overflow-hidden rounded-lg shadow-lg h-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
    >
      <img
        src={isHovered ? afterImage : beforeImage}
        alt={title}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-white font-bold">AFTER</span>
      </div>
    </div>
  );
};

export default GalleryCard;
