import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import InvoicePDF from '../components/InvoicePDF';
import NewInvoiceModal from '../components/NewInvoiceModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ConversionConfirmationModal from '../components/ConversionConfirmationModal';
import { FaEllipsisV, FaEye, FaEdit, FaExchangeAlt, FaWhatsapp, FaTrash } from 'react-icons/fa';

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
  document_type: 'invoice' | 'quote';
  created_at: string;
  repair_items?: { repair_type: string; description: string; amount: string }[];
}

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'invoice' | 'quote'; name: string } | null>(null);
  const [conversionItem, setConversionItem] = useState<{ id: string; currentType: 'invoice' | 'quote'; documentNumber: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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

  const handleConvertClick = (invoice: Invoice) => {
    setConversionItem({
      id: invoice.id,
      currentType: invoice.document_type,
      documentNumber: invoice.invoice_number
    });
    setIsConversionModalOpen(true);
  };

  const handleConvertConfirm = async () => {
    if (!conversionItem) return;

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

    setIsConverting(true);

    try {
      console.log('Sending conversion request:', { id: conversionItem.id, newType: conversionItem.currentType === 'invoice' ? 'quote' : 'invoice' });
      const response = await axios.post(
        `https://autolinepanel-backend-production.up.railway.app/api/admin/invoices/${conversionItem.id}/convert`,
        { newType: conversionItem.currentType === 'invoice' ? 'quote' : 'invoice' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Conversion response:', response.data);

      if (response.data.status === 'success') {
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error converting document:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setIsConverting(false);
      setIsConversionModalOpen(false);
      setConversionItem(null);
    }
  };

  const handleConvertCancel = () => {
    setIsConversionModalOpen(false);
    setConversionItem(null);
    setIsConverting(false);
  };

  const formatRepairType = (repairType: string) => {
    if (!repairType || repairType === 'Multiple') {
      return 'Multiple Repairs';
    }
    return repairType;
  };

  const handleWhatsAppShare = async (invoice: Invoice) => {
    try {
      // Format phone number for WhatsApp (remove spaces and ensure it starts with country code)
      let phoneNumber = invoice.customer_phone.replace(/\s+/g, '');
      if (!phoneNumber.startsWith('+')) {
        // Assume South African number if no country code
        phoneNumber = '+27' + phoneNumber.replace(/^0/, '');
      }
      
      // Create WhatsApp message
      const message = `Hi ${invoice.customer_name}, please find your ${invoice.document_type === 'quote' ? 'quote' : 'invoice'} for ${formatRepairType(invoice.repair_type)} on your ${invoice.car_model}. Document Number: ${invoice.invoice_number}. Total Amount: ${new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(invoice.total_amount)}`;
      
      // Encode message and create WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp with the message
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setDeleteItem({
      id: invoice.id,
      type: invoice.document_type,
      name: `${invoice.document_type === 'invoice' ? 'Invoice' : 'Quote'} ${invoice.invoice_number}`
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

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

    setIsDeleting(true);

    try {
      // Optimistic UI update
      setInvoices(prevInvoices =>
        prevInvoices.filter(invoice => invoice.id !== deleteItem.id)
      );

      const response = await axios.delete(
        `https://autolinepanel-backend-production.up.railway.app/api/admin/invoices/${deleteItem.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        // Close modal without showing success message
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      } else {
        // Revert optimistic update on error
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      // Revert optimistic update on error
      window.location.reload();
      alert('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
    setIsDeleting(false);
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

  const handleEditClick = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDropdownToggle = (invoiceId: string) => {
    setDropdownOpen(dropdownOpen === invoiceId ? null : invoiceId);
  };

  const handleActionClick = (action: string, invoice: Invoice) => {
    setDropdownOpen(null);
    switch (action) {
      case 'view':
        openPDFModal(invoice);
        break;
      case 'edit':
        handleEditClick(invoice);
        break;
      case 'convert':
        handleConvertClick(invoice);
        break;
      case 'whatsapp':
        handleWhatsAppShare(invoice);
        break;
      case 'delete':
        handleDeleteClick(invoice);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar/>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">INVOICE & QUOTE MANAGEMENT</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Generated Documents ({invoices.length})
              </h2>
              <button
                onClick={() => setIsNewInvoiceModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                New Document
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        invoice.document_type === 'quote' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {invoice.document_type === 'quote' ? 'Quote' : 'Invoice'}
                      </span>
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
                      {invoice.document_type === 'invoice' ? (
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
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => handleDropdownToggle(invoice.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded"
                        >
                          <FaEllipsisV className="w-4 h-4" />
                        </button>
                        
                        {dropdownOpen === invoice.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleActionClick('view', invoice)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FaEye className="w-4 h-4 mr-2" />
                                View PDF
                              </button>
                              <button
                                onClick={() => handleActionClick('edit', invoice)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FaEdit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleActionClick('convert', invoice)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FaExchangeAlt className="w-4 h-4 mr-2" />
                                Convert to {invoice.document_type === 'invoice' ? 'Quote' : 'Invoice'}
                              </button>
                              <button
                                onClick={() => handleActionClick('whatsapp', invoice)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FaWhatsapp className="w-4 h-4 mr-2" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleActionClick('delete', invoice)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <FaTrash className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No documents found.
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
          onDocumentCreated={() => {
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

      {/* Edit Invoice Modal */}
      {isEditModalOpen && editingInvoice && (
        <NewInvoiceModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingInvoice(null);
          }}
          onDocumentCreated={() => {
            setIsEditModalOpen(false);
            setEditingInvoice(null);
            window.location.reload();
          }}
          setCurrentInvoice={setSelectedInvoice}
          setIsInvoicePDFOpen={setIsPDFOpen}
          editInvoice={editingInvoice}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteItem && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Confirmation"
          message={`Are you sure you want to delete this ${deleteItem.type}?`}
          itemName={deleteItem.name}
          isLoading={isDeleting}
        />
      )}

      {/* Conversion Confirmation Modal */}
      {isConversionModalOpen && conversionItem && (
        <ConversionConfirmationModal
          isOpen={isConversionModalOpen}
          onClose={handleConvertCancel}
          onConfirm={handleConvertConfirm}
          currentType={conversionItem.currentType}
          documentNumber={conversionItem.documentNumber}
          isLoading={isConverting}
        />
      )}
    </div>
  );
};

export default InvoiceManagement; 