/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { signIn, signOut } from '@/auth';
import { RoleModel, UserModel } from '@/prisma/zod';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { httpDelete, httpPost } from './http';

const loginSchema = z.object({
  identifier: z.string().min(2, {
    message: 'identifier must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
  redirectTo: z.string().optional(),
});

export async function authenticate(formData: z.infer<typeof loginSchema>) {
  formData.redirectTo = '/dashboard';
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  try {
    await httpPost('/auth/logout');
    await signOut();
  } catch (error) {
    console.error('Failed to sign out:', error);
  }
}

const editUserSchema = UserModel.partial({
  createdAt: true,
  id: true,
  lastLogin: true,
  password: true,
});

export async function editUser(
  id: string,
  user: z.infer<typeof editUserSchema>
) {
  return httpPost(`/users/${id}`, JSON.stringify(user));
}

export async function createUser(user: z.infer<typeof editUserSchema>) {
  return httpPost(`/users`, JSON.stringify(user));
}

const editRoleSchema = RoleModel.partial({
  id: true,
});

export async function editRole(
  id: string,
  role: z.infer<typeof editRoleSchema>
) {
  return httpPost(`/roles/${id}`, JSON.stringify(role));
}

export async function createRole(role: z.infer<typeof editRoleSchema>) {
  return httpPost(`/roles`, JSON.stringify(role));
}

export async function deleteRole(id: number) {
  return httpDelete(`/roles/${id}`);
}

export async function deleteUser(id: string) {
  return httpDelete(`/users/${id}`);
}

export async function redirectToRoles() {
  await new Promise<void>(() => {
    revalidatePath('/admin/roles');
    redirect('/admin/roles');
  });
}

export async function redirectToUsers() {
  await new Promise<void>(() => {
    revalidatePath('/admin/users');
    redirect('/admin/users');
  });
}
