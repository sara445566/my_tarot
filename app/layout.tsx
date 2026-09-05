import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '微光塔羅｜78 張原創塔羅占卜',
  description: '以原創 Rider–Waite 象徵牌組，進行每日指引、是非占卜與經典三張牌解讀。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
