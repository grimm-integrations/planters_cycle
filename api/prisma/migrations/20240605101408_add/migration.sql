/*
  Warnings:

  - Added the required column `flower_days` to the `Genetic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genetic" ADD COLUMN     "flower_days" INTEGER NOT NULL;
