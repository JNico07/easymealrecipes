import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // burger + close icons
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
  logout,
} from "../api";

interface RecipePageProps {
  userId: number;
  username: string | null;
  layoutStyle?: "sidebar" | "tabs";
}

type Tab = "home" | "explore" | "favorites";

const RecipePage: FC<RecipePageProps> = ({
  userId,
  username,
  layoutStyle = "sidebar",
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // burger menu state
  const pageNumber = useRef(1);
  const exploreRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [exploreRecipes, setExploreRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    category?: string;
    area?: string;
    ingredient?: string;
  }>({
    category: "",
    area: "",
    ingredient: "",
  });

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (activeTab === "home" || activeTab === "explore") {
          const recommendedRes = await getRandomRecipes();
          setRecommendedRecipes(recommendedRes.results || []);
          const exploreRes = await getRandomRecipes();
          setExploreRecipes(exploreRes.results || []);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, [activeTab]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const favoritesRes = await getFavouriteRecipes(userId);
        const favorites = favoritesRes.results || [];
        setFavoriteRecipeIds(favorites.map((r: Recipe) => r.id));
        setFavoriteRecipes(favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [userId, activeTab]);

  // Search
  const performSearch = async (term: string) => {
    try {
      setSearchTerm(term);
      if (!term.trim()) return setSearchResults([]);
      const recipes = await searchRecipes(term, 1);
      setSearchResults(recipes.results || []);
      pageNumber.current = 1;
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdvancedSearch = async (filters: {
    category?: string;
    area?: string;
    ingredient?: string;
  }) => {
    try {
      const response = await searchRecipesWithFilters({ ...filters, page: 1 });
      setSelectedFilters(filters);
      setSearchResults(response.results || []);
      pageNumber.current = 1;
    } catch (error) {
      console.error("Error applying advanced filters:", error);
    }
  };

  // View More
  const handleViewMoreClick = async () => {
    try {
      let nextRecipes;
      if (!searchTerm.trim() && !selectedFilters.category) {
        const res = await getRandomRecipes();
        nextRecipes = res.results || [];
      } else {
        const nextPage = pageNumber.current + 1;
        const res = await searchRecipes(searchTerm, nextPage);
        nextRecipes = res.results || [];
        pageNumber.current = nextPage;
      }
      setExploreRecipes([...exploreRecipes, ...nextRecipes]);
    } catch (e) {
      console.log(e);
    }
  };

  // Favorite toggle
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

  // Navigation
  const handleNavigate = (item: string) => {
    setActiveTab(item as Tab);
    setShowOnlyFavorites(item === "favorites");
    setIsMenuOpen(false); // close menu when navigating
    if (item === "explore" && exploreRef.current) {
      setTimeout(() => {
        exploreRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout: ", error);
    }
  };

  const isShowingOnlyFavorites = showOnlyFavorites || activeTab === "favorites";

  return (
    <>
      {/* Top Nav (Mobile + Tabs) */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between p-4 md:hidden">
        <div className="text-lg font-bold text-orange-600">EasyMealRecipes</div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Slide-in mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          <h2 className="text-xl font-bold text-orange-600 mb-4">
            EasyMealRecipes
          </h2>
          {["home", "explore", "favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleNavigate(tab as Tab)}
              className={`text-left px-3 py-2 rounded-md font-medium ${
                activeTab === tab
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar / Tabs */}
      {layoutStyle === "sidebar" && (
        <div className="hidden md:block">
          <Sidebar
            activeItem={activeTab}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Main Content */}
      <main
        className={
          layoutStyle === "sidebar"
            ? "flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 bg-gray-50 min-h-screen"
            : "pt-16 md:pt-6 min-h-screen bg-[#FFF8F0] px-3 md:px-12"
        }
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isShowingOnlyFavorites
                ? `My Favorite Recipes${username ? ` - ${username}` : ""}`
                : `Welcome${username ? `, ${username}` : ""}!`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isShowingOnlyFavorites
                ? "Here are all your saved favorite recipes"
                : "What would you like to cook today?"}
            </p>
          </div>

          {/* Search */}
          {!isShowingOnlyFavorites && (
            <div className="mb-6">
              <SearchComponent
                onSearch={performSearch}
                onApplyFilters={handleAdvancedSearch}
                initialFilters={selectedFilters}
                placeholder="Enter a search term ..."
              />
            </div>
          )}

          {/* Recipes */}
          {isShowingOnlyFavorites ? (
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
                <p className="text-lg text-gray-500">
                  You don’t have any favorite recipes yet.
                </p>
                <button
                  onClick={() => handleNavigate("home")}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Browse Recipes
                </button>
              </div>
            )
          ) : searchResults.length > 0 ? (
            <RecipeSection
              title={`Search Results for "${searchTerm}"`}
              recipes={searchResults}
              cardsPerRow={layoutStyle === "tabs" ? 4 : 3}
              favoriteRecipes={favoriteRecipeIds}
              onFavoriteClick={handleFavoriteToggle}
              showModal={true}
              cardVariant="modern"
            />
          ) : (
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
                <div ref={exploreRef}>
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
                    className="text-lg p-3 font-bold mx-auto block mt-6 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    onClick={handleViewMoreClick}
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default RecipePage;
