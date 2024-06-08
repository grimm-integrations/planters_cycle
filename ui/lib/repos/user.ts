/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { UserModel } from '@/prisma/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { httpDelete, httpGet, httpPatch, httpPost } from '../http';

import type { CompleteUser } from '@/prisma/zod';
import type { z } from 'zod';

/**
 * Redirects to the users page in the admin section.
 * This function revalidates the path and then performs the redirect.
 */
export async function redirectToUsers() {
  await new Promise<void>(() => {
    revalidatePath('/admin/users');
    redirect('/admin/users');
  });
}

/**
 * Represents the schema for editing a user.
 */
const editUserSchema = UserModel.partial({
  createdAt: true,
  id: true,
  lastLogin: true,
  password: true,
});

/**
 * Edits a user with the specified ID.
 *
 * @param id - The ID of the user to edit.
 * @param user - The updated user data.
 * @returns A Promise that resolves to the result of the HTTP PATCH request.
 */
export async function editUser(
  id: string,
  user: z.infer<typeof editUserSchema>
) {
  return httpPatch(`/users/${id}`, { body: JSON.stringify(user) });
}

/**
 * Creates a new user.
 * @param user - The user object to be created.
 * @returns A promise that resolves to the created user.
 */
export async function createUser(user: z.infer<typeof editUserSchema>) {
  return httpPost(`/users`, { body: JSON.stringify(user), responseCode: 201 });
}

/**
 * Deletes a user with the specified ID.
 * @param id - The ID of the user to delete.
 * @returns A promise that resolves when the user is successfully deleted.
 */
export async function deleteUser(id: string) {
  return httpDelete(`/users/${id}`);
}

/**
 * Fetches users based on the provided query.
 * @param query - The search query for filtering users.
 * @returns A promise that resolves to an array of CompleteUser objects.
 */
export async function fetchUsers(query: string): Promise<CompleteUser[]> {
  return httpGet<CompleteUser[]>(`/users?query=${query}`);
}

/**
 * Fetches a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns A Promise that resolves to the complete user object.
 */
export async function fetchUser(id: string): Promise<CompleteUser> {
  return httpGet<CompleteUser>(`/users/${id}`);
}
