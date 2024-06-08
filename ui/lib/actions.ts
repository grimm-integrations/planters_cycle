/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { httpPost } from './http';

/**
 * Schema for the login data.
 */
const loginSchema = z.object({
  identifier: z.string().min(2, {
    message: 'Identifier must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
  redirectTo: z.string().optional(),
});

/**
 * Performs a login action using the provided form data.
 * @param formData - The form data for the login action.
 * @returns A promise that resolves to a string indicating the result of the login action.
 * @throws Any error that occurs during the login action.
 */
export async function loginAction(formData: z.infer<typeof loginSchema>) {
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

/**
 * Logs out the user by sending a POST request to '/auth/logout' and signing out.
 * @throws {Error} If there is an error during the logout process.
 */
export async function logoutAction() {
  try {
    await httpPost('/auth/logout');
    await signOut();
  } catch (error) {
    console.error('Failed to sign out:', error);
  }
}
