/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';


const apiURL = 'http://127.0.0.1:8004/api';

async function base<T>(
  requestType: string,
  url: string,
  responseCode = 200,
  noCache?: boolean,
  noAuth?: boolean,
  body?: BodyInit | null
): Promise<T> {
  if (noCache) noStore();
  const session = await auth();

  try {
    const headers: Record<string, string> = {};

    if (!noAuth) {
      if (!session || !session?.user) throw new Error('Not authenticated');
      headers.Cookie = session.user.auth;
    }

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const data = await fetch(url, {
      body,
      headers,
      method: requestType,
    });

    if (data.status != responseCode) throw new Error('Failed to fetch');

    return data.json() as T;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch');
  }
}

export async function httpGet<T>(
  url: string,
  noCache?: boolean,
  noAuth?: boolean,
  responseCode = 200
): Promise<T> {
  return base<T>('GET', apiURL + url, responseCode, noCache, noAuth);
}

export async function httpPost<T>(
  url: string,
  body?: BodyInit | null,
  noCache?: boolean,
  noAuth?: boolean,
  responseCode = 200
): Promise<T> {
  return base<T>('POST', apiURL + url, responseCode, noCache, noAuth, body);
}

export async function httpDelete<T>(
  url: string,
  noCache?: boolean,
  noAuth?: boolean,
  responseCode = 200
): Promise<T> {
  return base<T>('DELETE', apiURL + url, responseCode, noCache, noAuth);
}

export async function httpPatch<T>(
  url: string,
  body?: BodyInit | null,
  noCache?: boolean,
  noAuth?: boolean,
  responseCode = 200
): Promise<T> {
  return base<T>('PATCH', apiURL + url, responseCode, noCache, noAuth, body);
}
