import type { Recipe } from "./types";

// Search API call
export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));

  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// get Information API call
export const getRecipeInformation = async (recipeId: string) => {
  const url = new URL(
    `http://localhost:5000/api/recipes/${recipeId}/information`
  );
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// get Favourite API call
export const getFavouriteRecipes = async (userId: number) => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
  url.searchParams.append("userId", userId.toString());

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// get Categories API call
export const getRecipeCategories = async () => {
  const url = new URL("http://localhost:5000/api/recipes/categories");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
// get Areas API call
export const getRecipeAreas = async () => {
  const url = new URL("http://localhost:5000/api/recipes/areas");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
// get Ingredients API call
export const getRecipeIngredients = async () => {
  const url = new URL("http://localhost:5000/api/recipes/ingredients");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
// 
export const getRandomRecipes = async () => {
  const url = new URL("http://localhost:5000/api/recipes/random");
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch random recipes");
  return response.json();
};

// add Favourite API call
export const addFavouriteRecipe = async (recipe: Recipe, userId: number) => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
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
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

// remove Favourite API call
export const removeFavouriteRecipe = async (recipe: Recipe, userId: number) => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
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
    throw new Error(`HTTP error! Status: ${response.status}`);
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
  const url = new URL("http://localhost:5000/api/recipes/advanced-search");
  url.searchParams.append("page", String(page));
  if (category) url.searchParams.append("category", category);
  if (area) url.searchParams.append("area", area);
  if (ingredient) url.searchParams.append("ingredient", ingredient);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch filtered recipes");
  }

  return response.json();
};

export const login = async (username: string, password: string) => {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  console.log(data);
  return data;
};

export const signup = async (username: string, password: string) => {
  const res = await fetch("http://localhost:5000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  console.log(data);
  return data;
};