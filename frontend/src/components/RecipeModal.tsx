import { useEffect, useState } from "react";
import type { RecipeInformation } from "../types";
import * as RecipeAPI from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeInformation, setRecipeInformation] =
    useState<RecipeInformation>();

  useEffect(() => {
    const fetchRecipeInformation = async () => {
      try {
        const informationRecipe = await RecipeAPI.getRecipeInformation(
          recipeId
        );
        setRecipeInformation(informationRecipe);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipeInformation();
  }, [recipeId]);

  if (!recipeInformation) {
    return <></>;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{recipeInformation.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: recipeInformation.summary }}
            ></div>

            {recipeInformation.youtubeTutorial && (
              <div>
                <p className="font-semibold mb-1">Video Tutorial:</p>
                <div className="aspect-[16/9] w-full">
                  <iframe
                    className="w-full h-full rounded"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      recipeInformation.youtubeTutorial
                    )}`}
                    title="YouTube Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div>
              <p className="font-semibold mb-1">Recipe Source:</p>
              <a
                href={recipeInformation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {recipeInformation.sourceName || recipeInformation.sourceUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
