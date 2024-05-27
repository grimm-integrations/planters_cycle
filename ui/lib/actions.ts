'use server';

import { auth, signIn } from '@/auth';
import { RoleModel } from '@/prisma/zod/role';
import { UserModel } from '@/prisma/zod/user';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';


const loginSchema = z.object({
  identifier: z.string().min(2, {
    message: 'identifier must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
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

const editUserSchema = UserModel.partial({
  id: true,
  createdAt: true,
  lastLogin: true,
  password: true,
});

export async function editUser(id: string, user: z.infer<typeof editUserSchema>) {
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

export async function createUser(user: z.infer<typeof editUserSchema>) {
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

const editRoleSchema = RoleModel.partial({
  id: true,
});

export async function editRole(id: string, role: z.infer<typeof editRoleSchema>) {
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
}

export async function createRole(role: z.infer<typeof editRoleSchema>) {
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
}

export async function redirectToRoles() {
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
