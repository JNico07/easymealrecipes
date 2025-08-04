import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import * as RecipeAPI from "./recipe-api";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const app = express();
const prismaClient = new PrismaClient();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://recipe-app-eta-lime.vercel.app",
      "https://recipe-app-production-39fc.up.railway.app",
    ],
    credentials: true,
  })
);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// GET - START
// search endpoint
app.get("/api/recipes/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm as string;
    const results = await RecipeAPI.searchRecipes(searchTerm);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

// information endpoint
app.get("/api/recipes/:recipeId/information", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeInformation(recipeId);
    res.json(results);
  } catch (error) {
    console.error("Recipe info error:", error);
    res.status(500).json({ error: "Failed to get recipe information" });
  }
});

// favourite endpoint
app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const recipes = await prismaClient.favouriteRecipes.findMany({
      where: { userId: parseInt(userId) },
    });
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

    const favourites = await RecipeAPI.getFavouriteRecipesByIds(recipeIds);
    res.json(favourites);
  } catch (error) {
    console.error("Favourite recipes error:", error);
    res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// categories endpoint
app.get("/api/recipes/categories", async (req, res) => {
  try {
    const categories = await RecipeAPI.getRecipeCategories();
    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});

// areas endpoint
app.get("/api/recipes/areas", async (req, res) => {
  try {
    const areas = await RecipeAPI.getRecipeAreas();
    res.json(areas);
  } catch (error) {
    console.error("Areas error:", error);
    res.status(500).json({ error: "Failed to get areas" });
  }
});

// ingredients endpoint
app.get("/api/recipes/ingredients", async (req, res) => {
  try {
    const ingredients = await RecipeAPI.getRecipeIngredients();
    res.json(ingredients);
  } catch (error) {
    console.error("Ingredients error:", error);
    res.status(500).json({ error: "Failed to get ingredients" });
  }
});

// Advanced Search Endpoint
app.get("/api/recipes/advanced-search", async (req, res) => {
  try {
    const category = req.query.category as string;
    const area = req.query.area as string;
    const ingredient = req.query.ingredient as string;

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
    console.error("Random recipes error:", error);
    res.status(500).json({ error: "Failed to fetch random meals" });
  }
});

// POST - START
app.post("/api/recipes/favourite", async (req, res) => {
  try {
    const { recipeId, userId } = req.body;

    if (!recipeId || !userId) {
      return res.status(400).json({ error: "Missing recipeId or userId" });
    }

    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId.toString(),
        userId: Number(userId),
      },
    });

    res.status(201).json(favouriteRecipe);
  } catch (error: any) {
    console.error("Add favourite error:", error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Recipe already added to favourites." });
    }
    res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const user = await prismaClient.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with more explicit options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created!", userId: newUser.id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user. Please try again." });
  }
});

app.get("/api/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

    const user = await prismaClient.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// DELETE
app.delete("/api/recipes/favourite", async (req, res) => {
  try {
    const { recipeId, userId } = req.body;

    if (!recipeId || !userId) {
      return res.status(400).json({ error: "Missing recipeId or userId" });
    }

    const recipe = await prismaClient.favouriteRecipes.findFirst({
      where: {
        recipeId: recipeId,
        userId: parseInt(userId),
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found in favorites" });
    }

    await prismaClient.favouriteRecipes.delete({
      where: { id: recipe.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete favourite error:", error);
    res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
