import React from 'react';
import { FaExchangeAlt, FaTimes } from 'react-icons/fa';

interface ConversionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentType: 'invoice' | 'quote';
  documentNumber: string;
  isLoading?: boolean;
}

const ConversionConfirmationModal: React.FC<ConversionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentType,
  documentNumber,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const newType = currentType === 'invoice' ? 'quote' : 'invoice';
  const title = `Convert ${currentType.charAt(0).toUpperCase() + currentType.slice(1)} to ${newType.charAt(0).toUpperCase() + newType.slice(1)}`;
  const message = `Are you sure you want to convert this ${currentType} to a ${newType}?`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FaExchangeAlt className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{documentNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaExchangeAlt className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-4">{message}</p>
              <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                <p className="text-sm text-purple-700">
                  <strong>Note:</strong> This will create a new {newType} based on the current {currentType}. The original {currentType} will remain unchanged.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Converting...</span>
              </>
            ) : (
              <>
                <FaExchangeAlt className="w-4 h-4" />
                <span>Convert</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionConfirmationModal; 