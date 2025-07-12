import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">ABOUT US</h2>
          </div>
          
          <div className="bg-white p-6 rounded-b-lg shadow-md">
            <p className="text-gray-700 mb-4">
              From fixing minor dents, spray painting to repairing major vehicle damage, Autoline Panel Shop has built an admirable reputation among Pretoria motorists.
            </p>
            
            <p className="text-gray-700 mb-4">
              This is because since its establishment, Autoline Panel Shop has sought to provide only the highest quality auto body repair and auto body paint services.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Expertise</h3>
                <p className="text-gray-700">
                  We have a team of highly qualified and certified technicians who will have your car looking like brand new. Our team exemplifies customer excellence and takes care of every customer individually.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Equipment</h3>
                <p className="text-gray-700">
                  We've invested in acquiring advanced tools to match our expertise. It's not just modern cars; our craftsmen have also been called on to refurbish classic and vintage vehicles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;