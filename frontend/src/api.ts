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

// get Summary API call
export const getRecipeSummary = async (recipeId: string) => {
  const url = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// get Favourite API call
export const getFavouriteRecipes = async () => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// add Favourite API call
export const addFavouriteRecipe = async (recipe: Recipe) => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
  const body = {
    recipeId: recipe.id
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

// remove
export const removeFavouriteRecipe = async (recipe: Recipe) => {
  const url = new URL("http://localhost:5000/api/recipes/favourite");
  const body = {
    recipeId: recipe.id
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
