/*
 * Copyright (c) Johannes Grimm 2024.
 */

import NextAuth, { type DefaultSession } from 'next-auth';
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

import type { User } from 'next-auth';
import type { Provider } from 'next-auth/providers';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    auth: string;
    id: string;
    name?: null | string;
    roles?: null | string[];
  }
}

declare module 'next-auth' {
  interface User {
    auth: string;
    displayName?: null | string;
    email?: null | string;
    id?: string;
    roles?: null | string[];
  }

  interface Session {
    user: {
      auth: string;
      id: string;
      name?: null | string;
      roles?: null | string[];
    } & DefaultSession['user'];
  }
}

const providers: Provider[] = [
  Credentials({
    authorize: async (credentials) => {
      const res = await fetch('http://127.0.0.1:8004/api/auth/login', {
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const user = (await res.json()) as User;
      const auth_token = res.headers.getSetCookie().find((a) => {
        return a.includes('plnt_auth');
      });
      if (auth_token == undefined) return null;
      user.auth = auth_token;
      user.auth = user.auth?.substring(0, user.auth?.indexOf(';') + 1);
      if (res.ok && user) {
        return user;
      }

      return null;
    },
    credentials: {
      identifier: {},
      password: {},
    },
    name: 'credentials',
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.name = user.displayName;
        token.id = user.id ?? '';
        token.roles = user.roles;
        token.auth = user.auth;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.roles = token.roles;
      session.user.auth = token.auth;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  // debug: true,
  providers,
});
