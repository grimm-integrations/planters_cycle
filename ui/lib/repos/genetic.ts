/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import type { GeneticModel } from '@/prisma/zod';
import type { z } from 'zod';

export async function redirectToGenetics() {
  await new Promise<void>(() => {
    revalidatePath('/dashboard/genetics');
    redirect('/dashboard/genetics');
  });
}

export async function createGenetic(genetic: z.infer<typeof GeneticModel>) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(genetic, null, 2);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/genetics`, {
      body: jsonObject,
      headers: {
        'Content-Type': 'application/json',
        Cookie: session.user.auth,
      },
      method: 'POST',
    });
    if (data.status != 201) throw new Error('Failed to create genetic');
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to create genetic');
  }
}

export async function editGenetic(
  id: string,
  genetic: z.infer<typeof GeneticModel>
) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(genetic);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/genetics/${id}`, {
      body: jsonObject,
      headers: {
        'Content-Type': 'application/json',
        Cookie: session.user.auth,
      },
      method: 'PATCH',
    });
    if (data.status != 200) throw new Error('Failed to edit Genetic');
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch genetic');
  }
}

export async function checkDuplicateName(name: string) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(
      `http://127.0.0.1:8004/api/genetics/checkname/${name}`,
      {
        headers: {
          Cookie: session.user.auth,
        },
        method: 'POST',
      }
    );
    if (data.status != 200) throw new Error('Failed to check name');
    return data.text();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to check name');
  }
}

export async function deleteGenetic(id: string) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/genetics/${id}`, {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'DELETE',
    });
    if (data.status != 200) throw new Error('Failed to delete genetic');
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to delete genetic');
  }
}
