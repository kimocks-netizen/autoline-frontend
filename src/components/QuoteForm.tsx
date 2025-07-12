import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const QuoteForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      carModel: '',
      description: '',
      images: [] as File[]
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      phone: Yup.string()
        .required('Required')
        .matches(/^[0-9]+$/, "Must be numbers only"),
      carModel: Yup.string().required('Required'),
      description: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('carModel', values.carModel);
        formData.append('description', values.description);
        values.images.forEach(image => {
          formData.append('images', image);
        });

        await axios.post(
          'https://autolinepanel-backend-production.up.railway.app/api/quotes',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        alert('Quote request submitted successfully!');
        formik.resetForm();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert('Error submitting quote');
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring focus:ring-primary-blue focus:ring-opacity-50"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        ) : null}
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring focus:ring-primary-blue focus:ring-opacity-50"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className="text-red-500 text-sm">{formik.errors.phone}</div>
        ) : null}
      </div>

      {/* Car Model */}
      <div>
        <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
          Car Model
        </label>
        <input
          id="carModel"
          name="carModel"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carModel}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring focus:ring-primary-blue focus:ring-opacity-50"
        />
        {formik.touched.carModel && formik.errors.carModel ? (
          <div className="text-red-500 text-sm">{formik.errors.carModel}</div>
        ) : null}
      </div>

      {/* Damage Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Damage Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring focus:ring-primary-blue focus:ring-opacity-50"
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-sm">{formik.errors.description}</div>
        ) : null}
      </div>

      {/* Image Upload */}
      <ImageUpload 
        setFieldValue={formik.setFieldValue}
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary-blue to-dark-blue text-white py-2 px-4 rounded-md hover:opacity-90 transition duration-200"
      >
        Submit Quote Request
      </button>
    </form>
  );
};

export default QuoteForm;