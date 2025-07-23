/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,userId]` on the table `FavouriteRecipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `FavouriteRecipes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FavouriteRecipes_recipeId_key";

-- AlterTable
ALTER TABLE "FavouriteRecipes" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteRecipes_recipeId_userId_key" ON "FavouriteRecipes"("recipeId", "userId");

-- AddForeignKey
ALTER TABLE "FavouriteRecipes" ADD CONSTRAINT "FavouriteRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
