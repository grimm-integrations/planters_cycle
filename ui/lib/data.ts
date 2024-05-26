import { unstable_noStore as noStore } from 'next/cache';
import { User } from '@prisma/client'

export async function fetchProfile(auth: string) {
  noStore();
  try {
    const data = await fetch('http://127.0.0.1:8004/api/auth/profile', {
      method: 'GET',
      headers: {
        Cookie: auth,
      },
    });
    return data.json();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function fetchUsers(auth: string, query: string) {
  noStore();
  try {
    const data = await fetch('http://127.0.0.1:8004/api/users/list/', {
      method: 'GET',
      headers: {
        Cookie: auth,
      },
    });
    return data.json();
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user pages');
  }
}

export async function fetchUser(auth: string, id: string): Promise<User> {
  noStore();
  try {
    const data = await fetch(`http://127.0.0.1:8004/api/users/byId/${id}`, {
      method: 'GET',
      headers: {
        Cookie: auth,
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
  }
  catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch user');
  }
}

// export async function editUser(auth: string, user: )