// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/app/components/common/Header';
import Footer from '@/app/components/common/Footer';
import { LanguageProvider } from '@/app/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hitek Flycam - Dịch vụ Drone Chuyên nghiệp',
  description: 'Cung cấp giải pháp drone toàn diện',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}