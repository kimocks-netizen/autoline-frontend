import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type CountryCode = {
  code: string;
  name: string;
  flag: string;
};

const QuoteForm = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [showProgress, setShowProgress] = useState(false);
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const [selectedCountryCode, setSelectedCountryCode] = useState('+27');

 const countryCodes: CountryCode[] = [
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    // SADC Member States
    { code: '+267', name: 'Botswana', flag: '🇧🇼' },
    { code: '+243', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
    { code: '+268', name: 'Eswatini', flag: '🇸🇿' },
    { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
    { code: '+265', name: 'Malawi', flag: '🇲🇼' },
    { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
    { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
    { code: '+264', name: 'Namibia', flag: '🇳🇦' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
    { code: '+248', name: 'Seychelles', flag: '🇸🇨' },
    { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+260', name: 'Zambia', flag: '🇿🇲' },
    { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+266', name: 'Lesotho', flag: '🇱🇸' },
    { code: '+257', name: 'Burundi', flag: '🇧🇮' },
    { code: '+244', name: 'Angola', flag: '🇦🇴' }, 
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
  ] 
  

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 5 - formik.values.images.length);
    if (newFiles.length === 0) return;

    formik.setFieldValue('images', [...formik.values.images, ...newFiles]);
    
    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      carModel: '',
      description: '',
      images: [] as File[]
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Full name is required')
        .matches(/^[a-zA-Z\s]*$/, 'Name cannot contain numbers'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{9,10}$/, 'Must be 9-10 digits'),
      carModel: Yup.string().required('Car model is required'),
      description: Yup.string().required('Damage description is required')
    }),
    onSubmit: async (values) => {
      try {
        setUploadError(null);
        setUploadProgress(0);

        // Format phone number
        let formattedPhone = values.phone;
        if (formattedPhone.startsWith('0')) {
          formattedPhone = formattedPhone.substring(1); // Remove leading 0
        }
        if (formattedPhone.length === 9) {
          formattedPhone = selectedCountryCode + formattedPhone;
        }
                
        const imageUrls: string[] = [];
        const totalImages = values.images.length;
        
 for (let i = 0; i < values.images.length; i++) {
  const uploadStartTime = Date.now(); // Track when upload started
  
  const image = values.images[i];
  const fileExt = image.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('damage-images')
    .upload(filePath, image);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('damage-images')
    .getPublicUrl(filePath);

  imageUrls.push(publicUrlData.publicUrl);
  
  // Calculate progress
  const progress = Math.round(((i + 1) / totalImages) * 100);
  setUploadProgress(progress);
  
  // Show progress bar if upload takes longer than 2 seconds
  if (Date.now() - uploadStartTime > 2000) {
    setShowProgress(true);
  }
}

        await axios.post(
          'https://autolinepanel-backend-production.up.railway.app/api/quotes',
          {
            name: values.name,
            phone: formattedPhone,
            carModel: values.carModel,
            description: values.description,
            images: imageUrls,
          }
        );

        toast.success('Quotation sent successfully! Admin will contact you soon.', {
        duration: 4000, // Show for 4 seconds
        position: 'top-center'
      });
        setTimeout(() => navigate('/'), 3000);
      } catch (error) {
        console.error(error);
        setUploadError(error instanceof Error ? error.message : 'Error submitting quote');
        toast.error('Failed to submit quote. Please try again.');
      }
    }
  });

  const removeImage = (index: number) => {
    const newImages = [...formik.values.images];
    newImages.splice(index, 1);
    formik.setFieldValue('images', newImages);
    
    const newPreviews = [...uploadedImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setUploadedImages(newPreviews);
  };

  const themeClasses = darkMode 
    ? 'bg-gray-800 text-white border-gray-700'
    : 'bg-white text-gray-800 border-gray-300';

  const inputClasses = `mt-1 block w-full rounded-md border shadow-sm focus:ring focus:ring-opacity-50 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-300 text-white'
      : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue'
  }`;

  const uploadBoxClasses = `mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
    isDragging 
      ? 'border-blue-500 bg-blue-500/10' 
      : darkMode 
        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
  }`;

  return (
    <form onSubmit={formik.handleSubmit} className={`space-y-4 p-6 rounded-lg border ${themeClasses}`}>
      <div>
        <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className={inputClasses}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        ) : null}
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Phone Number
        </label>
        <div className="flex">
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className={`mr-2 rounded-md border shadow-sm focus:ring focus:ring-opacity-50 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-300 text-white'
                : 'border-gray-300 focus:border-primary-blue focus:ring-primary-blue'
            }`}
          >
            {countryCodes.map((country: CountryCode) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <input
            id="phone"
            name="phone"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            placeholder="1234567890"
            className={`flex-1 ${inputClasses}`}
          />
        </div>
        <div className="text-xs mt-1 text-gray-500">
          {selectedCountryCode} {formik.values.phone ? formik.values.phone.replace(/^0+/, '') : '1234567890'}
        </div>
        {formik.touched.phone && formik.errors.phone ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
        ) : null}
      </div>

      {/* Car Model */}
      <div>
        <label htmlFor="carModel" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Car Model
        </label>
        <input
          id="carModel"
          name="carModel"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carModel}
          className={inputClasses}
        />
        {formik.touched.carModel && formik.errors.carModel ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.carModel}</div>
        ) : null}
      </div>

      {/* Damage Description */}
      <div>
        <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Damage Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className={inputClasses}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
        ) : null}
      </div>

      {/* Image Upload */}
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Damage Images (Max 5)
        </label>
        
        <div 
          className={uploadBoxClasses}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="space-y-1 text-center">
            <div className="flex flex-col items-center justify-center text-sm">
              <FiUpload className="mx-auto h-8 w-8 mb-2" />
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
              </p>
            </div>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              disabled={formik.values.images.length >= 5}
            />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              PNG, JPG, JPEG up to 5MB each
            </p>
          </div>
        </div>

        {/* Uploaded images preview and other elements remain the same */}
          {/* Uploaded images preview */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Selected Images ({uploadedImages.length}/5)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {uploadedImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}  
          {showProgress && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Uploading {uploadProgress}% complete...
              </p>
            </div>
          )}

        {uploadError && (
          <div className="mt-2 text-red-500 text-sm">{uploadError}</div>
        )}
      </div> 
      {/* Submit button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className={`w-full py-3 px-4 rounded-md hover:opacity-90 transition duration-200 ${
          darkMode 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-r from-primary-blue to-dark-blue text-white'
        } ${formik.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {formik.isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
      </button>
    </form>
  );
};

export default QuoteForm;