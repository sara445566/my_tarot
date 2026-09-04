import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://weiguang-tarot-reading.fskx2zqz67.chatgpt.site'),
  title: '微光塔羅｜聽見你心裡的答案',
  description: '在安靜的片刻裡，抽一張屬於你的塔羅牌。單張指引與三張牌陣，陪你看見此刻需要的訊息。',
  openGraph: {
    title: '微光塔羅｜聽見你心裡的答案',
    description: '單張指引與三張牌陣，陪你看見此刻需要的訊息。',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: '微光塔羅' }],
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '微光塔羅｜聽見你心裡的答案',
    description: '單張指引與三張牌陣，陪你看見此刻需要的訊息。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
