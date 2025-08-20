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
      id: parseInt(meals.idMeal),
      title: meals.strMeal,
      image: meals.strMealThumb,
      imageType: "jpg",
      strTags: meals.strTags,
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
    const meals = data.meals || [];

    if (meals.length === 0) return null;

    const meal = meals[0]; // take the first one
    const ingredients: { ingredient: string; measure: string }[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ ingredient, measure: measure || "" });
      }
    }

    return {
      id: parseInt(meal.idMeal),
      title: meal.strMeal,
      instruction: meal.strInstructions,
      sourceName: meal.strSource || "",
      youtubeTutorial: meal.strYoutube || "",
      sourceUrl: meal.strSource || "",
      image: meal.strMealThumb,
      imageType: "jpg",
      ingredients,
      strTags: meal.strTags,
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

// get randomly
export const getRandomRecipes = async (count = 10) => {
  type Meal = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strTags: string;
  };

  type MealDBResponse = {
    meals: Meal[];
  };

  try {
    const promises = Array.from({ length: count }, () =>
      fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
        (res) => res.json() as Promise<MealDBResponse>
      )
    );

    const results = await Promise.all(promises);
    const recipes = results
      .map((r) => r.meals?.[0])
      .filter(Boolean)
      .map((meal) => ({
        id: parseInt(meal.idMeal),
        title: meal.strMeal,
        image: meal.strMealThumb,
        imageType: "jpg",
        strTags: meal.strTags || "",
      }));

    return { results: recipes };
  } catch (err) {
    console.error("Error fetching random meals:", err);
    return { results: [] };
  }
};
