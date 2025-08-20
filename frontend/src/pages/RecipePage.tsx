import { FC, useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SearchComponent from "../components/SearchComponent";
import RecipeSection from "../components/RecipeSection";
import type { Recipe } from "../types";
import {
  getRandomRecipes,
  searchRecipes,
  getFavouriteRecipes,
  addFavouriteRecipe,
  removeFavouriteRecipe,
  searchRecipesWithFilters,
  logout
} from "../api";

interface RecipePageProps {
  userId: number;
  username: string | null;
  /** Layout style: 'sidebar' for Dashboard-style with sidebar, 'tabs' for Home-style with tabs */
  layoutStyle?: "sidebar" | "tabs";
}

type Tab = "home" | "explore" | "favorites";

const RecipePage: FC<RecipePageProps> = ({ userId, username, layoutStyle = "sidebar" }) => {
  // Navigation and UI state
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const pageNumber = useRef(1);

  // Recipe data state
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [exploreRecipes, setExploreRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  // UI state
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Selected filters for advanced search
  const [selectedFilters, setSelectedFilters] = useState<{
    category?: string;
    area?: string;
    ingredient?: string;
  }>({
    category: "",
    area: "",
    ingredient: "",
  });

  // Fetch recommended and explore recipes on initial load or tab change
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (activeTab === "home" || activeTab === "explore") {
          // Fetch recommended recipes
          const recommendedRes = await getRandomRecipes();
          setRecommendedRecipes(recommendedRes.results);

          // Fetch explore recipes
          const exploreRes = await getRandomRecipes();
          setExploreRecipes(exploreRes.results);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [activeTab]);

  // Fetch favorite recipes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;

      try {
        const favoritesRes = await getFavouriteRecipes(userId);
        const favorites = favoritesRes.results || [];
        const favoriteIds = favorites.map((recipe: Recipe) => recipe.id);
        setFavoriteRecipeIds(favoriteIds);
        setFavoriteRecipes(favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId, activeTab]);

  // Handle basic search
  const handleSearch = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    try {
      const resultsRes = await searchRecipes(searchTerm, 1);
      const results = resultsRes.results || [];
      setRecommendedRecipes(results.slice(0, 6));
      setExploreRecipes(results.slice(6, 14));
      pageNumber.current = 1;
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  // Handle search form submit (for Home-style layout)
  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await searchRecipes(searchTerm, 1);
      setRecommendedRecipes(recipes.results.slice(0, 6));
      setExploreRecipes(recipes.results.slice(6, 14));
      pageNumber.current = 1;
    } catch (e) {
      console.log(e);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async (filters: {
    category: string;
    area: string;
    ingredient: string;
  }) => {
    try {
      const response = await searchRecipesWithFilters({
        ...filters,
        page: 1,
      });

      setSelectedFilters(filters);
      setRecommendedRecipes(response.results.slice(0, 6));
      setExploreRecipes(response.results.slice(6, 14));
      pageNumber.current = 1;
    } catch (error) {
      console.error("Error applying advanced filters:", error);
    }
  };

  // Handle "View More" functionality
  const handleViewMoreClick = async () => {
    try {
      let nextRecipes;

      if (searchTerm.trim() === "" && !selectedFilters.category) {
        const res = await getRandomRecipes();
        nextRecipes = res.results;
      } else {
        const nextPage = pageNumber.current + 1;
        const res = await searchRecipes(searchTerm, nextPage);
        nextRecipes = res.results;
        pageNumber.current = nextPage;
      }

      setExploreRecipes([...exploreRecipes, ...nextRecipes]);
    } catch (e) {
      console.log(e);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (recipe: Recipe) => {
    try {
      if (favoriteRecipeIds.includes(recipe.id)) {
        await removeFavouriteRecipe(recipe, userId);
        setFavoriteRecipeIds(
          favoriteRecipeIds.filter((id) => id !== recipe.id)
        );
        setFavoriteRecipes(favoriteRecipes.filter((r) => r.id !== recipe.id));
      } else {
        await addFavouriteRecipe(recipe, userId);
        setFavoriteRecipeIds([...favoriteRecipeIds, recipe.id]);
        setFavoriteRecipes([...favoriteRecipes, recipe]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  // Handle navigation/tab change
  const handleNavigate = (item: string) => {
    setActiveTab(item as Tab);

    // Toggle showing only favorites when the favorites menu item is clicked
    if (item === "favorites") {
      setShowOnlyFavorites(true);
    } else {
      setShowOnlyFavorites(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout: ", error);
    }
  };

  // Determine if we should show only favorites based on active tab
  const isShowingOnlyFavorites = showOnlyFavorites || activeTab === "favorites";

  return (
    <>
      {/* Tabs-style navigation (from Home.tsx) */}
      {layoutStyle === "tabs" && (
        <nav className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 z-40">
          <div className="text-2xl md:text-3xl font-extrabold text-orange-600 flex items-center gap-2">
            🍽️{" "}
            <span>
              Welcome to{" "}
              <span
                className="text-[#FF8C42] cursor-pointer hover:underline"
                onClick={() => setActiveTab("explore")}
              >
                EasyMealRecipes
              </span>
              ,{" "}
              {username
                ? username.charAt(0).toUpperCase() + username.slice(1)
                : ""}
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-4 border-b">
              {["explore", "favorites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleNavigate(tab as Tab)}
                  className={`py-2 px-4 font-semibold capitalize ${
                    activeTab === tab
                      ? "border-b-4 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <div
        className={
          layoutStyle === "tabs"
            ? "min-h-screen bg-[#FFF8F0] py-10 px-4 md:px-20 font-sans flex flex-col gap-8"
            : "flex min-h-screen bg-gray-50"
        }
      >
        {/* Sidebar-style navigation (from Dashboard.tsx and MainPage.tsx) */}
        {layoutStyle === "sidebar" && (
          <>
            {/* Sidebar - Hidden on mobile, visible on medium screens and up */}
            <div className="hidden md:block">
              <Sidebar activeItem={activeTab} onNavigate={handleNavigate} />
            </div>

            {/* Mobile Header - Visible only on small screens */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 md:hidden">
              <div className="flex items-center justify-between p-4">
                <div className="text-xl font-bold text-orange-600">
                  🍽️ EasyMealRecipes
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("home")}
                    className={`px-3 py-1 ${
                      activeTab === "home" ? "text-orange-600" : "text-gray-600"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab("explore")}
                    className={`px-3 py-1 ${
                      activeTab === "explore"
                        ? "text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`px-3 py-1 ${
                      activeTab === "favorites"
                        ? "text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    Favorites
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main
          className={
            layoutStyle === "sidebar"
              ? "flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0"
              : ""
          }
          role="main"
        >
          <div className="max-w-7xl mx-auto">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {isShowingOnlyFavorites
                  ? `My Favorite Recipes${username ? ` - ${username}` : ""}`
                  : `Welcome${username ? `, ${username}` : ""}!`}
              </h1>
              <p className="text-gray-600 mt-2">
                {isShowingOnlyFavorites
                  ? "Here are all your saved favorite recipes"
                  : "What would you like to cook today?"}
              </p>
            </div>

            {/* Search Component - Only show when not in favorites view */}
            {!isShowingOnlyFavorites && (
              <div className="mb-10">
                <SearchComponent
                  onSearch={
                    layoutStyle === "tabs" ? handleSearchSubmit : handleSearch
                  }
                  onApplyFilters={handleAdvancedSearch}
                  initialFilters={selectedFilters}
                  placeholder="Enter a search term ..."
                />
              </div>
            )}

            {/* Recipe Sections */}
            {isShowingOnlyFavorites ? (
              // Show only favorite recipes when in favorites view
              favoriteRecipes.length > 0 ? (
                <RecipeSection
                  title="My Favorite Recipes"
                  recipes={favoriteRecipes}
                  cardsPerRow={layoutStyle === "tabs" ? 4 : 3}
                  favoriteRecipes={favoriteRecipeIds}
                  onFavoriteClick={handleFavoriteToggle}
                  showModal={true}
                  cardVariant="modern"
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">
                    You don't have any favorite recipes yet.
                  </p>
                  <p className="mt-2 text-gray-500">
                    Browse recipes and click the heart icon to add them to your
                    favorites.
                  </p>
                  <button
                    onClick={() => handleNavigate("home")}
                    className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Browse Recipes
                  </button>
                </div>
              )
            ) : (
              // Show recommended and explore recipes in normal view
              <>
                {recommendedRecipes.length > 0 && (
                  <RecipeSection
                    title="Recommended Recipes"
                    recipes={recommendedRecipes}
                    cardsPerRow={3}
                    favoriteRecipes={favoriteRecipeIds}
                    onFavoriteClick={handleFavoriteToggle}
                    showModal={true}
                    cardVariant="modern"
                  />
                )}

                {exploreRecipes.length > 0 && (
                  <>
                    <RecipeSection
                      title="Explore Recipes"
                      recipes={exploreRecipes}
                      cardsPerRow={4}
                      favoriteRecipes={favoriteRecipeIds}
                      onFavoriteClick={handleFavoriteToggle}
                      showModal={true}
                      cardVariant="classic"
                    />

                    <button
                      className="text-xl p-4 font-bold mx-auto block mt-8"
                      onClick={handleViewMoreClick}
                    >
                      View More
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default RecipePage;