/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { RoleModel } from '@/prisma/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { httpDelete, httpGet, httpPatch, httpPost } from '../http';

import type { Role } from '@prisma/client';
import type { z } from 'zod';

/**
 * Redirects to the roles page.
 * This function revalidates the path and then redirects to the '/admin/roles' route.
 * @returns A promise that resolves when the redirection is complete.
 */
export async function redirectToRoles() {
  await new Promise<void>(() => {
    revalidatePath('/admin/roles');
    redirect('/admin/roles');
  });
}

/**
 * Represents the schema for editing a role.
 */
const editRoleSchema = RoleModel.partial({
  id: true,
});

/**
 * Edits a role with the specified ID.
 *
 * @param id - The ID of the role to edit.
 * @param role - The updated role object.
 * @returns A promise that resolves to the result of the HTTP PATCH request.
 */
export async function editRole(
  id: string,
  role: z.infer<typeof editRoleSchema>
) {
  return httpPatch(`/roles/${id}`, { body: JSON.stringify(role) });
}

/**
 * Creates a new role.
 * @param role - The role object to be created.
 * @returns A Promise that resolves with the created role.
 */
export async function createRole(role: z.infer<typeof editRoleSchema>) {
  return httpPost(`/roles`, { body: JSON.stringify(role), responseCode: 201 });
}

/**
 * Deletes a role with the specified ID.
 * @param id - The ID of the role to delete.
 * @returns A promise that resolves when the role is successfully deleted.
 */
export async function deleteRole(id: number) {
  return httpDelete(`/roles/${id}`);
}

/**
 * Fetches roles based on the provided query.
 * @param query - The query string used to filter roles.
 * @returns A promise that resolves to an array of Role objects.
 */
export async function fetchRoles(query: string): Promise<Role[]> {
  return httpGet<Role[]>(`/roles?query=${query}`);
}

/**
 * Fetches a role by its ID.
 *
 * @param id - The ID of the role to fetch.
 * @returns A Promise that resolves to the fetched Role object.
 */
export async function fetchRole(id: string): Promise<Role> {
  return httpGet<Role>(`/roles/${id}`);
}
