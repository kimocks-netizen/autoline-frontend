import React, { useRef } from 'react';
import { FaDownload, FaPrint, FaTimes } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import LogoImage from '../images/logo.png';

interface InvoicePDFProps {
  invoice: any;
  onClose: () => void;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, onClose }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0.5,
        filename: `Invoice-${invoice.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(pdfRef.current).set(opt).save();
    }
  };

  const handlePrint = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0.5,
        filename: `Invoice-${invoice.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF and open in new window for printing
      html2pdf().from(pdfRef.current).set(opt).toPdf().get('pdf').then((pdf: any) => {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Open in new window and trigger print
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <div className="sticky top-0 border-b p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Invoice PDF - {invoice.invoice_number}</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FaPrint className="text-sm" />
              <span className="hidden sm:inline">Print</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <FaDownload className="text-sm" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              <FaTimes className="text-sm" />
              <span className="hidden sm:inline">Close</span>
              <span className="sm:hidden">Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          {/* Hidden printable content */}
          <div ref={pdfRef} className="p-4 sm:p-6 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 border-b-2 border-gray-300 pb-4 sm:pb-6">
                <div className="flex justify-center items-center mb-4">
                  <img src={LogoImage} alt="AutoLine Panel Shop" className="h-16 w-auto rounded-lg" />                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AutoLine Panel Shop</h1>
                <div className="text-xs sm:text-sm text-gray-600">
                  Professional Auto Body Repair & Panel Beating<br />
                  Tel: +27 60 475 5243 | Email: autolinepanelshop@gmail.com<br />
                  Address: 121 Stormvoël Rd, Lindopark, Pretoria
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4 text-left">{invoice.document_type === 'quote' ? 'Quote To:' : 'Invoice To:'}</h2>
                  <div className="text-gray-700 text-left">
                    <p className="font-semibold text-base sm:text-lg text-left">{invoice.customer_name}</p>
                    <p className="text-sm sm:text-base text-left">{invoice.customer_phone}</p>
                    <p className="text-sm sm:text-base text-left">Vehicle: {invoice.car_model}</p>
                    {invoice.vehicle_reg_number && (
                      <p className="text-sm sm:text-base text-left">Reg: {invoice.vehicle_reg_number}</p>
                    )}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{invoice.document_type === 'quote' ? 'Quote Details:' : 'Invoice Details:'}</h2>
                  <div className="text-gray-700 text-sm sm:text-base">
                    <p><strong>{invoice.document_type === 'quote' ? 'Quote Number:' : 'Invoice Number:'}</strong> {invoice.invoice_number}</p>
                    <p><strong>Date:</strong> {formatDate(invoice.invoice_date)}</p>
                    <p><strong>Repair Type:</strong> {invoice.repair_type === 'Multiple' ? 'Multiple' : invoice.repair_type}</p>
                    {invoice.document_type !== 'quote' && (
                      <p><strong>Status:</strong> {invoice.status.toUpperCase()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Service Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-gray-900">Description</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-right font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                        invoice.invoice_items.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-300">
                            <td className="border border-gray-300 p-2 sm:p-3 text-left">
                              <div className="font-semibold text-sm sm:text-base text-gray-900 text-left">{item.repair_type}</div>
                              {item.description && (
                                <div className="text-xs sm:text-sm text-gray-600 text-left mt-1">{item.description}</div>
                              )}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-right text-gray-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-b border-gray-300">
                          <td className="border border-gray-300 p-2 sm:p-3 text-left">
                            <div className="font-semibold text-sm sm:text-base text-gray-900 text-left">{invoice.repair_type}</div>
                            {invoice.description && (
                              <div className="text-xs sm:text-sm text-gray-600 text-left mt-1">{invoice.description}</div>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-right text-gray-900">{formatCurrency(invoice.total_amount)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="text-right mb-6 sm:mb-8">
                <div className="text-base sm:text-lg">
                  <p className="text-xl sm:text-2xl font-bold border-t-2 border-gray-300 pt-2">
                    Total: {formatCurrency(invoice.total_amount)}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6 sm:mb-8 text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-left">Terms & Conditions</h2>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2 text-left">
                  <li className="text-left">• This invoice is valid for 7 days from the date of issue</li>
                  <li className="text-left">• Payment is due upon completion of work unless otherwise agreed</li>
                  <li className="text-left">• We accept cash, bank transfer, and card payments</li>
                  <li className="text-left">• All work carries a 6-month warranty on materials and workmanship</li>
                  <li className="text-left">• Additional work may be required once vehicle is disassembled</li>
                  <li className="text-left">• Customer must remove all personal items before drop-off</li>
                  <li className="text-left">• We are not responsible for items left in the vehicle</li>
                </ul>
              </div>

              {/* Banking Details */}
              <div className="mb-6 sm:mb-8 bg-gray-50 p-4 sm:p-6 rounded-lg text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-left">Banking Details</h2>
                <div className="text-gray-700 text-sm sm:text-base text-left">
                  <p className="text-left"><strong>Bank Name:</strong> FNB</p>
                  <p className="text-left"><strong>Account Name:</strong> AutoLine Panel Shop</p>
                  <p className="text-left"><strong>Branch Code:</strong> 250655</p>
                  <p className="text-left"><strong>Account Number:</strong> 63167334829</p>
                  <p className="text-left"><strong>Payment Reference:</strong> {invoice.invoice_number}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center border-t-2 border-gray-300 pt-4 sm:pt-6">
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Thank you for choosing AutoLine Panel Shop!</p>
                <p className="text-gray-600 text-sm sm:text-base">Your trusted partner for quality auto body repair and panel beating services.</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  <a href="https://www.autolinepanelshop.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.autolinepanelshop.com</a> | 
                  <a href="mailto:autolinepanelshop@gmail.com" className="text-blue-600 hover:underline">autolinepanelshop@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF; 