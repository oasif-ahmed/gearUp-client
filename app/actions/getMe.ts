"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    const res = await fetch(
        `${process.env.BACKEND_API_URL}/api/user/me`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store"
        }
    );

    if (!res.ok) {
        return null;
    }

    const result = await res.json();

    console.log(result);

    return result.data;
}