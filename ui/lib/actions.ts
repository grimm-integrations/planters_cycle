'use server';

import { signIn } from '@/auth';
import { User } from '@prisma/client';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function authenticate(formData: FormData) {
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

export async function editUser(auth: string, id: string, user: User) {
  noStore();
  const jsonObject = JSON.stringify(user);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/byId/${id}`, {
      method: 'POST',
      headers: {
        Cookie: auth,
        'Content-Type': 'application/json',
      },
      body: jsonObject,
    });
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user');
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}
