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