'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { positionLabels, tarotCards, type TarotCard } from './tarot-data';

type SpreadId = 'daily' | 'yesno' | 'three';
type TopicId = 'general' | 'love' | 'work';
type Stage = 'intro' | 'shuffle' | 'choose' | 'reading';
type Selection = { deckIndex: number; card: TarotCard; reversed: boolean };

const spreadOptions: { id: SpreadId; name: string; count: number; eyebrow: string; copy: string }[] = [
  { id: 'daily', name: '每日指引', count: 1, eyebrow: 'ONE CARD', copy: '聚焦今天最需要看見的提醒與行動。' },
  { id: 'yesno', name: '是非占卜', count: 1, eyebrow: 'YES / NO', copy: '給一個直接傾向，以及不能忽略的條件。' },
  { id: 'three', name: '經典三張', count: 3, eyebrow: 'THREE CARDS', copy: '根源、現況、走向；愛情與工作都由主題切換。' },
];

const topics: { id: TopicId; name: string; hint: string }[] = [
  { id: 'general', name: '綜合', hint: '整體局勢與下一步' },
  { id: 'love', name: '愛情關係', hint: '互動、需求與關係走向' },
  { id: 'work', name: '工作發展', hint: '職涯、合作與實際策略' },
];

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

function BackDesign({ small = false }: { small?: boolean }) {
  return (
    <span className={`card-back-art${small ? ' small' : ''}`} aria-hidden="true">
      <span className="back-corner top">✦</span><span className="back-orbit" />
      <span className="back-star">✧</span><span className="back-moon">☾</span>
      <span className="back-corner bottom">✦</span>
    </span>
  );
}

function CardFace({ card, reversed, revealed = true }: { card: TarotCard; reversed: boolean; revealed?: boolean }) {
  return (
    <div className={`tarot-card ${revealed ? 'is-revealed' : ''} ${reversed ? 'is-reversed' : ''}`}>
      <div className="tarot-card-inner">
        <div className="tarot-card-back"><BackDesign /></div>
        <div className="tarot-card-front">
          <Image src={card.image} alt={`${card.name}原創牌面`} fill sizes="(max-width: 600px) 30vw, 260px" />
          <div className="card-title"><span>{card.number}</span><strong>{card.name}</strong><small>{card.en}</small></div>
        </div>
      </div>
    </div>
  );
}

