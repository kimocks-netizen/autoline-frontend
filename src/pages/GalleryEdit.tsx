
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { API_ENDPOINTS } from '../utils/api';
import type { GalleryItem, GalleryFormData } from '../types/gallery';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { supabase } from '../components/supabaseClient';

const MAX_GALLERY_ITEMS = 18; // Maximum gallery items allowed

const GalleryEdit = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    before_image_url: '',
    after_image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [togglingItem, setTogglingItem] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch gallery items on component mount
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) {
        navigate('/admin');
        return;
      }

      const auth = JSON.parse(authStr);
      const token = auth.token;

      const response = await axios.get(API_ENDPOINTS.ADMIN_GALLERY, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setGalleryItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      before_image_url: '',
      after_image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      before_image_url: item.before_image_url || '',
      after_image_url: item.after_image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) return;

      const auth = JSON.parse(authStr);
      const token = auth.token;

      await axios.delete(API_ENDPOINTS.getGalleryItemEndpoint(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const authStr = localStorage.getItem('auth');
      if (!authStr) return;

      const auth = JSON.parse(authStr);
      const token = auth.token;

      if (!item.id) {
        console.error('Item ID is undefined');
        return;
      }

      setTogglingItem(item.id);

      // Optimistic UI update
      setGalleryItems(prev => prev.map(gItem => 
        gItem.id === item.id ? { ...gItem, is_active: !gItem.is_active } : gItem
      ));

      const response = await axios.put(API_ENDPOINTS.getGalleryItemEndpoint(item.id), {
        title: item.title,
        description: item.description,
        before_image_url: item.before_image_url,
        after_image_url: item.after_image_url,
        display_order: item.display_order,
        is_active: !item.is_active
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status !== 'success') {
        // Revert on error
        setGalleryItems(prev => prev.map(gItem => 
          gItem.id === item.id ? { ...gItem, is_active: item.is_active } : gItem
        ));
        alert('Failed to update gallery item');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      // Revert on error
      setGalleryItems(prev => prev.map(gItem => 
        gItem.id === item.id ? { ...gItem, is_active: item.is_active } : gItem
      ));
      alert('Failed to update gallery item');
    } finally {
      setTogglingItem(null);
    }
  };

  const handleImageUpload = async (file: File, imageType: 'before' | 'after') => {
    if (!file) return;

    setUploadingImage(imageType);
    
    try {
      // Upload directly to Supabase Storage like QuoteForm does
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageType}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (error) {
        console.error('Storage upload error:', error);
        console.error('Error details:', error);
        alert(`Failed to upload image: ${error.message}`);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [`${imageType}_image_url`]: publicUrlData.publicUrl
      }));

      // Show success message
      console.log(`${imageType} image uploaded successfully`);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(null);
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

      if (editingItem) {
        // Update existing item
        const response = await axios.put(
          API_ENDPOINTS.getGalleryItemEndpoint(editingItem.id),
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

              if (response.data.status === 'success') {
        setGalleryItems(prev => prev.map(item => 
          item.id === editingItem.id ? response.data.data : item
        ));
        // Refresh the gallery items to ensure we have the latest data
      }
      } else {
        // Create new item
        const response = await axios.post(
          API_ENDPOINTS.ADMIN_GALLERY,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.status === 'success') {
          setGalleryItems(prev => [...prev, response.data.data]);
          // Refresh the gallery items to ensure we have the latest data
          await fetchGalleryItems();
        }
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        before_image_url: '',
        after_image_url: ''
      });
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
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
          <span className="text-lg">Loading gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue px-6 py-4 text-white rounded-t-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GALLERY MANAGEMENT</h1>
          <button
            onClick={handleAddNew}
            disabled={galleryItems.length >= MAX_GALLERY_ITEMS}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
              galleryItems.length >= MAX_GALLERY_ITEMS
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FaPlus />
            <span>New Item</span>
          </button>
        </div>

        {galleryItems.length >= MAX_GALLERY_ITEMS && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">
              Maximum of {MAX_GALLERY_ITEMS} gallery items reached. Delete an item to add a new one.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.before_image_url ? (
                    <img
                                              src={item.before_image_url}
                        alt="Before"
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
                    onClick={() => handleToggleActive(item)}
                    disabled={togglingItem === item.id}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      item.is_active ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-500 text-white hover:bg-gray-600'
                    } ${togglingItem === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={item.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                                      >
                      {togglingItem === item.id ? <FaSpinner className="animate-spin" /> : (item.is_active ? <FaEye /> : <FaEyeSlash />)}
                    </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Order: {item.display_order}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
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
                    {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Before Image
                      </label>
                      <div className="space-y-2">
                        {formData.before_image_url && (
                          <img
                            src={formData.before_image_url}
                            alt="Before"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'before')}
                            className="flex-1"
                          />
                          {uploadingImage === 'before' && (
                            <FaSpinner className="animate-spin text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        After Image
                      </label>
                      <div className="space-y-2">
                        {formData.after_image_url && (
                          <img
                            src={formData.after_image_url}
                            alt="After"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'after')}
                            className="flex-1"
                          />
                          {uploadingImage === 'after' && (
                            <FaSpinner className="animate-spin text-blue-600" />
                          )}
                        </div>
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
                        editingItem ? 'Update' : 'Create'
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
export default GalleryEdit;
