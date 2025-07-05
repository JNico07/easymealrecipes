import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as RecipeAPI from './recipe-api';

const app = express();

app.use(express.json());
app.use(cors());

// search endpoint
app.get("/api/recipes/search", async (req, res) => {
    // GET http://localhost/api/recipes/search?searchTerm=burger&page=1
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await RecipeAPI.searchRecipes(searchTerm, page);

    res.json(results);
});

// summary endpoint
app.get("/api/recipes/:recipeId/summary", async (req, res) => {
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId);

    res.json(results);
});

app.listen(5000, () => {
    console.log("Server is running on localhost:5000");
});