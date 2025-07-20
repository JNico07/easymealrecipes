import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import type { Recipe } from "../types";

interface Props {
  recipe: Recipe;
  isFavourite: boolean;
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}: Props) => {
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
            onFavouriteButtonClick(recipe);
          }}
        >
          {isFavourite ? (
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
