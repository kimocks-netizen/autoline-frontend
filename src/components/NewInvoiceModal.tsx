import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Quote {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  status: string;
  images?: string[];
  damage_description?: string;
}

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

interface NewInvoiceModalProps {
  quote?: Quote;
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: () => void;
  setCurrentInvoice: (invoice: any) => void;
  setIsInvoicePDFOpen: (open: boolean) => void;
  editInvoice?: Invoice; // Add this
  isEditing?: boolean; // Add this
}

const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({ 
  quote, 
  isOpen, 
  onClose, 
  onDocumentCreated, 
  setCurrentInvoice, 
  setIsInvoicePDFOpen,
  editInvoice,
  isEditing = false
}) => {
  const [documentType, setDocumentType] = useState<'invoice' | 'quote'>(editInvoice?.document_type || 'invoice');
  const [formData, setFormData] = useState({
    customer_name: editInvoice?.customer_name || quote?.name || '',
    customer_phone: editInvoice?.customer_phone || quote?.phone || '',
    car_model: editInvoice?.car_model || quote?.car_model || '',
    vehicle_reg_number: editInvoice?.vehicle_reg_number || '',
    repair_type: editInvoice?.repair_type || '',
    description: editInvoice?.description || quote?.damage_description || '',
    invoice_date: editInvoice?.invoice_date || new Date().toISOString().split('T')[0],
    total_amount: editInvoice?.total_amount?.toString() || ''
  });

  // Initialize repair items from editInvoice if editing
  const [repairItems, setRepairItems] = useState(() => {
    if (editInvoice && editInvoice.repair_items && editInvoice.repair_items.length > 0) {
      return editInvoice.repair_items;
    }
    return [
      { repair_type: '', description: '', amount: '' },
      { repair_type: 'Labour', description: 'Labour', amount: '' }
    ];
  });

  // Reset form when editInvoice changes
  useEffect(() => {
    if (editInvoice && isEditing) {
      setDocumentType(editInvoice.document_type);
      setFormData({
        customer_name: editInvoice.customer_name,
        customer_phone: editInvoice.customer_phone,
        car_model: editInvoice.car_model,
        vehicle_reg_number: editInvoice.vehicle_reg_number || '',
        repair_type: editInvoice.repair_type,
        description: editInvoice.description || '',
        invoice_date: editInvoice.invoice_date,
        total_amount: editInvoice.total_amount.toString()
      });
      
      // Properly populate repair items
      if (editInvoice.repair_items && editInvoice.repair_items.length > 0) {
        // Ensure we have at least 2 items (one regular + Labour)
        const items = [...editInvoice.repair_items];
        if (items.length === 1) {
          // If only one item, add Labour item
          items.push({ repair_type: 'Labour', description: 'Labour', amount: '' });
        } else if (items.length === 0) {
          // If no items, add default items
          items.push({ repair_type: '', description: '', amount: '' });
          items.push({ repair_type: 'Labour', description: 'Labour', amount: '' });
        }
        setRepairItems(items);
      } else {
        // Default items if no repair_items
        setRepairItems([
          { repair_type: '', description: '', amount: '' },
          { repair_type: 'Labour', description: 'Labour', amount: '' }
        ]);
      }
    }
  }, [editInvoice, isEditing]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRepairItemChange = (index: number, field: string, value: string) => {
    const newItems = [...repairItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setRepairItems(newItems);
  };

  const addRepairItem = () => {
    // Add new item before the Labour item (which should always be last)
    const newItems = [...repairItems];
    newItems.splice(newItems.length - 1, 0, { repair_type: '', description: '', amount: '' });
    setRepairItems(newItems);
  };

  const removeRepairItem = (index: number) => {
    // Don't allow removing the Labour item (last item)
    if (repairItems.length > 2 && index !== repairItems.length - 1) {
      const newItems = repairItems.filter((_, i) => i !== index);
      setRepairItems(newItems);
    }
  };

  const calculateTotal = () => {
    return repairItems.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) {
        setErrorMessage('Not authenticated');
        setShowErrorModal(true);
        return;
      }

      const auth = JSON.parse(authStr);
      const token = auth.token;

      const endpoint = isEditing 
        ? `https://autolinepanel-backend-production.up.railway.app/api/admin/invoices/${editInvoice?.id}`
        : 'https://autolinepanel-backend-production.up.railway.app/api/admin/invoices';

      const method = isEditing ? 'put' : 'post';

      const response = await axios[method](
        endpoint,
        {
          quote_id: quote?.id,
          ...formData,
          repair_type: repairItems.length > 2 ? 'Multiple' : repairItems[0].repair_type,
          description: repairItems.map(item => `${item.repair_type}: ${item.description}`).join('; '),
          total_amount: calculateTotal(),
          repair_items: repairItems,
          document_type: documentType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setShowSuccessModal(true);
        setCurrentInvoice(response.data.data);
        setIsInvoicePDFOpen(true);
        onDocumentCreated();
        onClose();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} document:`, error);
      setErrorMessage(`Failed to ${isEditing ? 'update' : 'create'} ${documentType}. Please try again.`);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Generate {documentType === 'quote' ? 'Quote' : 'Invoice'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as 'invoice' | 'quote')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="invoice">Invoice</option>
                <option value="quote">Quote</option>
              </select>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Model *
                </label>
                <input
                  type="text"
                  name="car_model"
                  value={formData.car_model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  name="vehicle_reg_number"
                  value={formData.vehicle_reg_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {documentType === 'quote' ? 'Quote' : 'Invoice'} Date *
              </label>
              <input
                type="date"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Repair Items */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Repair Items *
                </label>
                <button
                  type="button"
                  onClick={addRepairItem}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Item
                </button>
              </div>
              
              {repairItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Repair Type
                      </label>
                      <select
                        value={item.repair_type}
                        onChange={(e) => handleRepairItemChange(index, 'repair_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                        disabled={index === repairItems.length - 1} // Disable Labour item
                      >
                        <option value="">Select Type</option>
                        <option value="Bumper Repair">Bumper Repair</option>
                        <option value="Dent Removal">Dent Removal</option>
                        <option value="Paint Job">Paint Job</option>
                        <option value="Panel Replacement">Panel Replacement</option>
                        <option value="Scratch Repair">Scratch Repair</option>
                        <option value="Rust Repair">Rust Repair</option>
                        <option value="Accident Damage">Accident Damage</option>
                        <option value="Labour">Labour</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleRepairItemChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Description..."
                        disabled={index === repairItems.length - 1} // Disable Labour item
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount (R)
                        </label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleRepairItemChange(index, 'amount', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        />
                      </div>
                      
                      {repairItems.length > 2 && index !== repairItems.length - 1 && (
                        <button
                          type="button"
                          onClick={() => removeRepairItem(index)}
                          className="px-2 py-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="text-right">
              <div className="text-lg font-semibold">
                Total: R {calculateTotal().toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : `Generate ${documentType === 'quote' ? 'Quote' : 'Invoice'}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                <p className="text-sm text-gray-500">{documentType === 'quote' ? 'Quote' : 'Invoice'} {isEditing ? 'updated' : 'created'} successfully</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                <p className="text-sm text-gray-500">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInvoiceModal; 