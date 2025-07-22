import { useEffect, useRef, useState, type FormEvent } from "react";
import "./App.css";
import * as api from "./api";
import type { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";
import AdvanceSearchModal from "./components/AdvanceSearchModal";

type Tabs = "explore" | "favourites";

const App = () => {
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
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteRecipes();
  }, []);

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
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipes) => recipe.id.toString() !== favRecipes.id.toString()
      );
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  const applyAdvancedFilters = async ({
    category,
    area,
    ingredient,
  }: {
    category?: string;
    area?: string;
    ingredient?: string;
  }) => {
    try {
      const response = await api.searchRecipesWithFilters({
        category,
        area,
        ingredient,
        page: 1,
      });

      setRecipes(response.results);
      pageNumber.current = 1;
    } catch (error) {
      console.error("Error applying advanced filters:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/hero-image.jpg" alt="hero-image" />
        <div className="title">My Recipe App</div>
      </div>

      <div className="tabs">
        <h1
          className={selectedTab === "explore" ? "tab-active" : ""}
          onClick={() => setSelectedTab("explore")}
        >
          Explore
        </h1>
        <h1
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          Favourites
        </h1>
      </div>

      {/* Search Tab */}
      {selectedTab === "explore" && (
        <>
          <div className="search-bar">
            <form onSubmit={(event) => handleSearchSubmit(event)}>
              <input
                type="text"
                required
                placeholder="Enter a search term ..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button type="submit">
                <AiOutlineSearch size={40} />
              </button>
            </form>

            <button
              className="advanced-search-button"
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
              />
            )}
          </div>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavorite = favouriteRecipes.some(
                (favRecipe) => favRecipe.id.toString() === recipe.id.toString()
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

          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {/* Favourites Tab */}
      {selectedTab === "favourites" && (
        <div className="recipe-grid">
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
  );
};

export default App;