export default function TarotPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [spread, setSpread] = useState<SpreadId>('three');
  const [topic, setTopic] = useState<TopicId>('general');
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<TarotCard[]>(() => tarotCards);
  const [selected, setSelected] = useState<Selection[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);

  const currentSpread = spreadOptions.find((item) => item.id === spread)!;
  const selectedIndexes = useMemo(() => new Set(selected.map((item) => item.deckIndex)), [selected]);
  const topicName = topics.find((item) => item.id === topic)?.name ?? '綜合';

  const startShuffle = () => {
    setStage('shuffle'); setSelected([]); setRevealed([]); setShuffleKey((value) => value + 1);
    window.setTimeout(() => { setDeck(shuffle(tarotCards)); setStage('choose'); }, 1150);
  };
  const pick = (card: TarotCard, deckIndex: number) => {
    if (selectedIndexes.has(deckIndex) || selected.length >= currentSpread.count) return;
    setSelected((items) => [...items, { card, deckIndex, reversed: Math.random() < 0.32 }]);
  };
  const unpick = (deckIndex: number) => setSelected((items) => items.filter((item) => item.deckIndex !== deckIndex));
  const confirm = () => {
    if (selected.length !== currentSpread.count) return;
    setRevealed(selected.map(() => false)); setStage('reading'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const revealCard = (index: number) => setRevealed((items) => items.map((value, i) => (i === index ? true : value)));
  const revealAll = () => setRevealed(selected.map(() => true));
  const reset = () => {
    setStage('intro'); setSelected([]); setRevealed([]); setDeck(tarotCards); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const allRevealed = revealed.length > 0 && revealed.every(Boolean);
  const uprightCount = selected.filter((item) => !item.reversed).length;
  const yesNo = uprightCount > selected.length / 2 ? '偏向「是」' : '偏向「否／時機未到」';

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={reset} aria-label="回到首頁"><span className="brand-mark">✦</span><span><strong>微光塔羅</strong><small>LUMEN TAROT</small></span></button>
        <span className="deck-count">78 張原創 Rider–Waite 象徵牌組</span>
      </header>

      {stage === 'intro' && <>
        <section className="hero">
          <div className="hero-copy"><p className="kicker">A QUIET PLACE FOR CLEAR ANSWERS</p><h1>讓牌替你照亮<br /><em>真正的問題</em></h1><p className="hero-lead">不是預言一個不能改變的未來，而是看清你正在走的路、忽略的訊號，以及現在能做的選擇。</p><a className="primary-link" href="#reading-room">開始占卜 <span>→</span></a></div>
          <div className="hero-cards" aria-hidden="true"><div className="hero-card left"><CardFace card={tarotCards[17]} reversed={false} /></div><div className="hero-card center"><CardFace card={tarotCards[2]} reversed={false} /></div><div className="hero-card right"><CardFace card={tarotCards[18]} reversed={false} /></div><span className="orbit orbit-one" /><span className="orbit orbit-two" /></div>
        </section>
        <section className="reading-room" id="reading-room">
          <div className="section-heading"><p className="kicker">CHOOSE YOUR SPREAD</p><h2>今天，想看清哪件事？</h2><p>牌陣只保留真正有差異的三種。愛情、工作與綜合問題，都使用清楚有效的經典三張。</p></div>
          <div className="spread-grid">{spreadOptions.map((item) => <button key={item.id} className={`spread-option ${spread === item.id ? 'active' : ''}`} onClick={() => setSpread(item.id)}><span className="spread-check">{spread === item.id ? '✓' : ''}</span><small>{item.eyebrow}</small><div className={`mini-spread count-${item.count}`}>{Array.from({ length: item.count }).map((_, index) => <span key={index}><BackDesign small /></span>)}</div><strong>{item.name}</strong><p>{item.copy}</p></button>)}</div>
          {spread === 'three' && <div className="topic-block"><span>解讀主題</span><div className="topic-tabs">{topics.map((item) => <button key={item.id} className={topic === item.id ? 'active' : ''} onClick={() => setTopic(item.id)}><strong>{item.name}</strong><small>{item.hint}</small></button>)}</div></div>}
          <label className="question-box"><span>你的問題 <small>選填，但越具體越有幫助</small></span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={160} placeholder="例如：我該如何改善目前的關係互動？" /><small>{question.length} / 160</small></label>
          <button className="ritual-button" onClick={startShuffle}><span>✦</span> 洗牌，進入選牌</button>
        </section>
      </>}

      {stage === 'shuffle' && <section className="ritual-stage shuffle-stage" key={shuffleKey}><p className="kicker">SHUFFLING THE DECK</p><h1>把問題放在心裡</h1><p>不需要拖曳。牌正在重新排列，稍後直接點選有感覺的位置。</p><div className="shuffle-stack" aria-label="洗牌中">{Array.from({ length: 7 }).map((_, index) => <div className="shuffle-card" key={index}><BackDesign /></div>)}</div><div className="soft-loader"><span /></div></section>}

      {stage === 'choose' && <section className="choose-stage">
        <div className="stage-heading"><p className="kicker">LISTEN TO YOUR FIRST INSTINCT</p><h1>憑直覺，選出 {currentSpread.count} 張牌</h1><p>點選你真正有感覺的位置。選中的牌會離開牌列並移到上方；確認前都能放回原位。</p></div>
        <div className="selection-table">
        <div className="selection-tray">{Array.from({ length: currentSpread.count }).map((_, index) => { const item = selected[index]; return <div className="tray-slot" key={index}><span className="slot-label">{positionLabels[currentSpread.count][index]}</span>{item ? <button className="picked-card" onClick={() => unpick(item.deckIndex)} aria-label={`放回第 ${item.deckIndex + 1} 個位置的牌`}><BackDesign /><span className="remove-hint">點擊放回</span></button> : <div className="empty-card"><span>{index + 1}</span></div>}</div>; })}</div>
        <div className="selection-status"><span>{selected.length}</span> / {currentSpread.count} 張已選</div>
        <div className="deck-field" aria-label="78 張牌，分成兩排重疊排列，點擊選牌">{deck.map((card, index) => selectedIndexes.has(index) ? <div className="deck-hole" style={{ '--deck-index': index, '--deck-row': Math.floor(index / 39), '--deck-column': index % 39 } as CSSProperties} key={card.id}><span>{index + 1}</span></div> : <button className="deck-card" style={{ '--deck-index': index, '--deck-row': Math.floor(index / 39), '--deck-column': index % 39 } as CSSProperties} key={card.id} onClick={() => pick(card, index)} aria-label={`選擇第 ${index + 1} 個位置`}><BackDesign small /></button>)}</div>
        </div>
        <div className="sticky-confirm"><button className="secondary-button" onClick={startShuffle}>重新洗牌</button><button className="ritual-button" disabled={selected.length !== currentSpread.count} onClick={confirm}>確認選牌 <span>→</span></button></div>
      </section>}

      {stage === 'reading' && <section className="reading-stage">
        <div className="stage-heading"><p className="kicker">YOUR READING · {topicName.toUpperCase()}</p><h1>{question.trim() || `${currentSpread.name}的訊息`}</h1><p>依序翻開每一張牌。正逆位已在選牌時決定，不會因翻牌動作改變。</p></div>
        <div className={`reveal-grid cards-${selected.length}`}>{selected.map((item, index) => <div className="reveal-item" key={item.card.id}><span>{positionLabels[currentSpread.count][index]}</span><button onClick={() => revealCard(index)} disabled={revealed[index]} aria-label={`翻開${positionLabels[currentSpread.count][index]}`}><CardFace card={item.card} reversed={item.reversed} revealed={revealed[index]} />{!revealed[index] && <small>點擊翻牌</small>}</button>{revealed[index] && <p>{item.card.name} · {item.reversed ? '逆位' : '正位'}</p>}</div>)}</div>
        {!allRevealed && <button className="secondary-button reveal-all" onClick={revealAll}>一次翻開全部</button>}
        {allRevealed && <div className="interpretation">
          {spread === 'yesno' && <div className="verdict"><small>牌面傾向</small><strong>{yesNo}</strong><p>這不是無條件答案；真正關鍵是下方牌義指出的條件與行動。</p></div>}
          <div className="reading-cards-copy">{selected.map((item, index) => <article key={item.card.id}><header><span>0{index + 1}</span><div><small>{positionLabels[currentSpread.count][index]}</small><h2>{item.card.name}・{item.reversed ? '逆位' : '正位'}</h2></div></header><div className="keyword-row">{item.card.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><h3>這張牌直說</h3><p>{item.reversed ? item.card.reversed : item.card.upright}</p><h3>你現在可以做</h3><p>{item.card.action}</p></article>)}</div>
          {selected.length === 3 && <article className="synthesis"><p className="kicker">THE CARDS TOGETHER</p><h2>三張牌放在一起，訊息很清楚</h2><p><strong>{selected[0].card.name}</strong>指出事情並非突然發生，它源自「{selected[0].card.keywords[0]}」這條線；<strong>{selected[1].card.name}</strong>顯示你現在最需要處理的是「{selected[1].card.keywords[1]}」；而<strong>{selected[2].card.name}</strong>把走向帶往「{selected[2].card.keywords[0]}」。</p><p>{topic === 'love' ? '關係不能只靠猜測維持。把需求、界線和能承擔的承諾說清楚，對方的實際回應就是答案。' : topic === 'work' ? '別只用忙碌證明努力。先確認真正影響成果的環節，再把時間與資源集中到那裡。' : '這組牌不要求你一次解決全部，而是停止迴避最核心的選擇，讓下一步變得具體。'}</p><div className="action-box"><span>你的第一步</span><strong>{selected[1].card.action}</strong></div></article>}
          <div className="reading-actions"><button className="ritual-button" onClick={reset}>開始新的占卜</button><button className="secondary-button" onClick={() => window.print()}>保存這次解讀</button></div>
        </div>}
      </section>}
      <footer><span>✦</span><p>塔羅提供的是觀點，不替你做決定。重要的醫療、法律與財務問題，請尋求合格專業協助。</p></footer>
    </main>
  );
}
