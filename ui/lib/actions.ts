'use server';

import { auth, signIn } from '@/auth';
import { Role, User } from '@prisma/client';
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

export async function editUser(id: string, user: User) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(user);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/${id}`, {
      method: 'POST',
      headers: {
        Cookie: session.user.auth,
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

export async function createUser(user: User) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(user);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users`, {
      method: 'POST',
      headers: {
        Cookie: session.user.auth,
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

export async function editRole(id: string, role: Role) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(role);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/roles/${id}`, {
      method: 'POST',
      headers: {
        Cookie: session.user.auth,
        'Content-Type': 'application/json',
      },
      body: jsonObject,
    });
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to edit role');
  }

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}

export async function createRole(role: Role) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  const jsonObject = JSON.stringify(role);
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/roles`, {
      method: 'POST',
      headers: {
        Cookie: session.user.auth,
        'Content-Type': 'application/json',
      },
      body: jsonObject,
    });
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to create role');
  }

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}

export async function deleteRole(id: number) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/roles/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: session.user.auth,
      },
    });
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to delete role');
  }

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}

export async function deleteUser(id: string) {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: session.user.auth,
      },
    });
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to delete user');
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}
