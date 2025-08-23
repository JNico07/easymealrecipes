# 🍽️ EasyMealRecipes

**EasyMealRecipes** is a full-stack web application for discovering, searching, and saving meal recipes.
Powered by:

- **Frontend**: React + TypeScript + Tailwind CSS  
- **Backend**: Node.js + Express + Prisma  
- **Data Source**: [TheMealDB API](https://www.themealdb.com/)

**Live Links:**  
- Frontend: <a href="https://easymealrecipes.vercel.app" target="_blank">https://easymealrecipes.vercel.app</a>  
- Backend: <a href="https://easymealrecipes-api.up.railway.app" target="_blank">https://easymealrecipes-api.up.railway.app</a>

---

## ✨ Features

- 🔍 **Recipe Search**: Search for meals by name, category, area, or ingredient  
- 🎲 **Random Recipes**: Discover a variety of random meals on every visit  
- ⭐ **Favourites**: Logged-in users can save, view, and manage their favourite recipes  
- 🧑 **User Authentication**: Secure signup, login, and session handling  
- 🗂️ **Advanced Filtering**: Narrow down meals by category, area, or ingredients  
- 📋 **Recipe Details**: Detailed view with ingredients, instructions, images, and YouTube links  
- 🛡️ **Backend API**: RESTful APIs for recipe browsing, user management, and favourites  
- 🖼️ **Modern UI**: Fully responsive interface built with Tailwind and React components  

<p align="center">
  <img src="https://github.com/jaynico-dev/nico-portfolio/raw/main/public/easymealrecipes.gif" alt="EasyMealRecipes Demo" width="80%"/>
</p>

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- npm (v9+ recommended)  
- PostgreSQL
- TheMealDB API Key

---

### 🔧 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JNico07/easymealrecipes.git
cd easymealrecipes
```

#### 2. Backend Setup

```bash
cd backend
npm install
# Update backend/.env
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Access the App

- 🌐 **Frontend**: [http://localhost:5173](http://localhost:5173)  
- 🔌 **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```text
backend/
  src/
    index.ts         # Express server & API routes
    recipe-api.ts    # TheMealDB API integration
  prisma/
    schema.prisma    # Database schema

frontend/
  src/
    components/      # React UI components
    pages/           # Main app pages (Home, Login, Signup)
    api.ts           # Frontend API calls
    types.ts         # TypeScript types
  public/            # Static assets (images, logos)
```

---

## 📦 Dependencies

### 🔙 Backend

- express  
- prisma / @prisma/client  
- bcrypt  
- cookie-parser  
- cors  
- dotenv  
- jsonwebtoken  
- node-fetch  
- typescript, ts-node, nodemon (dev)

### 🔜 Frontend

- react, react-dom  
- react-router-dom  
- react-icons  
- tailwindcss, tailwind-merge, clsx  
- @radix-ui/react-dialog  
- typescript, vite
