import { FC, FormEvent, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import * as api from "../api";
import type { RecipeArea, RecipeCategory, RecipeIngredient } from "../types";

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
  onApplyFilters?: (filters: {
    category?: string;
    area?: string;
    ingredient?: string;
  }) => void;
  placeholder?: string;
  initialFilters?: {
    category?: string;
    area?: string;
    ingredient?: string;
  };
}

const SearchComponent: FC<SearchComponentProps> = ({ 
  onSearch, 
  onApplyFilters,
  placeholder = "What do you want to cook today?",
  initialFilters = { category: "", area: "", ingredient: "" }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // Advanced search states
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [areas, setAreas] = useState<RecipeArea[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || "");
  const [selectedArea, setSelectedArea] = useState(initialFilters.area || "");
  const [selectedIngredient, setSelectedIngredient] = useState(initialFilters.ingredient || "");

  // Effect to set initial filter values when props change
  useEffect(() => {
    setSelectedCategory(initialFilters.category || "");
    setSelectedArea(initialFilters.area || "");
    setSelectedIngredient(initialFilters.ingredient || "");
  }, [initialFilters]);

  // Fetch filter options when advanced search is opened
  useEffect(() => {
    if (showAdvancedSearch) {
      const fetchFilterOptions = async () => {
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
      fetchFilterOptions();
    }
  }, [showAdvancedSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        category: selectedCategory,
        area: selectedArea,
        ingredient: selectedIngredient,
      });
      setShowAdvancedSearch(false);
    }
  };

  return (
    <div className="w-full">
      {/* Basic Search Bar */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200"
        role="search"
      >
        <label htmlFor="recipe-search" className="sr-only">Search recipes</label>
        <input
          id="recipe-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 py-3 px-4 text-lg outline-none"
        />
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(true)}
            className="p-3 text-gray-500 hover:text-orange-600 transition-colors"
            aria-label="Advanced Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
          <button
            type="submit"
            className="p-3 text-gray-500 hover:text-orange-600 transition-colors"
            aria-label="Search"
          >
            <Search size={24} aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 space-y-6 relative">
            <button
              onClick={() => setShowAdvancedSearch(false)}
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">{initialFilters.category || "Select a category"}</option>
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
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">{initialFilters.area || "Select an area"}</option>
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
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">{initialFilters.ingredient || "Select an ingredient"}</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.ingredient}>
                      {ingredient.ingredient}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;