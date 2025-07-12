import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  setFieldValue: (
    field: string,
    value: File[],
    shouldValidate?: boolean
  ) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setFieldValue }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFieldValue('images', acceptedFiles);
  }, [setFieldValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Damage Photos (Max 5)
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {isDragActive ? (
            <p className="text-primary-blue font-medium">
              Drop the files here...
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Drag & drop photos here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                Accepted: JPEG, PNG, WEBP (Max 5MB each)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;