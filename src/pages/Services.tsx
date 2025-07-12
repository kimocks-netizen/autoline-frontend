import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import ServiceImage  from '../images/inprogress.png';
import SprayImage  from '../images/wallpaper.jpg';
import DentalImage  from '../images/dental.jpg';
import type { Service } from '../types';

const services: Service[] = [
  {
    title: "Bumper & Plastic Repair",
    description: "When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen.",
    image: ServiceImage,
    details: "We specialize in all types of bumper repairs including plastic welding, crack repairs, and complete bumper replacements using OEM-quality materials."
  },
    {
    title: "Dent Repair & Scratch Removal",
    description: "When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen.",
    image: DentalImage,
    details: "We specialize in all types of bumper repairs including plastic welding, crack repairs, and complete bumper replacements using OEM-quality materials."
  },
    {
    title: "Spray Painting",
    description: "When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen.",
    image: SprayImage,
    details: "We specialize in all types of bumper repairs including plastic welding, crack repairs, and complete bumper replacements using OEM-quality materials."
  },
  
  // Add other services
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">OUR SERVICES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                image={service.image}
                details={service.details}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
