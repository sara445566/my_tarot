import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://weiguang-tarot-reading.fskx2zqz67.chatgpt.site',
  ),
  title: '微光塔羅｜在星光中聆聽內在',
  description:
    '寫下你的問題，親手選牌，透過富有儀式感的偉特塔羅占卜聆聽內在指引。',
  openGraph: {
    title: '微光塔羅｜在星光中聆聽內在',
    description: '一場為你而展開的星夜塔羅儀式。',
    images: [{ url: '/og.png', width: 1680, height: 945, alt: '微光塔羅' }],
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '微光塔羅｜在星光中聆聽內在',
    description: '一場為你而展開的星夜塔羅儀式。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
