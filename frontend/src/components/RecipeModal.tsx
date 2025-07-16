import { useEffect, useState } from "react";
import type { RecipeInformation } from "../types";
import * as RecipeAPI from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeInformation, setRecipeInformation] = useState<RecipeInformation>();

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
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeInformation.title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>

          <div className="modal-body">
            <div
              className="recipe-information"
              dangerouslySetInnerHTML={{ __html: recipeInformation.summary }}
            ></div>

            <div className="source-info" style={{ marginTop: "1.5rem" }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                Recipe Source:
              </p>
              <a
                href={recipeInformation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", textDecoration: "underline" }}
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
