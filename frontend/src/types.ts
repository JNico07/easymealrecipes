export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
}

export interface RecipeInformation {
  id: number;
  title: string;
  summary: string;
  sourceName: string;
  youtubeTutorial: string;
  sourceUrl: string;
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

