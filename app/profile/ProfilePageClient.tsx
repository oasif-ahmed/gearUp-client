"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { Loader2, Upload } from "lucide-react";
import { updateProfile } from "@/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    profilePhoto?: string;
    phone?: string;
    bio?: string;
  };
}

interface ProfilePageClientProps {
  user: User | null;
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  const router = useRouter(); // 2. Initialize router
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedBio, setEditedBio] = useState(user?.profile?.bio || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState(
    user?.profile?.profilePhoto || "/placeholder-avatar.jpg"
  );
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || "");
      setEditedBio(user.profile?.bio || "");
      setPreviewProfilePhoto(user.profile?.profilePhoto || "/placeholder-avatar.jpg");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900">Not Logged In</h2>
          <p className="mt-2 text-xs text-zinc-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        let photoUrl = user?.profile?.profilePhoto || "";

        if (selectedFile) {
          const formData = new FormData();
          formData.append("image", selectedFile);

          const apiKey = process.env.NEXT_PUBLIC_IMAGE_BB_API_KEY;
          if (!apiKey) {
            throw new Error("ImgBB API key is missing. Check your .env file for NEXT_PUBLIC_IMAGE_BB_API_KEY.");
          }

          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
          });

          const imgbbData = await imgbbRes.json();
          if (!imgbbRes.ok || !imgbbData.success) {
            throw new Error(imgbbData.error?.message || "Failed to upload image to ImgBB.");
          }

          photoUrl = imgbbData.data.url;
        }

        const payload = {
          name: editedName,
          bio: editedBio,
          profilePhoto: photoUrl,
        };

        const result = await updateProfile(payload);

        if (result && !result.success) {
          throw new Error(result.message || "Failed to update profile.");
        }

        setSuccessMessage("Profile updated successfully!");
        
        // 3. Force Next.js to re-fetch server data and update Navbar + Profile state instantly
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-10 px-4 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <div className="border border-zinc-200 bg-white p-6 rounded-none shadow-xs">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24 border border-zinc-200 overflow-hidden rounded-none bg-zinc-100">
              <img
                src={previewProfilePhoto}
                alt={user.name || "User Avatar"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-zinc-900">{user.name}</h1>
              <p className="text-xs font-mono text-zinc-500">{user.email}</p>
              <p className="text-xs font-mono text-zinc-500">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Card */}
        <div className="border border-zinc-200 bg-white p-6 rounded-none shadow-xs">
          <h2 className="mb-4 text-sm font-mono uppercase tracking-tight text-zinc-900">Edit Profile</h2>
          
          {errorMessage && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-600 text-xs">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700">Profile Picture</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="profilePhotoUpload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profilePhotoUpload"
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 cursor-pointer rounded-none"
                >
                  <Upload className="h-3.5 w-3.5" /> Choose Image
                </label>
                <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-none border border-zinc-200 bg-background px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700">Bio</label>
              <textarea
                className="mt-1 w-full rounded-none border border-zinc-200 bg-background px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                rows={3}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="rounded-none bg-zinc-900 px-6 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}