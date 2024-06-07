/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import type { CompletePlant, PlantModel } from '@/prisma/zod';
import type { z } from 'zod';

export async function redirectToPlants() {
  await new Promise<void>(() => {
    revalidatePath('/dashboard/plants');
    redirect('/dashboard/plants');
  });
}

export async function fetchPlants(query: string): Promise<CompletePlant[]> {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(
      `http://127.0.0.1:8004/api/plants?query=${query}`,
      {
        headers: {
          Cookie: session.user.auth,
        },
        method: 'GET',
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const plants = data as CompletePlant[];
        return plants;
      });
    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch plants');
  }
}

export async function createPlant(plant: z.infer<typeof PlantModel>) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(plant, null, 2);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/plants`, {
      body: jsonObject,
      headers: {
        'Content-Type': 'application/json',
        Cookie: session.user.auth,
      },
      method: 'POST',
    });
    if (data.status != 201) throw new Error('Failed to create plant');
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to create plant');
  }
}

export async function generatePlantName(geneticId: string) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(
      `http://127.0.0.1:8004/api/plants/generatePlantName/${geneticId}`,
      {
        headers: {
          Cookie: session.user.auth,
        },
        method: 'GET',
      }
    );
    if (data.status != 200) throw new Error('Failed to generate plant name');
    return data.text();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to genetate plant name');
  }
}
