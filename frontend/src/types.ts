export interface User {
  id: number;
  username: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  strTags: string;
}

export interface RecipeInformation {
  id: number;
  title: string;
  instruction: string;
  sourceName: string;
  youtubeTutorial: string;
  sourceUrl: string;
  image: string;
  imageType: string;
  ingredients: {
    ingredient: string;
    measure: string;
  }[];
  strTags: string;
}

export interface RecipeCategory {
  id: number;
  category: string;
  categoryImage: string;
  categoryDescription: string;
}
export interface RecipeArea {
  area: string;
}
export interface RecipeIngredient {
  id: number;
  ingredient: string;
  description: string;
  type: string;
}
