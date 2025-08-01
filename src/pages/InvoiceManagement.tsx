import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import InvoicePDF from '../components/InvoicePDF';
import NewInvoiceModal from '../components/NewInvoiceModal';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  car_model: string;
  vehicle_reg_number?: string;
  repair_type: string;
  description?: string;
  invoice_date: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
}

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;

  // Paginated
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + invoicesPerPage);

  // Fetch invoices on mount
  useEffect(() => {
    const fetchInvoices = async () => {
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
          'https://autolinepanel-backend-production.up.railway.app/api/admin/invoices',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setInvoices(response.data.data || []);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        navigate('/admin');
      }
    };

    fetchInvoices();
  }, [navigate]);

  const openPDFModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPDFOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
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
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === id ? { ...invoice, status: newStatus } : invoice
        )
      );

      const response = await axios.put(
        `https://autolinepanel-backend-production.up.railway.app/api/admin/invoices/${id}`,
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
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === id ? { ...invoice, status: invoice.status } : invoice
        )
      );
      alert('Failed to update status. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar/>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">INVOICE MANAGEMENT</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Generated Invoices ({invoices.length})
              </h2>
              <button
                onClick={() => setIsNewInvoiceModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                New Invoice
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repair Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.customer_name}</div>
                        <div className="text-gray-500">{invoice.customer_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="text-gray-900">{invoice.car_model}</div>
                        {invoice.vehicle_reg_number && (
                          <div className="text-gray-500 text-xs">{invoice.vehicle_reg_number}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.repair_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => openPDFModal(invoice)}
                        className="text-blue-600 hover:text-blue-800 underline mr-3"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/${invoice.customer_phone}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No invoices found.
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

      {/* New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <NewInvoiceModal
          isOpen={isNewInvoiceModalOpen}
          onClose={() => setIsNewInvoiceModalOpen(false)}
          onInvoiceCreated={() => {
            setIsNewInvoiceModalOpen(false);
            window.location.reload();
          }}
          setCurrentInvoice={setSelectedInvoice}
          setIsInvoicePDFOpen={setIsPDFOpen}
        />
      )}

      {/* Invoice PDF Modal */}
      {isPDFOpen && selectedInvoice && (
        <InvoicePDF
          invoice={selectedInvoice}
          onClose={() => setIsPDFOpen(false)}
        />
      )}
    </div>
  );
};

export default InvoiceManagement; 