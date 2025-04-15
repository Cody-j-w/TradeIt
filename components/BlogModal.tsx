// components/BlogModal.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { submitPost } from '@/lib/functions'; // Assuming submitPost handles blog posts

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
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
      setImages([]);
      setImagePreviewUrls([]);
      setSubmissionError(null);
    }
  }, [isOpen]);

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    } else {
      setImages([]);
      setImagePreviewUrls([]);
    }
  };

  const handleFiles = useCallback((files: File[]) => {
    const newImages = [...images];
    const newImagePreviewUrls: string[] = [...imagePreviewUrls];

    for (let i = 0; i < files.length && newImages.length < 5; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        newImagePreviewUrls.push(URL.createObjectURL(file));
      }
    }

    if (newImages.length > 5) {
      setSubmissionError("You can upload a maximum of 5 images.");
      return;
    }

    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  }, [images, imagePreviewUrls]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFiles(Array.from(droppedFiles));
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const formData = new FormData();
    formData.append('text', postText);
    formData.append('type', 'blog'); // Set type to 'blog'

    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    try {
      const result = await submitPost(formData);
      if (result) {
        console.log('Blog post submitted successfully!', result);
        onClose();
      } else {
        setSubmissionError('Failed to submit blog post.');
      }
    } catch (error: any) {
      console.error('Error submitting blog post:', error);
      setSubmissionError('An unexpected error occurred while submitting the blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setImagePreviewUrls(imagePreviewUrls.filter((_, index) => index !== indexToRemove));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center overflow-y-auto z-50 bg-black bg-opacity-50"
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Create New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="postText" className="block text-gray-700 text-sm font-bold mb-2">
              Blog Text
            </label>
            <textarea
              id="postText"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={6}
              placeholder="Write your blog post here..."
              value={postText}
              onChange={handlePostChange}
              required
            />
          </div>

          <div
            className="mb-4 border-dashed border-2 border-gray-400 p-4 rounded-lg text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={triggerFileInput}
          >
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Images (Up to 5)
            </label>
            {imagePreviewUrls.length > 0 ? (
              <div className="flex flex-wrap justify-center">
                {imagePreviewUrls.map((previewUrl, index) => (
                  <div key={index} className="relative m-2">
                    <img src={previewUrl} alt={`Image Preview ${index + 1}`} className="max-h-40 rounded" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-700"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                Drag and drop up to 5 images here or click to select
              </div>
            )}
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImageChange}
              accept="image/png, image/jpeg"
              multiple // Allow multiple file selection
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

export default BlogModal;