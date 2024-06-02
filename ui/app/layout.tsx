/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  description: 'The next generation of plant management software.',
  title: {
    default: 'Planters Cycle',
    template: '%s | Planters Cycle',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
