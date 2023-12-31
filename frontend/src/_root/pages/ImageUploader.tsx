import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadFiles } from '@/lib/react-query/queriesAndMutations';
import { MediaItem } from '@/lib/types';
import { useMedia } from '@/context/MediaProvider';


const ImageUploader: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<MediaItem[]>([]);
  const { mutateAsync: uploadMediaFile, isPending: isLoading } = useUploadFiles();
  const { setMedia } = useMedia();
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.tempUrl || ''));
    };
  }, [uploadedImages]);

  const uploadFile = async (file: File) => {
    try {
      const id = `${Date.now()}-${file.name}`;
      const tempUrl = URL.createObjectURL(file);
  
      // Create a temporary image with loading state
      const tempImage: MediaItem = {
        id,
        tempUrl,
        title: isLoading?'true':'false',
        caption: '',
        description:  '',
        alt_text:  '',
        filename: '',
        cloudinary_id: '',
        url: '',
        size:'',
        storage_type: '',
        author: '',
        category: '',
        tags: '',
        domain:'he_group',
        createdAt:''
      };
  
      // Add the temporary image to the beginning of the array
      setMedia((prevImages) => [tempImage, ...prevImages]);
  
      const response = await uploadMediaFile(file);
  
      // Once uploaded, replace the temporary image with the actual uploaded image
      const uploadedImage: MediaItem = {
        id: response.data._id,
        tempUrl,
        title: response.data.title || '',
        caption: response.data.caption || '',
        description: response.data.description || '',
        alt_text: response.data.alt_text || '',
        filename: response.data.filename || '',
        cloudinary_id: response.data.cloudinary_id || '',
        url: response.data.url || '',
        size: response.data.size || '',
        storage_type: response.data.storage_type || '',
        author: response.data.author || '',
        category: response.data.category || '',
        tags: response.data.tags || [],
        domain: response.data.domain || [],
        createdAt: response.data.createdAt || '',
      };
  
      // Replace the temporary image with the actual uploaded image
      setMedia((prevImages) => prevImages.map(img => (img.id === id ? uploadedImage : img)));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div {...getRootProps()} className={dropzoneStyle(isDragActive)}>
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop images here, or click to select. You can upload multiple images.
        </p>
      </div>
    </div>
  );
};

const dropzoneStyle = (isDragActive: boolean): string => `
  border-2 border-dashed ${isDragActive ? 'border-green-500' : 'border-gray-300'
  } rounded p-4 text-center cursor-pointer transition duration-300 ease-in-out
`;

export default ImageUploader;
