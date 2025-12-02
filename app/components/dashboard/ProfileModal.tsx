'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: FormData;
  onSave: (data: FormData) => Promise<void>;
}

export default function ProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ProfileModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editMode ? 'Edit Profile' : 'Profile Information'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {editMode ? (
            <>
              {/* Edit Mode */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(initialData);
                  }}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div>
                <div className="flex items-start space-x-3 mb-6">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.name}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-3 mb-6">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-3 mb-6">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Phone
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      Location
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.location}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
