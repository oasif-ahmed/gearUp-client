"use server";
import { jwtUtils } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const loginUser = async (prevState: any, formData: FormData) => {
  // Handle SSR - return prevState when no form data (initial render)
  if (!formData || !formData.get("email")) {
    return prevState;
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed!");
  }

  if (result.success && result.data) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.jwtAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "none",
      secure: true, // Required for HTTPS (Vercel backend)
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.jwtRefreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none",
      secure: true, // Required for HTTPS (Vercel backend)
      path: "/",
    });

    const decodedToken = jwtUtils.verifyToken(
      result.data.jwtAccessToken,
      process.env.JWT_ACCESS_SECRET!,
    );

    if (!decodedToken.success) {
      throw new Error(decodedToken.error);
    }

    const payload = decodedToken.data as JwtPayload;

    if (payload.role === "CUSTOMER") {
      redirect("/");
    } else if (payload.role === "PROVIDER") {
      redirect("dashboard/provider");
    } else if (payload.role === "ADMIN") {
      redirect("/dashboard/admin");
    }
    return result.data.user;
  }
};


// register
export const registerUser = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,  
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Registration failed!" };
    }

    if (result.data?.user || res.ok) {
      redirect("/login");
    }

    return { success: true, message: "Registered successfully!" };
  } catch (error: any) {
    // Next.js redirect throws a special error that must be re-thrown
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
};


export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/");
}


interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  profilePhoto?: string;
}


export const updateProfile = async (payload: { name: string; bio: string; profilePhoto: string }) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      
      body: JSON.stringify({
        name: payload.name,
        bio: payload.bio,
        profilePhoto: payload.profilePhoto,
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update profile." };
    }

    revalidatePath("/", "layout");
    revalidatePath("/profile");

    return { success: true, data: result.data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};