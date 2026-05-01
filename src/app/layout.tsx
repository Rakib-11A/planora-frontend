import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { Footer } from '@/components/layout/footer';
import { ApexNavbar } from '@/components/layout/apex-navbar';
import { ThemeProvider } from '@/components/shared/theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// Plus Jakarta Sans — display/heading face per Apex spec §3 (Major Third scale).
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Planora - Premium event operations',
  description: 'Launch conversion-ready event pages and manage attendee workflows with Planora.',
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-screen flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApexNavbar />
          <main className="min-h-screen flex-1 pt-24 md:pt-[5.75rem]">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
