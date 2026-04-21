import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/shared/theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Planora — Events',
  description: 'Discover, create, and manage events with Planora.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning is required by next-themes: the theme class is
  // applied by an inline script before React hydrates, which would otherwise
  // trip React's mismatch detection on <html>.
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-screen flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen flex-1 pt-24 md:pt-[5.75rem]">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
