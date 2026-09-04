'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Eye, Feather, MoonStar, RotateCcw, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TarotCard = { name: string; number: string; symbol: string; keywords: string[]; upright: string; reversed: string; guidance: string };
type DrawnCard = TarotCard & { reversed: boolean };

const deck: TarotCard[] = [
  { name: '愚者', number: '0', symbol: '✦', keywords: ['新旅程', '自由', '信任'], upright: '新的可能正向你展開。你不必看清每一步，先回應內心真實的好奇。', reversed: '先別急著跳躍。重新檢查風險，也看看猶豫是否只是害怕離開熟悉。', guidance: '今天，允許自己用初學者的眼光看待問題。' },
  { name: '魔術師', number: 'I', symbol: '∞', keywords: ['創造', '行動', '專注'], upright: '你需要的資源其實已在手中。把意圖說清楚，讓想法透過行動成形。', reversed: '力量有些分散。先停止同時推進太多事，找回真正想創造的核心。', guidance: '選一件最重要的小事，今天就讓它開始。' },
  { name: '女祭司', number: 'II', symbol: '☾', keywords: ['直覺', '靜心', '未知'], upright: '答案還不需要被說破。安靜下來，留意夢境、身體感受與反覆出現的念頭。', reversed: '外界聲音蓋過了直覺。你可能早已知道答案，只是不願承認。', guidance: '在做決定前，給自己十分鐘不被打擾的安靜。' },
  { name: '皇后', number: 'III', symbol: '❀', keywords: ['滋養', '豐盛', '感受'], upright: '讓事物自然生長。照顧好身體、關係與創意，豐盛會在被善待之處發生。', reversed: '你付出得太多，卻忘了接住自己。先補回能量，再談照顧他人。', guidance: '問自己：此刻什麼會讓我真正感到被滋養？' },
  { name: '皇帝', number: 'IV', symbol: '◇', keywords: ['秩序', '界線', '承擔'], upright: '清楚的規則會帶來安全感。現在適合定下界線、計畫與可執行的下一步。', reversed: '過度控制正在消耗你。試著分辨穩定的結構與僵硬的執著。', guidance: '建立一個能支持你，而不是困住你的界線。' },
  { name: '戀人', number: 'VI', symbol: '♡', keywords: ['選擇', '連結', '價值'], upright: '一個重要選擇正在靠近。讓決定與你的價值一致，而不只是迎合期待。', reversed: '關係或選擇中出現了不一致。誠實面對你真正想要的，才能重新靠近。', guidance: '選擇那個讓你更接近真實自己的方向。' },
  { name: '戰車', number: 'VII', symbol: '✧', keywords: ['意志', '前進', '掌舵'], upright: '方向已逐漸清楚。整合矛盾的力量，專注前行，你比想像中更有掌控力。', reversed: '速度太快或方向不一。暫停不是失敗，而是重新握穩韁繩。', guidance: '先決定目的地，再決定要多快抵達。' },
  { name: '力量', number: 'VIII', symbol: '♌', keywords: ['勇氣', '溫柔', '耐心'], upright: '真正的力量不靠壓制。以耐心靠近恐懼，你的溫柔足以馴服內在風暴。', reversed: '自我懷疑正在放大困難。把對別人的體諒，也留一份給自己。', guidance: '用你會安慰朋友的方式，對自己說一句話。' },
  { name: '隱者', number: 'IX', symbol: '✺', keywords: ['內省', '智慧', '獨處'], upright: '暫時離開喧鬧，答案會在獨處中浮現。你正在尋找屬於自己的光。', reversed: '獨處可能已變成隔絕。適時讓可信任的人知道你正在經歷什麼。', guidance: '關掉一個外界聲音，聽見自己的想法。' },
  { name: '命運之輪', number: 'X', symbol: '⊙', keywords: ['轉變', '時機', '循環'], upright: '局勢正在轉動。與其抓住舊狀態，不如辨認新循環帶來的入口。', reversed: '你可能感到事情失去控制。把注意力放回仍能選擇的部分。', guidance: '找出這次變化中，唯一能由你決定的行動。' },
  { name: '星星', number: 'XVII', symbol: '☆', keywords: ['希望', '療癒', '真誠'], upright: '一段療癒正在發生。保持真誠與希望，微小而持續的光會帶你向前。', reversed: '希望暫時被疲憊遮住。別要求自己立刻振作，先允許被支持。', guidance: '記下一件仍值得期待的小事。' },
  { name: '月亮', number: 'XVIII', symbol: '☽', keywords: ['潛意識', '迷霧', '感受'], upright: '並非所有事都如表面所見。穿過迷霧需要時間，先相信感受，再查證事實。', reversed: '迷霧正在散去。曾讓你焦慮的線索，開始呈現較清楚的輪廓。', guidance: '把「我害怕的」和「我確定的」分開寫下來。' },
  { name: '太陽', number: 'XIX', symbol: '☼', keywords: ['喜悅', '清晰', '生命力'], upright: '事情正走向明朗。放心展現自己，喜悅不是獎勵，而是前進的能量。', reversed: '光仍在，只是被期待遮住。放下「應該更好」，你會看見已有的成果。', guidance: '慶祝一個你尚未好好肯定的進展。' },
];

const positions = ['過去・你帶來的影響', '現在・此刻的課題', '未來・正在展開的方向'];
const pickCards = (count: number): DrawnCard[] => [...deck].sort(() => Math.random() - 0.5).slice(0, count).map((card) => ({ ...card, reversed: Math.random() > 0.72 }));

