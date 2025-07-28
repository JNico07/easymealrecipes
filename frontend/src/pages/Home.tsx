import { useEffect, useRef, useState, type FormEvent } from "react";
import "../App.css";
import * as api from "../api";
import type { Recipe } from "../types";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";
import AdvanceSearchModal from "../components/AdvanceSearchModal";

type Tabs = "explore" | "favourites";

interface HomeProps {
  userId: number;
}

const Home = ({ userId }: HomeProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );

  const [selectedTab, setSelectedTab] = useState<Tabs>("explore");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Fetch favourite recipes on initial load on "FAVOURITES" tab
  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      if (!userId) return; // Prevent fetching if not logged in
      try {
        const favouriteRecipes = await api.getFavouriteRecipes(userId);
        setFavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) fetchFavouriteRecipes();
  }, [userId, selectedTab]);

  // Fetch random recipes when the app loads on "SEARCH" tab
  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        if (
          selectedTab === "explore" &&
          searchTerm.trim() === "" &&
          recipes.length === 0
        ) {
          const response = await api.searchRecipes("", 1);
          setRecipes(response.results);
          pageNumber.current = 1;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRandomRecipes();
  }, [selectedTab]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      pageNumber.current = 1;
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (e) {
      console.log(e);
    }
  };

  const addFavouriteRecipe = async (recipe: Recipe) => {
    if (!userId) return; // prevent sending if not logged in
    try {
      await api.addFavouriteRecipe(recipe, userId);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe, userId!);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipes) => recipe.id.toString() !== favRecipes.id.toString()
      );
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  // State to hold selected filters
  const [selectedFilters, setSelectedFilters] = useState<{
    category?: string;
    area?: string;
    ingredient?: string;
  }>({
    category: "",
    area: "",
    ingredient: "",
  });

  // Function to apply advanced filters
  const applyAdvancedFilters = async (filters: {
    category?: string;
    area?: string;
    ingredient?: string;
  }) => {
    try {
      const response = await api.searchRecipesWithFilters({
        ...filters,
        page: 1,
      });

      setSelectedFilters(filters); // Save chosen filters
      setRecipes(response.results);
      pageNumber.current = 1;
    } catch (error) {
      console.error("Error applying advanced filters:", error);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 z-40">
        <div className="text-xl font-bold text-gray-800">My Recipe App</div>
        <div className="flex gap-4">
          <div className="flex gap-4 border-b">
            {["explore", "favourites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as Tabs)}
                className={`py-2 px-4 font-semibold capitalize ${
                  selectedTab === tab
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="min-h-screen bg-[#FFF8F0] py-10 px-4 md:px-20 font-sans flex flex-col gap-8">
        {/* Search Tab */}
        {selectedTab === "explore" && (
          <>
            <div className="flex items-center gap-4 mt-4 px-4 flex-wrap">
              <form
                onSubmit={(event) => handleSearchSubmit(event)}
                className="flex items-center flex-1 bg-white rounded-md shadow px-4 py-2"
              >
                <input
                  type="text"
                  required
                  placeholder="Enter a search term ..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="flex-1 text-2xl px-2 py-1 border-none focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white border-none cursor-pointer text-gray-700"
                >
                  <AiOutlineSearch size={40} />
                </button>
              </form>

              <button
                className="bg-[#FF8C42] hover:bg-[#ff6200] text-white font-bold text-lg px-6 py-3 rounded-md h-[70px] transition-colors duration-200"
                onClick={() => setShowAdvancedSearch(true)}
              >
                <p>Advanced Search</p>
              </button>

              {showAdvancedSearch && (
                <AdvanceSearchModal
                  onClose={() => setShowAdvancedSearch(false)}
                  onApplyFilters={(filters) => {
                    applyAdvancedFilters(filters);
                    setShowAdvancedSearch(false); // Close modal after applying
                  }}
                  initialFilters={selectedFilters} // Pass the filters
                />
              )}
            </div>

            <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
              {recipes.map((recipe) => {
                const isFavorite = favouriteRecipes.some(
                  (favRecipe) =>
                    favRecipe.id.toString() === recipe.id.toString()
                );

                return (
                  <RecipeCard
                    key={recipe.id.toString()}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onFavouriteButtonClick={
                      isFavorite ? removeFavouriteRecipe : addFavouriteRecipe
                    }
                    isFavourite={isFavorite}
                  />
                );
              })}
            </div>

            <button
              className="text-xl p-4 font-bold mx-auto"
              onClick={handleViewMoreClick}
            >
              View More
            </button>
          </>
        )}

        {/* Favourites Tab */}
        {selectedTab === "favourites" && (
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
            {favouriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id.toString()}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onFavouriteButtonClick={removeFavouriteRecipe}
                isFavourite={true}
              />
            ))}
          </div>
        )}

        {selectedRecipe ? (
          <RecipeModal
            recipeId={selectedRecipe.id.toString()}
            onClose={() => setSelectedRecipe(undefined)}
          />
        ) : null}
      </div>
    </>
  );
};

export default Home;
