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
    const page = parseInt(req.query.page as string);
    const results = await RecipeAPI.searchRecipes(searchTerm, page);

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

app.delete("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        await prismaClient.favouriteRecipes.delete({
            where: {
                recipeId: recipeId
            }
        })
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Oops, something went wrong"});
    }
})

app.listen(5000, () => {
    console.log("Server is running on localhost:5000");
});