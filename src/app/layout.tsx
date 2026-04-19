import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
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
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="min-h-screen flex-1 pt-16">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
