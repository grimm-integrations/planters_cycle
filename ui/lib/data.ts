/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

import type { CompleteUser } from '@/prisma/zod';
import type { Role, User, UsersInRoles } from '@prisma/client';

export async function fetchProfile() {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  try {
    const data = await fetch('http://127.0.0.1:8004/api/auth/profile', {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'GET',
    });
    return data.json();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function fetchUsers(query: string): Promise<CompleteUser[]> {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users?query=${query}`, {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const users = data as CompleteUser[];
        return users;
      });
    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user pages');
  }
}

export async function fetchUser(
  id: string
): Promise<{ roles: UsersInRoles[] } & User> {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/${id}`, {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const user = data as { roles: UsersInRoles[] } & User;
        return user;
      });

    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function fetchRoles(query: string): Promise<Role[]> {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/roles?query=${query}`, {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const roles = data as Role[];
        return roles;
      });
    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch roles');
  }
}

export async function fetchRole(id: string): Promise<Role> {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/roles/${id}`, {
      headers: {
        Cookie: session.user.auth,
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const role = data as Role;
        return role;
      });

    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch role');
  }
}

export async function fetchTotalUserPages(query: string): Promise<number> {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(
      `http://127.0.0.1:8004/api/users/count?query=${query}`,
      {
        headers: {
          Cookie: session.user.auth,
        },
        method: 'POST',
      }
    );
    const nums = await data.text();
    const totalPages = Math.ceil(Number(nums) / 10);
    return totalPages;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user pages');
  }
}
