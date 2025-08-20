import { useState, useEffect } from "react";
import type { FC } from "react";
import RecipeCard from "./RecipeCard";
import type { Recipe, RecipeInformation } from "../types";
import * as api from "../api";

interface RecipeSectionProps {
  title: string;
  recipes: Recipe[];
  cardsPerRow: 3 | 4;
  favoriteRecipes: number[];
  onRecipeClick?: (recipe: Recipe) => void;
  onFavoriteClick: (recipe: Recipe) => void;
  showModal?: boolean;
  cardVariant?: "modern" | "classic";
}

const RecipeSection: FC<RecipeSectionProps> = ({
  title,
  recipes,
  cardsPerRow,
  favoriteRecipes,
  onRecipeClick,
  onFavoriteClick,
  showModal = false,
  cardVariant = "modern",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDetails, setRecipeDetails] = useState<RecipeInformation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRecipeClick = (recipe: Recipe) => {
    if (onRecipeClick) {
      onRecipeClick(recipe);
    } else if (showModal) {
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    }
  };

  // Fetch recipe details using our backend API
  useEffect(() => {
    if (isModalOpen && selectedRecipe) {
      setIsLoading(true);

      api
        .getRecipeInformation(String(selectedRecipe.id)) // 🔹 use provided API
        .then((data: RecipeInformation) => {
          setRecipeDetails(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching recipe details:", error);
          setIsLoading(false);
        });
    }
  }, [isModalOpen, selectedRecipe]);

  return (
    <section
      className="mb-12"
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <h2
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-2xl font-bold mb-6"
      >
        {title}
      </h2>

      {/* Recipe Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          cardsPerRow === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
        } gap-6`}
      >
        {recipes.map((recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favoriteRecipes.includes(recipe.id)}
              onClick={() => handleRecipeClick(recipe)}
              onFavoriteClick={onFavoriteClick}
              variant={cardVariant}
            />
          );
        })}
      </div>

      {/* Modal */}
      {showModal && isModalOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            {isLoading ? (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading recipe details...</p>
              </div>
            ) : recipeDetails ? (
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold">{recipeDetails.title}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                  >
                    &times;
                  </button>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Image & Category */}
                  <div>
                    <img
                      src={selectedRecipe.image}
                      alt={recipeDetails.title}
                      className="w-full rounded-xl shadow-md object-cover"
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedRecipe.strTags && selectedRecipe.strTags.trim() !== "" &&
                        selectedRecipe.strTags.split(",").map((tag, index) => {
                          const colors = [
                            "bg-blue-100 text-blue-800",
                            "bg-green-100 text-green-700",
                            "bg-pink-100 text-pink-700",
                            "bg-orange-100 text-orange-700",
                            "bg-purple-100 text-purple-700",
                          ];
                          const colorClass = colors[index % colors.length];
                          return (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
                            >
                              {tag.trim()}
                            </span>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right: Ingredients */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">
                      Ingredients
                    </h3>
                    <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-700">
                      {recipeDetails.ingredients.map((item, index) => (
                        <li key={index} className="leading-relaxed">
                          <span className="font-medium">{item.measure}</span>{" "}
                          {item.ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full-width Instructions */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">
                      Instructions
                    </h3>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {recipeDetails.instruction}
                    </p>

                    {/* External Links */}
                    <div className="mt-8 flex flex-col md:flex-row gap-3">
                      {recipeDetails.youtubeTutorial && (
                        <a
                          href={recipeDetails.youtubeTutorial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition w-full md:w-auto"
                        >
                          🎥 Watch on YouTube
                        </a>
                      )}
                      {recipeDetails.sourceUrl && (
                        <a
                          href={recipeDetails.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full md:w-auto"
                        >
                          📖 View Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-600">Recipe details not available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeSection;
