import type { Recipe, User } from "./types";

// Search API call
export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseUrl = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/search"
  );
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));

  const response = await fetch(baseUrl);
  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};

// get Information API call
export const getRecipeInformation = async (recipeId: string) => {
  const url = new URL(
    `https://recipe-app-production-39fc.up.railway.app/api/recipes/${recipeId}/information`
  );
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};

// get Favourite API call
export const getFavouriteRecipes = async (userId: number) => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/favourite"
  );
  url.searchParams.append("userId", userId.toString());

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};

// get Categories API call
export const getRecipeCategories = async () => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/categories"
  );
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};
// get Areas API call
export const getRecipeAreas = async () => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/areas"
  );
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};
// get Ingredients API call
export const getRecipeIngredients = async () => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/ingredients"
  );
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
  return response.json();
};
// get Random
export const getRandomRecipes = async () => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/random"
  );
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Failed to fetch random recipes");
    } else {
      throw new Error("Failed to fetch random recipes");
    }
  }
  return response.json();
};
//
export const getCurrentUser = async (): Promise<{ user: User }> => {
  const res = await fetch(
    "https://recipe-app-production-39fc.up.railway.app/api/me",
    {
      method: "GET",
      credentials: "include", // Send cookie
    }
  );

  if (!res.ok) {
    const text = await res.text();
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Not Authenticate");
    } else {
      throw new Error("Not Authenticate");
    }
  }
  const data = await res.json();
  return data; // { id, username }
};

// add Favourite API call
export const addFavouriteRecipe = async (recipe: Recipe, userId: number) => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/favourite"
  );
  const body = {
    recipeId: recipe.id.toString(), // Convert to string to match schema
    userId: userId,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
};

// remove Favourite API call
export const removeFavouriteRecipe = async (recipe: Recipe, userId: number) => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/favourite"
  );
  const body = {
    recipeId: recipe.id.toString(),
    userId: userId,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
};

export const searchRecipesWithFilters = async ({
  category,
  area,
  ingredient,
  page,
}: {
  category?: string;
  area?: string;
  ingredient?: string;
  page: number;
}) => {
  const url = new URL(
    "https://recipe-app-production-39fc.up.railway.app/api/recipes/advanced-search"
  );
  url.searchParams.append("page", String(page));
  if (category) url.searchParams.append("category", category);
  if (area) url.searchParams.append("area", area);
  if (ingredient) url.searchParams.append("ingredient", ingredient);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Failed to fetch filtered recipes");
    } else {
      throw new Error("Failed to fetch filtered recipes");
    }
  }
  return response.json();
};

export const login = async (username: string, password: string) => {
  const res = await fetch(
    "https://recipe-app-production-39fc.up.railway.app/api/login",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Login failed");
    } else {
      throw new Error("Login failed");
    }
  }
  return res.json();
};

export const signup = async (username: string, password: string) => {
  const res = await fetch(
    "https://recipe-app-production-39fc.up.railway.app/api/signup",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Signup failed");
    } else {
      throw new Error("Signup failed");
    }
  }
  const data = await res.json();
  return data;
};

export const logout = async () => {
  const res = await fetch(
    "https://recipe-app-production-39fc.up.railway.app/api/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      throw new Error(data.error || "Logout failed");
    } else {
      throw new Error("Logout failed");
    }
  }
  return res.json();
};
