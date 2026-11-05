"use server";

export const getCategories = async () => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
        cache: "no-store"
    });

    if(!res.ok){
        throw new Error("Categories not found!.")
    }
    const result = await res.json();

    return result.data.categories;
}