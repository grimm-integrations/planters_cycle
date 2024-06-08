/*
  Warnings:

  - The values [SEED] on the enum `PlantStage` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Genetic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlantStage_new" AS ENUM ('SEEDLING', 'VEGETATIVE', 'FLOWERING', 'HARVEST', 'DRIED', 'CURED', 'PACKAGED', 'SOLD', 'DESTROYED');
ALTER TABLE "Plant" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "Plant" ALTER COLUMN "stage" TYPE "PlantStage_new" USING ("stage"::text::"PlantStage_new");
ALTER TYPE "PlantStage" RENAME TO "PlantStage_old";
ALTER TYPE "PlantStage_new" RENAME TO "PlantStage";
DROP TYPE "PlantStage_old";
ALTER TABLE "Plant" ALTER COLUMN "stage" SET DEFAULT 'SEEDLING';
COMMIT;

-- AlterTable
ALTER TABLE "Plant" ALTER COLUMN "stage" SET DEFAULT 'SEEDLING';

-- CreateIndex
CREATE UNIQUE INDEX "Genetic_name_key" ON "Genetic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_name_key" ON "Plant"("name");
