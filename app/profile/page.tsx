import React from "react";
import ProfilePageClient from "./ProfilePageClient";
import { getMe } from "@/services/getMe";

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <div className="container mx-auto py-10 px-4">
      <ProfilePageClient user={user} />
    </div>
  );
}