function CardBack({ index }: { index: number }) {
  return <div className="tarot-card card-back" style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}><div className="card-back-frame"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><MoonStar aria-hidden="true" /><span className="card-star star-a">✦</span><span className="card-star star-b">✧</span><span className="card-star star-c">·</span></div></div>;
}

function CardFace({ card, index }: { card: DrawnCard; index: number }) {
  return <article className="reading-card" style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}>
    <div className={`tarot-card card-face ${card.reversed ? 'is-reversed' : ''}`}><div className="card-face-frame"><span className="card-number">{card.number}</span><span className="card-symbol" aria-hidden="true">{card.symbol}</span><div className="card-horizon"><span /></div><span className="card-name">{card.name}</span></div></div>
    <div className="card-reading"><p className="position-label">{positions[index] ?? '你的訊息'}</p><div className="reading-title-row"><h3>{card.name}</h3><span className="orientation">{card.reversed ? '逆位' : '正位'}</span></div><div className="keywords">{card.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><p className="meaning">{card.reversed ? card.reversed : card.upright}</p><p className="guidance"><Feather aria-hidden="true" />{card.guidance}</p></div>
  </article>;
}

export default function Home() {
  const [spread, setSpread] = useState<1 | 3>(1);
  const [question, setQuestion] = useState('');
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const placeholderCards = useMemo(() => Array.from({ length: spread }), [spread]);

  function draw() { setIsShuffling(true); setDrawn([]); window.setTimeout(() => { setDrawn(pickCards(spread)); setIsShuffling(false); window.setTimeout(() => document.querySelector('#reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); }, 850); }
  function reset() { setDrawn([]); setQuestion(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return <main>
    <header className="site-header"><a href="#top" className="brand" aria-label="微光塔羅首頁"><span className="brand-mark"><MoonStar aria-hidden="true" /></span><span>微光塔羅</span></a><div className="header-note"><Sparkles aria-hidden="true" /> 給此刻的你，一點清晰</div></header>
    <section id="top" className="hero"><div className="ambient-glow glow-left" /><div className="ambient-glow glow-right" />
      <div className="hero-copy"><p className="eyebrow"><span /> LISTEN TO YOUR INNER VOICE</p><h1>讓牌，照見你<br />心裡已有的答案</h1><p className="hero-intro">想一個此刻最在意的問題。深呼吸，選擇牌陣，讓直覺為你翻開今天的訊息。</p>
        <div className="question-panel"><label htmlFor="question">你想問的是⋯⋯</label><textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：我該如何看待現在的這段關係？" maxLength={120} /><span className="character-count">{question.length} / 120</span></div>
        <div className="spread-picker" aria-label="選擇牌陣"><button className={spread === 1 ? 'active' : ''} aria-pressed={spread === 1} onClick={() => { setSpread(1); setDrawn([]); }}><span className="mini-card" /><span><b>單張指引</b><small>聚焦此刻的訊息</small></span></button><button className={spread === 3 ? 'active' : ''} aria-pressed={spread === 3} onClick={() => { setSpread(3); setDrawn([]); }}><span className="mini-spread"><i /><i /><i /></span><span><b>三張牌陣</b><small>過去・現在・未來</small></span></button></div>
        <Button className="draw-button" size="lg" onClick={draw} disabled={isShuffling}>{isShuffling ? '正在洗牌⋯' : spread === 1 ? '閉上眼，抽一張牌' : '閉上眼，抽三張牌'}{!isShuffling && <ArrowRight aria-hidden="true" />}</Button><p className="quiet-note"><Eye aria-hidden="true" /> 不必用力尋找答案，留意第一個浮現的感受</p>
      </div>
      <div className={`deck-stage ${isShuffling ? 'is-shuffling' : ''}`} aria-hidden="true"><div className="moon-disc"><span>☾</span></div><div className="deck-card deck-three" /><div className="deck-card deck-two" />{placeholderCards.slice(0, 1).map((_, index) => <CardBack key={index} index={index} />)}<div className="floating-symbol symbol-one">✦</div><div className="floating-symbol symbol-two">☼</div><div className="floating-symbol symbol-three">✧</div></div>
    </section>
    {drawn.length > 0 && <section id="reading" className="reading-section"><div className="section-heading"><p className="eyebrow"><span /> YOUR READING</p><h2>牌想告訴你的事</h2>{question && <blockquote>「{question}」</blockquote>}</div><div className={`reading-grid cards-${drawn.length}`}>{drawn.map((card, index) => <CardFace key={`${card.name}-${index}`} card={card} index={index} />)}</div><div className="closing-message"><BookOpen aria-hidden="true" /><div><strong>把解讀當成一面鏡子</strong><p>塔羅不是預言，而是陪你看見更多可能。留下有共鳴的部分，其餘的可以輕輕放下。</p></div></div><Button variant="outline" className="reset-button" onClick={reset}><RotateCcw aria-hidden="true" /> 再問一次</Button></section>}
    {drawn.length === 0 && <section className="ritual-section" aria-label="抽牌前的小儀式"><div className="ritual-line" /><p>深呼吸三次</p><span>·</span><p>把問題放在心中</p><span>·</span><p>相信第一份直覺</p><div className="ritual-line" /></section>}
    <footer><div className="footer-mark"><Sun aria-hidden="true" /></div><p>願你在每一次提問裡，都更靠近自己。</p><small>微光塔羅僅供自我探索與娛樂，不替代專業建議。</small></footer>
  </main>;
}
