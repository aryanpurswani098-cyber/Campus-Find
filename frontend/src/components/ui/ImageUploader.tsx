import React, { useState, useCallback } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { itemsApi } from '../../api/items';

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, maxImages = 4 }) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setUploading(true);
    const newUrls = [...images];
    
    try {
      for (const file of files) {
        const { url } = await itemsApi.uploadImage(file);
        newUrls.push(url);
      }
      setImages(newUrls);
      onImagesChange(newUrls);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload images.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = images.filter((_, i) => i !== index);
    setImages(newUrls);
    onImagesChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-cf-border group">
            <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-cf-green bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-cf-green animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
};
