import NextAuth, { type DefaultSession } from 'next-auth';
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from 'next-auth/jwt';
import { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    name?: string | null;
    roles?: string[] | null;
    auth: string;
  }
}

declare module 'next-auth' {
  interface User {
    id?: string;
    displayName?: string | null;
    email?: string | null;
    auth: string;
    roles?: string[] | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      roles?: string[] | null;
      auth: string;
    } & DefaultSession['user'];
  }
}

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      identifier: {},
      password: {},
    },
    authorize: async (credentials) => {
      const res = await fetch('http://127.0.0.1:8004/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' },
      });
      const user = await res.json();
      user.auth = res.headers.getSetCookie().find((a) => {
        return a.includes('plnt_auth');
      });
      user.auth = user.auth?.substring(0, user.auth?.indexOf(';') + 1);
      if (res.ok && user) {
        return user;
      }

      return null;
    },
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: true,
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.name = user.displayName;
        token.id = user.id;
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
  },
  pages: {
    signIn: '/login',
  },
});
