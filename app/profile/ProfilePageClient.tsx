"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, User as UserIcon, Shield, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const router = useRouter();
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedBio, setEditedBio] = useState(user?.profile?.bio || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState(
    user?.profile?.profilePhoto || ""
  );
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || "");
      setEditedBio(user.profile?.bio || "");
      setPreviewProfilePhoto(user.profile?.profilePhoto || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background font-mono">
        <div className="text-center space-y-3 p-8 border border-border bg-card">
          <h2 className="text-xl font-serif font-light text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">Please authenticate to inspect your profile ledger.</p>
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
            throw new Error("ImgBB API key is missing. Check your environment variables.");
          }

          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
          });

          const imgbbData = await imgbbRes.json();
          if (!imgbbRes.ok || !imgbbData.success) {
            throw new Error(imgbbData.error?.message || "Failed to upload avatar to ImgBB.");
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

        setSuccessMessage("Profile parameters updated successfully.");
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    });
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono py-12 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted border border-border text-xs uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Account Administration
            </div>
            <h1 className="text-4xl font-serif font-light tracking-tight text-foreground">
              User Profile & Settings
            </h1>
          </div>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 rounded-none">
            <span className="font-bold">Error:</span> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded-none">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Grid: Identity Overview vs Edit Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Identity Card */}
          <div className="md:col-span-4 bg-card border border-border p-6 space-y-6 shadow-xs rounded-none">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative h-28 w-28 border border-border overflow-hidden rounded-none bg-muted flex items-center justify-center">
                {previewProfilePhoto ? (
                  <img
                    src={previewProfilePhoto}
                    alt={user.name || "User Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground font-mono">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>

              <div className="space-y-1 w-full">
                <h2 className="text-lg font-bold text-foreground tracking-tight truncate">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground uppercase tracking-wider">Access Role</span>
                <span className="inline-flex items-center gap-1 font-bold text-foreground bg-muted px-2.5 py-1 border border-border">
                  <Shield className="h-3 w-3 text-primary" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editing Form */}
          <div className="md:col-span-8 bg-card border border-border p-6 sm:p-8 space-y-6 shadow-xs rounded-none">
            <div className="border-b border-border pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Edit Credentials & Bio
              </h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">
                Update your display name, public biography, or upload a custom avatar.
              </p>
            </div>

            <div className="space-y-5">
              
              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Profile Photograph
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePhotoUpload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="profilePhotoUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-border bg-muted text-foreground hover:bg-accent/10 cursor-pointer rounded-none transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5 text-primary" /> Choose File
                  </label>
                  <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {selectedFile ? selectedFile.name : "No new file chosen"}
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Full Name
                </label>
                <Input
                  type="text"
                  className="w-full h-10 rounded-none border-border bg-muted text-xs font-mono text-foreground focus-visible:ring-primary"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Professional Biography / Bio
                </label>
                <textarea
                  className="w-full rounded-none border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  rows={4}
                  placeholder="Share a brief overview of your expertise or equipment interests..."
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                />
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Button
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase font-semibold h-11 px-8 shadow-xs"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}