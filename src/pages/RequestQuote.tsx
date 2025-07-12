import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuoteForm from '../components/QuoteForm';

const RequestQuote = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg">
            <h1 className="text-2xl font-bold">REQUEST A QUOTE</h1>
            <p className="mt-1">Get an estimate for your vehicle repairs</p>
          </div>
          
          <div className="bg-white p-6 rounded-b-lg shadow-md">
            <QuoteForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RequestQuote;