/*
  Warnings:

  - You are about to drop the column `flower_days` on the `Genetic` table. All the data in the column will be lost.
  - Added the required column `flowerDays` to the `Genetic` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlantStage" AS ENUM ('SEED', 'VEGETATIVE', 'FLOWERING', 'HARVEST', 'DRIED', 'CURED', 'PACKAGED', 'SOLD', 'DESTROYED');

-- AlterTable
ALTER TABLE "Genetic" RENAME COLUMN "flower_days" TO "flowerDays";

-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "motherId" TEXT,
ADD COLUMN     "stage" "PlantStage" NOT NULL DEFAULT 'SEED';

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Plant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
