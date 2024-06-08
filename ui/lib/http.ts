/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use server';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

const apiURL = 'http://127.0.0.1:8004/api';

/**
 * Makes an HTTP request with the specified request type, URL, and options.
 * @template T - The type of the response data.
 * @param requestType - The type of the HTTP request (e.g., 'GET', 'POST', etc.).
 * @param url - The URL to send the HTTP request to.
 * @param options - Optional parameters for the HTTP request.
 * @param options.body - The body of the request.
 * @param options.noAuth - Set to `true` to disable authentication for the request. Default is `false`.
 * @param options.noCache - Set to `true` to disable caching for the request. Default is `false`.
 * @param options.responseCode - The expected response code for the request. Default is `undefined`.
 * @returns A Promise that resolves to the response data of type T.
 * @throws An error if the request fails or if the user is not authenticated.
 */
async function base<T>(
  requestType: string,
  url: string,
  options?: {
    body?: BodyInit | null;
    noAuth?: boolean;
    noCache?: boolean;
    responseCode?: number;
  }
): Promise<T> {
  if (options?.noCache) noStore();
  const session = await auth();

  try {
    const headers: Record<string, string> = {};

    if (!options?.noAuth) {
      if (!session || !session?.user) throw new Error('Not authenticated');
      headers.Cookie = session.user.auth;
    }

    if (options?.body) {
      headers['Content-Type'] = 'application/json';
    }

    const data = await fetch(url, {
      body: options?.body,
      headers,
      method: requestType,
    });

    if (data.status != (options?.responseCode ?? 200))
      throw new Error('Failed to fetch');

    return data.json() as T;
  } catch (error) {
    console.error('Fetch ERROR:', error);
    throw new Error('Failed to fetch');
  }
}

/**
 * Performs an HTTP GET request.
 * @template T - The type of the response data.
 * @param url - The URL to send the GET request to.
 * @param options - Optional configuration options for the request.
 * @param options.noAuth - Set to `true` to disable authentication for the request. Default is `false`.
 * @param options.noCache - Set to `true` to disable caching for the request. Default is `false`.
 * @param options.responseCode - The expected response code for the request. Default is `undefined`.
 * @returns A Promise that resolves to the response data of type T.
 */
export async function httpGet<T>(
  url: string,
  options?: {
    noAuth?: boolean;
    noCache?: boolean;
    responseCode?: number;
  }
): Promise<T> {
  return base<T>(apiURL + url, 'GET', options);
}

/**
 * Sends an HTTP POST request to the specified URL.
 * @template T - The type of the response data.
 * @param url - The URL to send the request to.
 * @param options - Optional configuration options for the request.
 * @param options.body - The body of the request.
 * @param options.noAuth - Set to `true` to disable authentication for the request. Default is `false`.
 * @param options.noCache - Set to `true` to disable caching for the request. Default is `false`.
 * @param options.responseCode - The expected response code for the request. Default is `undefined`.
 * @returns A Promise that resolves to the response data of type T.
 */
export async function httpPost<T>(
  url: string,
  options?: {
    body?: BodyInit | null;
    noAuth?: boolean;
    noCache?: boolean;
    responseCode?: number;
  }
): Promise<T> {
  return base<T>('POST', apiURL + url, options);
}

/**
 * Sends an HTTP PATCH request to the specified URL.
 * @template T - The type of the response data.
 * @param url - The URL to send the request to.
 * @param options - Optional configuration options for the request.
 * @param options.body - The body of the request.
 * @param options.noAuth - Set to `true` to disable authentication for the request. Default is `false`.
 * @param options.noCache - Set to `true` to disable caching for the request. Default is `false`.
 * @param options.responseCode - The expected response code for the request. Default is `undefined`.
 * @returns A promise that resolves to the response data of type T.
 */
export async function httpPatch<T>(
  url: string,
  options?: {
    body?: BodyInit | null;
    noAuth?: boolean;
    noCache?: boolean;
    responseCode?: number;
  }
): Promise<T> {
  return base<T>('PATCH', apiURL + url, options);
}

/**
 * Sends an HTTP DELETE request to the specified URL.
 * @template T - The type of the response data.
 * @param url - The URL to send the request to.
 * @param options - Optional configuration options for the request.
 * @param options.noAuth - Set to `true` to disable authentication for the request. Default is `false`.
 * @param options.noCache - Set to `true` to disable caching for the request. Default is `false`.
 * @param options.responseCode - The expected response code for the request. Default is `undefined`.
 * @returns A promise that resolves to the response data of type `T`.
 */
export async function httpDelete<T>(
  url: string,
  options?: {
    noAuth?: boolean;
    noCache?: boolean;
    responseCode?: number;
  }
): Promise<T> {
  return base<T>('DELETE', apiURL + url, options);
}
