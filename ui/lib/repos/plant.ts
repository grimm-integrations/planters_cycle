/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { httpGet, httpPost } from '../http';

import type { CompletePlant, PlantModel } from '@/prisma/zod';
import type { z } from 'zod';

/**
 * Redirects to the plants dashboard.
 * This function revalidates the path and then redirects to the '/dashboard/plants' route.
 * @returns A promise that resolves when the redirection is complete.
 */
export async function redirectToPlants() {
  await new Promise<void>(() => {
    revalidatePath('/dashboard/plants');
    redirect('/dashboard/plants');
  });
}

/**
 * Fetches plants based on the provided query.
 * @param query - The search query for plants.
 * @returns A promise that resolves to an array of CompletePlant objects.
 */
export async function fetchPlants(query: string): Promise<CompletePlant[]> {
  return httpGet<CompletePlant[]>(`/plants?query=${query}`);
}

/**
 * Creates a new plant.
 * @param plant - The plant object to create.
 * @returns A Promise that resolves to the created plant.
 */
export async function createPlant(plant: z.infer<typeof PlantModel>) {
  return httpPost(`/plants`, {
    body: JSON.stringify(plant),
    responseCode: 201,
  });
}

/**
 * Generates a plant name based on the given genetic ID.
 * @param geneticId - The genetic ID used to generate the plant name.
 * @returns A promise that resolves to the generated plant name.
 */
export async function generatePlantName(geneticId: string) {
  return httpGet<string>(`/plants/generatePlantName/${geneticId}`);
}
