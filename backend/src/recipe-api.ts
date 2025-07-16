const apiKey = process.env.API_KEY;

// SEARCH
export const searchRecipes = async (searchTerm: string, page:number) => {
    if(!apiKey) {
        throw new Error("API key is not set");
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString()
    }
    url.search = new URLSearchParams(queryParams).toString();

    try {
        const searchResponse = await fetch(url);
        const resultJson = await searchResponse.json();
        return resultJson;
    } catch (error) {
        console.log(error);
    }
};

// INFORMATION
export const getRecipeInformation = async (recipeId: string) => {
    if (!apiKey) {
        throw new Error("API key is not set");
    }

    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/information`);
    const params = {
        apiKey: apiKey
    };
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url);
    const json = await response.json();

    return json;
};

// FAVOURITE
export const getFavouriteRecipesByIds = async (ids: string[]) => {
    if (!apiKey) {
        throw new Error("API key is not set");
    }
    
    const url = new URL ('https://api.spoonacular.com/recipes/informationBulk');
    const params = {
        apiKey: apiKey,
        ids: ids.join(",")
    }
    url.search = new URLSearchParams(params).toString();

    const searchResponse = await fetch(url);
    const json = await searchResponse.json();

    return { results: json };
};