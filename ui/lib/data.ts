import { unstable_noStore as noStore } from 'next/cache';
import { Role, User } from '@prisma/client';
import { auth } from '@/auth';

export async function fetchProfile() {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');


  try {
    const data = await fetch('http://127.0.0.1:8004/api/auth/profile', {
      method: 'GET',
      headers: {
        Cookie: session.user.auth,
      },
    });
    return data.json();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function fetchUsers(query: string): Promise<User[]> {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');


  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users?query=${query}`, {
      method: 'GET',
      headers: {
        Cookie: session.user.auth,
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let users = data as User[];
      return users;
    });
    return data;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user pages');
  }
}

export async function fetchUser(id: string): Promise<User> {
  noStore();

  const session = await auth();
  if (!session || !session.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/${id}`, {
      method: 'GET',
      headers: {
        Cookie: session.user.auth,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let user = data as User;
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
      method: 'GET',
      headers: {
        Cookie: session.user.auth,
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let roles = data as Role[];
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
      method: 'GET',
      headers: {
        Cookie: session.user.auth,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let role = data as Role;
        return role;
      });

    return data;
  }
  catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch role');
  }
}

export async function fetchTotalUserPages(query: string): Promise<number> {
  noStore();

  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/count?query=${query}`, {
      method: 'POST',
      headers: {
        Cookie: session.user.auth,
      },
    });
    const nums = await data.text();
    const totalPages = Math.ceil(Number(nums) / 10);
    return totalPages;
  }
  catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user pages');
  }
}
