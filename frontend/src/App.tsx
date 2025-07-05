import { useRef, useState, type FormEvent } from "react";
import "./App.css";
import * as api from "./api";
import type { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      pageNumber.current = 1;
    } catch (e) {
      console.log(e);
    }
  }

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <form onSubmit={(event)=> handleSearchSubmit(event)}>
        <input 
          type="text" 
          required 
          placeholder="Enter a search term ..."
          value={searchTerm}
          onChange={(event)=> setSearchTerm(event.target.value)}
          >
        </input>
        <button type="submit">Submit</button>
      </form>
      
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe}/>
      ))}

      <button 
        className="view-more-button" 
        onClick={handleViewMoreClick}
        >
        View More
      </button>

    </div>
  )
}

export default App