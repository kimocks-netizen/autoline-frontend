import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Quote } from '../types';

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://autolinepanel-backend-production.up.railway.app/api/admin/quotes',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setQuotes(response.data.data);
      } catch {
        navigate('/admin');
      }
    };

    fetchQuotes();
  }, [navigate]);

  const handleStatusChange = async (id: string, newStatus: Quote['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://autolinepanel-backend-production.up.railway.app/api/admin/quotes/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setQuotes(quotes.map(quote =>
        quote.id === id ? { ...quote, status: newStatus } : quote
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6">
          <h1 className="text-2xl font-bold">QUOTE REQUESTS</h1>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as Quote['status'])}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                          quote.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
