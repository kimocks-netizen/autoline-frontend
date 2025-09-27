import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { API_ENDPOINTS } from '../utils/api';
import type { ServiceItem, ServiceFormData } from '../types/services';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { supabase } from '../components/supabaseClient';

const MAX_SERVICES = 6; // Maximum number of services

const ServicesEdit = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    image_url: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingService, setTogglingService] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) {
        navigate('/admin');
        return;
      }

      const auth = JSON.parse(authStr);
      const token = auth.token;

      const response = await axios.get(API_ENDPOINTS.ADMIN_SERVICES, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setServices(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      details: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      image_url: service.image_url || '',
      details: service.details || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) return;

      const auth = JSON.parse(authStr);
      const token = auth.token;

      await axios.delete(API_ENDPOINTS.getServiceEndpoint(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setServices(prev => prev.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) return;

      const auth = JSON.parse(authStr);
      const token = auth.token;

      if (!service.id) {
        console.error('Service ID is undefined');
        return;
      }

      setTogglingService(service.id);

      // Optimistic UI update
      setServices(prev => prev.map(s => 
        s.id === service.id ? { ...s, is_active: !s.is_active } : s
      ));

      const response = await axios.put(API_ENDPOINTS.getServiceEndpoint(service.id), {
        title: service.title,
        description: service.description,
        image_url: service.image_url,
        details: service.details,
        display_order: service.display_order,
        is_active: !service.is_active
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status !== 'success') {
        // Revert on error
        setServices(prev => prev.map(s => 
          s.id === service.id ? { ...s, is_active: service.is_active } : s
        ));
        alert('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      // Revert on error
      setServices(prev => prev.map(s => 
        s.id === service.id ? { ...s, is_active: service.is_active } : s
      ));
      alert('Failed to update service');
    } finally {
      setTogglingService(null);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    
    try {
      // Upload directly to Supabase Storage like GalleryEdit does
      const fileExt = file.name.split('.').pop();
      const fileName = `services/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (error) {
        console.error('Storage upload error:', error);
        alert(`Failed to upload image: ${error.message}`);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrlData.publicUrl
      }));

      console.log('Service image uploaded successfully');

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) return;

      const auth = JSON.parse(authStr);
      const token = auth.token;

      if (editingService) {
        // Update existing service
        const response = await axios.put(
          API_ENDPOINTS.getServiceEndpoint(editingService.id),
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.status === 'success') {
          setServices(prev => prev.map(service => 
            service.id === editingService.id ? response.data.data : service
          ));
          // Refresh the services to ensure we have the latest data
          await fetchServices();
        }
      } else {
        // Create new service
        const response = await axios.post(
          API_ENDPOINTS.ADMIN_SERVICES,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.status === 'success') {
          setServices(prev => [...prev, response.data.data]);
          await fetchServices();
        }
      }

      setIsModalOpen(false);
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        details: ''
      });
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
          <span className="text-lg">Loading services...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SERVICES MANAGEMENT</h1>
          <button
            onClick={handleAddNew}
            disabled={services.length >= MAX_SERVICES}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
              services.length >= MAX_SERVICES
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FaPlus />
            <span>New Service</span>
          </button>
        </div>

        {services.length >= MAX_SERVICES && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">
              Maximum of {MAX_SERVICES} services reached. Delete a service to add a new one.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleToggleActive(service)}
                    disabled={togglingService === service.id}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      service.is_active ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-500 text-white hover:bg-gray-600'
                    } ${togglingService === service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={service.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                  >
                    {togglingService === service.id ? <FaSpinner className="animate-spin" /> : (service.is_active ? <FaEye /> : <FaEyeSlash />)}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description || 'No description'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Order: {service.display_order}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => service.id && handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingService ? 'Edit Service' : 'Add Service'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Details
                    </label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional service details, pricing info, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Image
                    </label>
                    <div className="space-y-2">
                      {formData.image_url && (
                        <img
                          src={formData.image_url}
                          alt="Service"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          className="flex-1"
                        />
                        {uploadingImage && (
                          <FaSpinner className="animate-spin text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <FaSpinner className="animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        editingService ? 'Update' : 'Create'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesEdit;
