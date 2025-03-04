import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

import KakaoScript from './components/KakaoScript/KakaoScript';
import QueryProvider from './components/QueryProvider/QueryProvider';
import './globals.css';
import Toast from '@/components/Toast/Toast';
import ContextProviders from '@/contexts/ContextProviders';
import { getLocale, getMessages } from 'next-intl/server';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

export const metadata: Metadata = {
  title: 'OneTime',
  description: 'Find the perfect time easily and quickly',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ContextProviders>
              {children}
              <Toast />
            </ContextProviders>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
      <KakaoScript />
    </html>
  );
}
