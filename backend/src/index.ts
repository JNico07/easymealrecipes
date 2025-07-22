import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as RecipeAPI from './recipe-api';
import { PrismaClient } from '@prisma/client';

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

// search endpoint
app.get("/api/recipes/search", async (req, res) => {
    // GET http://localhost/api/recipes/search?searchTerm=burger&page=1
    const searchTerm = req.query.searchTerm as string;
    const results = await RecipeAPI.searchRecipes(searchTerm);

    res.json(results);
});

// information endpoint
app.get("/api/recipes/:recipeId/information", async (req, res) => {
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeInformation(recipeId);

    res.json(results);
});

// post favourite endpoint
app.post("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        const favouriteRecipe = await prismaClient.favouriteRecipes.create({
            data: {
                recipeId: recipeId
            }
        });
        res.status(201).json(favouriteRecipe);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Oops, something went wrong"});
    }
});

// get favourite endpoint
app.get("/api/recipes/favourite", async (req, res) => {
    try {
        const recipes = await prismaClient.favouriteRecipes.findMany();
        const recipeIds = recipes.map((recipe) => recipe.recipeId.toString())

        const favourites = await RecipeAPI.getFavouriteRecipesByIds(recipeIds);

        res.json(favourites);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Oops, something went wrong"});
    }
});

// get categories endpoint
app.get("/api/recipes/categories", async (req, res) => {
    const categories = await RecipeAPI.getRecipeCategories();
    res.json(categories);
});
// get areas endpoint
app.get("/api/recipes/areas", async (req, res) => {
    const areas = await RecipeAPI.getRecipeAreas();
    res.json(areas);
});
// get ingredients endpoint
app.get("/api/recipes/ingredients", async (req, res) => {
  const ingredients = await RecipeAPI.getRecipeIngredients();
  res.json(ingredients);
});

// Advanced Search Endpoint
app.get("/api/recipes/advanced-search", async (req, res) => {
  const category = req.query.category as string;
  const area = req.query.area as string;
  const ingredient = req.query.ingredient as string;

  try {
    const results = await RecipeAPI.searchRecipesByFilters({
      category,
      area,
      ingredient,
    });

    res.json(results);
  } catch (error) {
    console.error("Advanced search failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// delete favourite endpoint
app.delete("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        // Check if recipe exists first
        const recipe = await prismaClient.favouriteRecipes.findUnique({
            where: {
                recipeId: recipeId
            }
        });

        if (!recipe) {
            res.status(404).json({ error: "Recipe not found in favorites" });
        }

        await prismaClient.favouriteRecipes.delete({
            where: {
                recipeId: recipeId
            }
        });
        
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Oops, something went wrong"});
    }
});

app.listen(5000, () => {
    console.log("Server is running on localhost:5000");
});