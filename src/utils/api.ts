// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autolinepanel-backend-gixq.vercel.app';

// Alternative backend URLs (uncomment to use):
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autolinepanel-backend-production.up.railway.app';
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autolinepanel-backend-staging.up.railway.app';
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_QUOTES: `${API_BASE_URL}/api/admin/quotes`,
  ADMIN_INVOICES: `${API_BASE_URL}/api/admin/invoices`,
  ADMIN_GALLERY: `${API_BASE_URL}/api/admin/gallery`,
  
  // Public endpoints
  PUBLIC_QUOTES: `${API_BASE_URL}/api/quotes`,
  PUBLIC_GALLERY: `${API_BASE_URL}/api/gallery`,
  
  // Helper functions
  getQuoteStatusEndpoint: (id: string) => `${API_BASE_URL}/api/admin/quotes/${id}/status`,
  getInvoiceEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
  getInvoiceConvertEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}/convert`,
  getInvoiceDeleteEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
  getInvoiceUpdateEndpoint: (id: string) => `${API_BASE_URL}/api/admin/invoices/${id}`,
  getGalleryItemEndpoint: (id: string) => `${API_BASE_URL}/api/admin/gallery/${id}`,
}; 