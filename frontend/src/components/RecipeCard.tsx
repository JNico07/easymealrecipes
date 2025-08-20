import type { FC } from "react";
import { Heart } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import type { Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  isFavourite?: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onFavouriteButtonClick?: (recipe: Recipe) => void;
  onFavoriteClick?: (recipe: Recipe) => void;
  variant?: "modern" | "classic";
}



const RecipeCard: FC<RecipeCardProps> = ({
  recipe,
  isFavourite,
  isFavorite,
  onClick,
  onFavouriteButtonClick,
  onFavoriteClick,
  variant = "classic",
}) => {
  // Normalize naming conventions
  const isFav = isFavorite || isFavourite || false;
  const onFavClick = onFavoriteClick || onFavouriteButtonClick || (() => {});

  // Modern variant (previously NewRecipeCard)
  if (variant === "modern") {
    return (
      <div
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        onClick={onClick}
        role="article"
        aria-label={`Recipe: ${recipe.title}`}
      >
        {/* Card Image with Cooking Time and Favorite Button */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />

          {/* Favorite Button */}
          <button
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFav ? "bg-red-500 text-white" : "bg-white text-gray-700"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onFavClick(recipe);
            }}
            aria-label={
              isFav
                ? `Remove ${recipe.title} from favorites`
                : `Add ${recipe.title} to favorites`
            }
            aria-pressed={isFav}
          >
            <Heart
              size={18}
              fill={isFav ? "white" : "none"}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.strTags &&
              recipe.strTags.split(",").map((tag, index) => {
                const colors = [
                  "bg-blue-100 text-blue-600",
                  "bg-green-100 text-green-600",
                  "bg-pink-100 text-pink-600",
                  "bg-orange-100 text-orange-600",
                  "bg-purple-100 text-purple-600",
                ];
                const colorClass = colors[index % colors.length]; // cycle colors

                return (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}
                  >
                    {tag.trim()}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // Classic variant (previously RecipeCard)
  return (
    <div
      className="flex flex-col justify-evenly bg-white p-4 shadow-md relative cursor-pointer gap-4 transition duration-300 hover:shadow-lg hover:scale-[1.03] rounded-xl"
      onClick={onClick}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover rounded-lg"
      />

      <div className="flex items-center gap-2">
        <span
          onClick={(event) => {
            event.stopPropagation();
            onFavClick(recipe);
          }}
        >
          {isFav ? (
            <AiFillHeart size={25} className="text-red-500" />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </span>
        <h3 className="text-xl font-semibold truncate">{recipe.title}</h3>
      </div>
    </div>
  );
};

export default RecipeCard;
