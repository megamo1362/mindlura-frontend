import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/app/providers';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IRFX | Trading Psychology Platform',
    template: '%s | IRFX',
  },
  description: 'Premium trading psychology and performance intelligence platform',
  keywords: ['trading', 'psychology', 'performance', 'MT5', 'forex', 'coaching'],
  authors: [{ name: 'IRFX' }],
  creator: 'IRFX',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020510',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="circuit-bg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
