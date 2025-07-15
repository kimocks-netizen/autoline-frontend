import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type QuoteStatus = 'Pending' | 'Contacted' | 'Completed';
type FilterStatus = QuoteStatus | 'All';


export interface Quote {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  status: QuoteStatus;
  images?: string[];
  damage_description?: string;
}

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 5;

  // Filtered by status
  const filteredQuotes = quotes.filter((quote) =>
    filterStatus === 'All' ? true : quote.status === filterStatus
  );

  // Paginated
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + quotesPerPage);

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
        //setQuotes(response.data.data);
        setQuotes(
        response.data.data.map((q: Quote) => ({
          ...q,
          status: (q.status.charAt(0).toUpperCase() + q.status.slice(1)) as QuoteStatus
        }))
      );
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
      // Optimistic UI update
      setQuotes(prevQuotes =>
        prevQuotes.map(quote =>
          quote.id === id ? { ...quote, status: newStatus } : quote
        )
      );

      const response = await axios.put( // Changed from POST to PUT
        `https://autolinepanel-backend-production.up.railway.app/api/admin/quotes/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status !== 'success') {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      setQuotes(prevQuotes =>
        prevQuotes.map(quote =>
          quote.id === id ? { ...quote, status: quote.status } : quote
        )
      );
      alert('Failed to update status. Please try again.');
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
       <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Quotes
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Filter by Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as FilterStatus);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
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

                {paginatedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/*rows */}
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
                {paginatedQuotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No quotes found.
                    </td>
                  </tr>
                )}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No quotes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
            <span className="mb-2 sm:mb-0">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

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
          
          {selectedQuote.damage_description && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700">Damage Description:</h4>
              <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedQuote.damage_description}</p>
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700">Images ({selectedQuote.images?.length || 0}):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {selectedQuote.images?.length ? (
                selectedQuote.images.map((image, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="relative group">
                      <img 
                        src={image} 
                        alt={`Damage image ${index + 1}`} 
                        className="w-full h-48 object-contain bg-gray-100"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(image, '_blank')}
                            className="bg-white p-2 rounded-full hover:bg-gray-100 transition"
                            title="View full image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                       <button 
                        onClick={async () => {
                          try {
                            const response = await fetch(image);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `damage-${selectedQuote.name}-${index+1}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error('Error downloading image:', err);
                            alert('Failed to download image');
                          }
                        }}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition"
                        title="Download image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 text-center text-sm text-gray-600 flex justify-between items-center">
                      <span>Image {index + 1}</span>
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