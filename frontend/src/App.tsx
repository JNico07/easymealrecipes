import { useState, type FormEvent } from "react";
import "./App.css";
import * as api from "./api";
import type { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
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
    </div>
  )
}

export default App