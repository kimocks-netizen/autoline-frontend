import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type QuoteStatus = 'Pending' | 'Contacted' | 'Completed';

export interface Quote {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  status: QuoteStatus;
  images?: string[];
  description?: string;
}

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch quotes on mount
  useEffect(() => {
    const fetchQuotes = async () => {
      const authStr = localStorage.getItem('auth');
      if (!authStr) {
        navigate('/admin');
        return;
      }

      let token: string;
      try {
        const auth = JSON.parse(authStr);
        token = auth.token;
        if (!token) throw new Error('No token found');
      } catch {
        navigate('/admin');
        return;
      }

      try {
        const response = await axios.get(
          'https://autolinepanel-backend-production.up.railway.app/api/admin/quotes',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setQuotes(response.data.data);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        // Unauthorized or other error, redirect to login
        navigate('/admin');
      }
    };

    fetchQuotes();
  }, [navigate]);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    const authStr = localStorage.getItem('auth');
    if (!authStr) return alert('Not authenticated');

    let token: string;
    try {
      const auth = JSON.parse(authStr);
      token = auth.token;
      if (!token) throw new Error('No token found');
    } catch {
      alert('Invalid authentication');
      return;
    }

    try {
      await axios.put(
        `https://autolinepanel-backend-production.up.railway.app/api/admin/quotes/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === id ? { ...quote, status: newStatus } : quote
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Remove the JWT token
    navigate('/'); // Redirect to homepage
  };

  const openImageModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">QUOTE REQUESTS</h1>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-primary-red to-dark-red text-white py-2 px-6 rounded-md hover:opacity-80 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`tel:${quote.phone}`} className="text-primary-blue hover:underline">
                        {quote.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.car_model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteStatus)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          quote.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : quote.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => openImageModal(quote)}
                        className="text-primary-blue hover:text-dark-blue underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => window.open(`https://wa.me/${quote.phone}`, '_blank')}
                        className="text-green-600 hover:text-green-800 mr-3"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(quote.phone)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Copy Number
                      </button>
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No quotes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
    {isModalOpen && selectedQuote && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Client: {selectedQuote.name}
              </h3>
              <h4 className="text-lg font-semibold text-gray-700">
                Car: {selectedQuote.car_model}
              </h4>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {selectedQuote.description && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700">Damage Description:</h4>
              <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedQuote.description}</p>
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700">Images ({selectedQuote.images?.length || 0}):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {selectedQuote.images?.length ? (
                selectedQuote.images.map((image, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Damage image ${index + 1}`} 
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                    <div className="p-2 text-center text-sm text-gray-600">
                      Image {index + 1}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No images uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AdminDashboard;