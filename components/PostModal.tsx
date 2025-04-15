// components/PostModal.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import { submitPost } from '@/lib/functions';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const [postText, setPostText] = useState('');
  const [goodName, setGoodName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setPostText('');
      setGoodName('');
      setImage(null);
      setImagePreviewUrl(null);
      setSubmissionError(null);
    }
  }, [isOpen]);

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleGoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoodName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file); // Use the handleFile function
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleFile = useCallback((file: File) => { // Use useCallback for optimization
    setImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile); // Use the handleFile function
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const formData = new FormData();
    formData.append('post', postText);
    formData.append('good', goodName);
    if (image) {
      formData.append('image', image);
    }

    try {
      const result = await submitPost(formData);
      if (result) {
        console.log('Post submitted successfully!', result);
        onClose();
      } else {
        setSubmissionError('Failed to submit post.');
      }
    } catch (error: any) {
      console.error('Error submitting post:', error);
      setSubmissionError('An unexpected error occurred while submitting the post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center overflow-y-auto z-50 bg-black bg-opacity-50"
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="postText" className="block text-gray-700 text-sm font-bold mb-2">
              Post Text
            </label>
            <textarea
              id="postText"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="What's on your mind?"
              value={postText}
              onChange={handlePostChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goodName" className="block text-gray-700 text-sm font-bold mb-2">
              Good Name (Optional)
            </label>
            <input
              type="text"
              id="goodName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Name of something good"
              value={goodName}
              onChange={handleGoodChange}
            />
          </div>
          <div
            className="mb-4 border-dashed border-2 border-gray-400 p-4 rounded-lg text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={triggerFileInput} // Make the drop area clickable
          >
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Image (Optional)
            </label>
            {imagePreviewUrl ? (
              <div className="mt-2">
                <img src={imagePreviewUrl} alt="Image Preview" className="max-h-40 rounded" />
              </div>
            ) : (
              <div>
                Drag and drop image here or click to select
              </div>
            )}
            <input
              type="file"
              id="image"
              className="hidden" // Hide the default file input
              onChange={handleImageChange}
              accept="image/png, image/jpeg"
              ref={fileInputRef}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {submissionError && <p className="text-red-500 mt-2">{submissionError}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostModal;