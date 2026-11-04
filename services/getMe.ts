import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Server-side accessToken:", !!accessToken);

  if (!accessToken) {
    console.log("SERVER LOG: accessToken not found.");
    return null;
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("GetMe failed:", res.status);
    return null;
  }

  const result = await res.json();

  console.log("Logged-in user:", result.data.user);

  return result.data.user;
};