import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImage from '../images/wallpaper.jpg';
import Bumper from '../images/bumper2.png';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
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
                EMERGENCY SERVICE
              </a>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">OUR SERVICES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Sample service - you'll add all services here */}
            <ServiceCard 
              title="Bumper & Plastic Repair"
              description="When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen."
              image={Bumper} details={''}            />
            {/* Add other service cards */}
                  <ServiceCard 
              title="Bumper & Plastic Repair"
              description="When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen."
              image={Bumper} details={''}            />

              <ServiceCard 
              title="Bumper & Plastic Repair"
              description="When a bumper bashing occurs, who are you going to call? That's right, Autoline Panel Shop. Your number one automobile body repair company Pretoria has ever seen."
              image={Bumper} details={''}            /> 
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;