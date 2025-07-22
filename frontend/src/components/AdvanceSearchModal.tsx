import { useEffect, useState } from "react";
import * as api from "../api";
import type { RecipeArea, RecipeCategory, RecipeIngredient } from "../types";

interface Props {
  onClose: () => void;
}

const AdvanceSearchModal = ({ onClose }: Props) => {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [areas, setAreas] = useState<RecipeArea[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

  // Fetch categories when the modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await api.getRecipeCategories();
        const areas = await api.getRecipeAreas();
        const ingredients = await api.getRecipeIngredients();

        if (!categories || !areas || !ingredients) {
          throw new Error("Failed to fetch categories, areas, or ingredients");
        }

        setCategories(categories);
        setAreas(areas);
        setIngredients(ingredients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-center">Advanced Filters</h2>

        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700"
            >
              Area (Cuisine)
            </label>
            <select
              id="area"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">-- Select Area --</option>
              {areas.map((area) => (
                <option key={area.area} value={area.area}>
                  {area.area}
                </option>
              ))}
            </select>
          </div>

          {/* Ingredient Filter */}
          <div>
            <label
              htmlFor="ingredient"
              className="block text-sm font-medium text-gray-700"
            >
              Main Ingredient
            </label>
            <select
              id="ingredient"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">-- Select Ingredient --</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.ingredient}>
                  {ingredient.ingredient}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvanceSearchModal;
