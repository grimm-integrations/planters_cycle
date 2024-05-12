import { unstable_noStore as noStore } from 'next/cache';

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
