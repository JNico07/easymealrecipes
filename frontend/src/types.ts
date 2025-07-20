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