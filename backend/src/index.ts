import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

// GET - START
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
// favourite endpoint
app.get("/api/recipes/favourite", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
  }

  // Fetch favourite recipes for the logged-in user
  try {
    const recipes = await prismaClient.favouriteRecipes.findMany({
        where: { userId: parseInt(userId) },
    });
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

    const favourites = await RecipeAPI.getFavouriteRecipesByIds(recipeIds);

    res.json(favourites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, something went wrong" });
  }
});
// categories endpoint
app.get("/api/recipes/categories", async (req, res) => {
  const categories = await RecipeAPI.getRecipeCategories();
  res.json(categories);
});
// areas endpoint
app.get("/api/recipes/areas", async (req, res) => {
  const areas = await RecipeAPI.getRecipeAreas();
  res.json(areas);
});
// ingredients endpoint
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
// Random Recipe Endpoint
app.get("/api/recipes/random", async (req, res) => {
  try {
    const { results } = await RecipeAPI.getRandomRecipes(10);
    res.json({ results });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch random meals" });
  }
});
// GET - END

// POST - START
// favourite endpoint
app.post("/api/recipes/favourite", async (req, res) => {
  const { recipeId, userId } = req.body;

  if (!recipeId || !userId) {
    res.status(400).json({ error: "Missing recipeId or userId" });
    return;
  }

  // save favourite recipe to loged-in user
  try {
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId.toString(), // Ensure recipeId is string
        userId: Number(userId), // Ensure userId is number
      },
    });

    res.status(201).json(favouriteRecipe);
  } catch (error: any) {
    console.log(error);
    // handle duplicate
    if (error.code === "P2002") {
      res.status(409).json({ error: "Recipe already added to favourites." });
      return;
    }

    res.status(500).json({ error: "Oops, something went wrong" });
  }
});
// login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  // find user by username from the database
  const user = await prismaClient.user.findUnique({
    where: { username },
  });
  // Check if user exists
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  // authenticate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  // Check if password is valid
  if (!isPasswordValid) {
    res.status(401).json({ error: "Invalid username or password. " });
    return;
  }

  res.json({ message: "Login successful", userId: user.id });
});
// signup endpoint
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  // Find username in the database
  const existingUser = await prismaClient.user.findUnique({
    where: { username },
  });
  // Check if user already exists
  if (existingUser) {
    res.status(400).json({ error: "Username already taken." });
    return;
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new user
  const newUser = await prismaClient.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  // Respond with success
  res.status(201).json({ message: "User created!", userId: newUser.id });
});
// POST - END

// DELETE 
// favourite endpoint
app.delete("/api/recipes/favourite", async (req, res) => {
  const { recipeId, userId } = req.body;

  if (!recipeId || !userId) {
    res.status(400).json({ error: "Missing recipeId or userId" });
  }

  try {
    // Check if recipe exists first with both recipeId and userId
    const recipe = await prismaClient.favouriteRecipes.findFirst({
      where: {
        recipeId: recipeId,
        userId: parseInt(userId),
      },
    });

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found in favorites" });
      return;
    }

    await prismaClient.favouriteRecipes.delete({
      where: {
        id: recipe.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on localhost:5000");
});
