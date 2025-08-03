// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autolinepanel-backend-production.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_QUOTES: `${API_BASE_URL}/api/admin/quotes`,
  ADMIN_INVOICES: `${API_BASE_URL}/api/admin/invoices`,
  
  // Public endpoints
  PUBLIC_QUOTES: `${API_BASE_URL}/api/quotes`,
  
  // Helper functions
  getQuoteStatusEndpoint: (id: string) => `${API_BASE_URL}/api/admin/quotes/${id}/status`,
  getInvoiceEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
  getInvoiceConvertEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}/convert`,
  getInvoiceDeleteEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
  getInvoiceUpdateEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
}; 