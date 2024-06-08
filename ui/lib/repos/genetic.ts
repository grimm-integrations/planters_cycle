/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { httpDelete, httpGet, httpPatch, httpPost } from '../http';

import type { GeneticModel } from '@/prisma/zod';
import type { Genetic } from '@prisma/client';
import type { z } from 'zod';

/**
 * Redirects to the genetics dashboard.
 * This function revalidates the path and then redirects to the genetics dashboard.
 * @returns A promise that resolves when the redirection is complete.
 */
export async function redirectToGenetics() {
  await new Promise<void>(() => {
    revalidatePath('/dashboard/genetics');
    redirect('/dashboard/genetics');
  });
}

/**
 * Creates a new genetic entry.
 * @param genetic - The genetic data to be created.
 * @returns A Promise that resolves to the response of the HTTP POST request.
 */
export async function createGenetic(genetic: z.infer<typeof GeneticModel>) {
  return httpPost(`/genetics`, {
    body: JSON.stringify(genetic),
    responseCode: 201,
  });
}

/**
 * Edits a genetic entry with the specified ID.
 * @param id - The ID of the genetic entry to edit.
 * @param genetic - The updated genetic data.
 * @returns A promise that resolves to the result of the HTTP PATCH request.
 */
export async function editGenetic(
  id: string,
  genetic: z.infer<typeof GeneticModel>
) {
  return httpPatch(`/genetics/${id}`, { body: JSON.stringify(genetic) });
}

/**
 * Deletes a genetic entry by its ID.
 * @param id - The ID of the genetic entry to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export async function deleteGenetic(id: string) {
  return httpDelete(`/genetics/${id}`);
}

/**
 * Fetches genetics data based on the provided query.
 * @param query - The query string used to search for genetics data.
 * @returns A promise that resolves to an array of Genetic objects.
 */
export async function fetchGenetics(query: string): Promise<Genetic[]> {
  return httpGet<Genetic[]>(`/genetics?query=${query}`);
}
