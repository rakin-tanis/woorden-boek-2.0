"use client"

import React, { useState } from 'react';
import { Example } from '@/types';

interface EditExampleProps {
  showEditModal: boolean;
  example: Example | null | undefined;
  onSave: (updatedExample: Example) => Promise<void>;
  onCancel: () => void;
}

const EditExample: React.FC<EditExampleProps> = ({
  showEditModal,
  example,
  onSave,
  onCancel
}) => {
  if (!showEditModal) return

  const [dutch, setDutch] = useState<string | undefined>(example?.dutch);
  const [turkish, setTurkish] = useState<string | undefined>(example?.turkish);
  const [words, setWords] = useState<string | undefined>(example?.words?.join(","));
  const [source, setSource] = useState<string | undefined>(example?.source);
  const [level, setLevel] = useState<string | undefined>(example?.level);
  const [theme, setTheme] = useState<string | undefined>(example?.theme);
  const [status, setStatus] = useState<string | undefined>(example?.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!status || !status.trim()) {
      newErrors.status = 'Status field is required';
    }

    if (status === "published") {
      if (!dutch || !dutch.trim()) {
        newErrors.dutch = 'Dutch field is required';
      }

      if (!turkish || !turkish.trim()) {
        newErrors.turkish = 'Turkish field is required';
      }

      if (!words || !words?.split(',').map(w => w.trim()).filter(w => !!w)) {
        newErrors.words = 'Turkish field is required';
      }
    } else if (status === "draft") {
      if ((!dutch || !dutch.trim()) && (!turkish || !turkish.trim())) {
        newErrors.dutch = 'At least one of Dutch and Turkish fields is required for draft';
        newErrors.turkish = 'At least one of Dutch and Turkish fields is required for draft';
      }
    }

    if (!source || !source.trim()) {
      newErrors.source = 'Source field is required';
    }

    if (!level || !level.trim()) {
      newErrors.level = 'Level field is required';
    }

    if (!theme || !theme.trim()) {
      newErrors.theme = 'Theme field is required';
    }
    console.log(newErrors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        _id: example?._id,
        dutch: dutch || '',
        turkish: turkish || '',
        words: words?.split(',').map(w => w.trim()).filter(w => !!w) || [],
        source: source || '',
        theme: theme || '',
        level: level || '',
        status: status || '',
        tags: []
      });
    } catch (error) {
      console.error('Error saving example:', error);
      // Optionally set a general error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setDutch(undefined)
    setTurkish(undefined)
    setWords(undefined)
    setSource(undefined)
    setLevel(undefined)
    setTheme(undefined)
    setStatus(undefined)
    setErrors({})
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-10 bg-gray-100 dark:bg-gray-800 m-auto max-w-4xl h-fit p-10 rounded-lg border-2 shadow-lg drop-shadow-lg border-gray-300">
      <form onSubmit={handleSubmit} className="edit-example-form">
        <div className="flex flex-col gap-4">

          {/* Dutch Field */}
          <div className="form-group col-span-2">
            <label htmlFor="dutch" className="block mb-2">Dutch</label>
            <textarea
              id="dutch"
              name="dutch"
              value={dutch}
              onChange={(e) => setDutch(e.target.value)}
              rows={3}
              className={`dark:text-black w-full p-2 border ${errors.dutch ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            />
            {errors.dutch && (
              <p className="text-red-500 text-sm mt-1">{errors.dutch}</p>
            )}
          </div>

          {/* Turkish Field */}
          <div className="form-group col-span-2">
            <label htmlFor="turkish" className="block mb-2">Turkish</label>
            <textarea
              id="turkish"
              name="turkish"
              value={turkish}
              onChange={(e) => setTurkish(e.target.value)}
              rows={3}
              className={`dark:text-black w-full p-2 border ${errors.turkish ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            />
            {errors.turkish && (
              <p className="text-red-500 text-sm mt-1">{errors.turkish}</p>
            )}
          </div>

          {/* Words Field */}
          <div className="form-group col-span-2">
            <label htmlFor="words" className="block mb-2">Words</label>
            <input
              type="words"
              id="words"
              name="words"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              className={`dark:text-black w-full p-2 border ${errors.words ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            />
            {errors.words && (
              <p className="text-red-500 text-sm mt-1">{errors.words}</p>
            )}
          </div>

          {/* Source Field */}
          <div className="form-group">
            <label htmlFor="source" className="block mb-2">Source</label>
            <select
              id="source"
              name="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={`dark:text-black w-full p-2 border border-gray-300 ${errors.source ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            >
              <option value="undefined">Select Source</option>
              <option value="blue">Blue</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
            </select>
            {errors.source && (
              <p className="text-red-500 text-sm mt-1">{errors.source}</p>
            )}
          </div>

          {/* Level Field */}
          <div className="form-group">
            <label htmlFor="level" className="block mb-2">Level</label>
            <select
              id="level"
              name="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={`dark:text-black w-full p-2 border border-gray-300 ${errors.level ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            >
              <option value="undefined">Select level</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">{errors.level}</p>
            )}
          </div>

          {/* Theme Field */}
          <div className="form-group">
            <label htmlFor="theme" className="block mb-2">Theme</label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`dark:text-black w-full p-2 border border-gray-300 ${errors.theme ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            />
            {errors.theme && (
              <p className="text-red-500 text-sm mt-1">{errors.theme}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="form-group">
            <label htmlFor="status" className="block mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`dark:text-black w-full p-2 border border-gray-300 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            >
              <option value="undefined">Select Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : example?._id ? 'Save Changes' : 'Add Example'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExample;