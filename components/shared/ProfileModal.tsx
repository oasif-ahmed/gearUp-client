"use client";

import React, { useState, useEffect } from 'react';
import { User, X } from 'lucide-react'; // Assuming User and X icons are still available

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    profilePhoto: string;
    phone: string;
    bio: string;
  };
}

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose }) => {
  console.log("MODAL DEBUG: ProfileModal rendered with isOpen:", isOpen);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState(user?.profile?.bio || '');
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState(user?.profile?.profilePhoto || '/placeholder-avatar.jpg');

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedBio(user.profile?.bio || '');
      setPreviewProfilePhoto(user.profile?.profilePhoto || '/placeholder-avatar.jpg');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = () => {
    // In a real application, you would send editedName, editedBio, etc. to your backend here.
    console.log("Saving changes:", { editedName, editedBio, previewProfilePhoto });
    onClose();
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-24 w-24 rounded-full border-2 border-gray-300 dark:border-gray-600">
            <img
              src={previewProfilePhoto}
              alt="Profile Photo"
              className="h-full w-full rounded-full object-cover"
            />
            <label htmlFor="profilePhotoInput" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-1 text-white hover:bg-blue-700">
              <input
                id="profilePhotoInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePhotoChange}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.389-8.389-2.828-2.828z" />
              </svg>
            </label>
          </div>

          <div className="w-full">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="w-full">
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              id="bio"
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
            ></textarea>
          </div>

          <button
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
