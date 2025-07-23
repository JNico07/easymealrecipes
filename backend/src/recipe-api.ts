import { title } from "process";

const apiKey = process.env.API_KEY;

// search by name
export const searchRecipes = async (searchTerm: string) => {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
  url.searchParams.set("s", searchTerm);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    const meals = data.meals || [];

    // Map the results to match the Recipe interface
    const results = meals.map((meals: any) => ({
      id: meals.idMeal,
      title: meals.strMeal,
      image: meals.strMealThumb,
      imageType: "jpg",
    }));

    return { results };
  } catch (err) {
    console.error(err);
    return { results: [] };
  }
};

// lookup Info by ID
export const getRecipeInformation = async (recipeId: string) => {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/lookup.php");
  url.searchParams.set("i", recipeId);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    const meal = data.meals ? data.meals[0] : null;

    if (!meal) return null;

    // Transform to match frontend's RecipeInformation
    return {
      id: parseInt(meal.idMeal),
      title: meal.strMeal,
      summary: meal.strInstructions,
      sourceName: meal.strSource || "TheMealDB",
      image: meal.strMealThumb,
      imageType: "jpg",
      youtubeTutorial: meal.strYoutube || "",
      sourceUrl:
        meal.strSource || "https://www.themealdb.com/meal/" + meal.idMeal,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Manual batching of favorites
export const getFavouriteRecipesByIds = async (ids: string[]) => {
  const requests = ids.map((id) => getRecipeInformation(id));
  const results = await Promise.all(requests);
  return { results: results.filter(Boolean) };
};

// get categories
export const getRecipeCategories = async () => {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/categories.php");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    const category = data.categories || [];

    const categories = category.map((category: any) => ({
      id: category.idCategory,
      category: category.strCategory,
      categoryImage: category.strCategoryThumb,
      categoryDescription: category.strCategoryDescription,
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};
// get areas
export const getRecipeAreas = async () => {
  const url = new URL(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    const area = data.meals || [];

    const categories = area.map((area: any) => ({
      area: area.strArea,
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};
// get ingredients
export const getRecipeIngredients = async () => {
  const url = new URL(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    const ingredient = data.meals || [];

    const ingredients = ingredient.map((ingredient: any) => ({
      id: ingredient.idIngredient,
      ingredient: ingredient.strIngredient,
      description: ingredient.strDescription,
      type: ingredient.strType,
    }));

    return ingredients;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};
// Search recipes by filters (category, area, ingredient)
export const searchRecipesByFilters = async ({
  category,
  area,
  ingredient,
}: {
  category?: string;
  area?: string;
  ingredient?: string;
}) => {
  let url: URL;

  // Decide endpoint priority (use filter endpoints)
  if (category) {
    url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
    url.searchParams.set("c", category);
  } else if (area) {
    url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
    url.searchParams.set("a", area);
  } else if (ingredient) {
    url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
    url.searchParams.set("i", ingredient);
  } else {
    return { results: [] };
  }

  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    const meals = data.meals || [];

    const results = meals.map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      imageType: "jpg",
    }));

    return { results };
  } catch (err) {
    console.error(err);
    return { results: [] };
  }
};
