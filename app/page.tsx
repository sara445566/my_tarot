'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  MoonStar,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Arcana = {
  number: string;
  name: string;
  en: string;
  keywords: string[];
  light: string;
  shadow: string;
  guidance: string;
  x: number;
  y: number;
};
type Drawn = Arcana & { reversed: boolean };
type SpreadId = 'daily' | 'love' | 'career' | 'yesno' | 'three';
type SavedReading = {
  date: string;
  question: string;
  spread: string;
  cards: { name: string; reversed: boolean }[];
};

const arcana: Arcana[] = [
  {
    number: '0',
    name: '愚者',
    en: 'THE FOOL',
    keywords: ['開始', '自由', '信任'],
    light:
      '新的道路正在你面前展開。此刻不需要掌握所有答案，只需要相信第一步會帶來下一個線索。',
    shadow: '對未知的恐懼讓你停在原地，或是一股衝動正催促你忽略必要的準備。',
    guidance: '保留天真，但別遺失判斷；帶著輕盈的心，先踏出一個可回頭的小步。',
    x: 337,
    y: 2,
  },
  {
    number: 'I',
    name: '魔術師',
    en: 'THE MAGICIAN',
    keywords: ['意志', '創造', '行動'],
    light:
      '你已擁有把想法化為現實的資源，關鍵是集中意志，讓手中的工具朝同一方向工作。',
    shadow: '能量被分散，或你正在用技巧掩飾真正的不確定。',
    guidance: '列出你已經擁有的三項資源，今天就讓其中一項開始運作。',
    x: 1,
    y: 208,
  },
  {
    number: 'II',
    name: '女祭司',
    en: 'THE HIGH PRIESTESS',
    keywords: ['直覺', '靜默', '奧祕'],
    light:
      '答案尚未適合被說破。放慢速度，細微的感受與夢境正透露比表象更深的訊息。',
    shadow: '你可能忽略直覺，或把沉默誤認為逃避。',
    guidance: '在行動前留一晚給自己，不向外求證，只記錄身體最誠實的反應。',
    x: 111,
    y: 208,
  },
  {
    number: 'III',
    name: '皇后',
    en: 'THE EMPRESS',
    keywords: ['滋養', '豐盛', '感受'],
    light:
      '讓生命生長的力量正在靠近。照顧身體、關係與創意，成果會在被珍惜的地方成熟。',
    shadow: '過度付出耗盡了你，或舒適感正在延遲必要的決定。',
    guidance: '把自己也放進照顧名單，先補足能量，再決定要給出多少。',
    x: 222,
    y: 208,
  },
  {
    number: 'IV',
    name: '皇帝',
    en: 'THE EMPEROR',
    keywords: ['秩序', '界線', '責任'],
    light:
      '清楚的結構會給你自由。設定規則、界線與時間表，讓混亂重新有可依循的方向。',
    shadow: '控制欲或僵硬的標準，可能讓關係失去呼吸。',
    guidance: '建立一條真正保護你的界線，而不是用規則證明你是對的。',
    x: 333,
    y: 208,
  },
  {
    number: 'V',
    name: '教皇',
    en: 'THE HIEROPHANT',
    keywords: ['信念', '傳承', '學習'],
    light:
      '既有的智慧、導師或制度能為你提供穩定框架。先理解規則，再決定如何超越。',
    shadow: '盲從傳統，或為了反抗而拒絕所有可用的經驗。',
    guidance: '向一位值得信任的人請教，但把最後的選擇權留在自己手中。',
    x: 445,
    y: 208,
  },
  {
    number: 'VI',
    name: '戀人',
    en: 'THE LOVERS',
    keywords: ['選擇', '連結', '一致'],
    light:
      '真正的親密來自價值一致。這張牌邀請你誠實選擇，而不是只追逐一時的吸引。',
    shadow: '猶豫、依附或價值衝突，讓關係停留在表面的和諧。',
    guidance: '問自己：如果不害怕失去，我會做出什麼更誠實的選擇？',
    x: 557,
    y: 208,
  },
  {
    number: 'VII',
    name: '戰車',
    en: 'THE CHARIOT',
    keywords: ['前進', '掌控', '決心'],
    light:
      '方向已經出現。整合內在相反的力量，堅定前進，你比想像中更能駕馭局勢。',
    shadow: '急於證明自己，反而讓速度凌駕方向。',
    guidance: '先確認終點，再踩下油門；意志需要被方向引導。',
    x: 664,
    y: 208,
  },
  {
    number: 'VIII',
    name: '力量',
    en: 'STRENGTH',
    keywords: ['勇氣', '溫柔', '自持'],
    light:
      '你真正的力量不是壓制，而是溫柔而穩定地容納本能。耐心將比強硬走得更遠。',
    shadow: '自我懷疑或被壓抑的情緒正在消耗意志。',
    guidance: '不要與情緒搏鬥，先為它命名；被看見的感受才有機會安靜。',
    x: 1,
    y: 400,
  },
  {
    number: 'IX',
    name: '隱者',
    en: 'THE HERMIT',
    keywords: ['獨處', '尋索', '智慧'],
    light: '暫時退離喧囂不是孤立，而是為了聽見真正屬於你的聲音。',
    shadow: '孤獨感或過度分析，讓你與可用的支持斷開。',
    guidance: '給自己一段不被打擾的時間，然後帶著所得重新回到人群。',
    x: 111,
    y: 400,
  },
  {
    number: 'X',
    name: '命運之輪',
    en: 'WHEEL OF FORTUNE',
    keywords: ['轉機', '循環', '時機'],
    light: '局勢正在轉動。你不必控制每個變數，只需要辨認浪潮到來時該如何順勢。',
    shadow: '重複的模式正在提醒你：未被理解的課題會再次出現。',
    guidance: '分辨什麼能改變、什麼只能接受，把力氣放在前者。',
    x: 222,
    y: 400,
  },
  {
    number: 'XI',
    name: '正義',
    en: 'JUSTICE',
    keywords: ['真相', '平衡', '因果'],
    light: '坦誠面對事實，公平的結果來自清楚的選擇與承擔。',
    shadow: '偏見、逃避責任，或只看見對自己有利的證據。',
    guidance: '把感受與事實分開寫下，再做出你願意承擔後果的決定。',
    x: 333,
    y: 400,
  },
  {
    number: 'XII',
    name: '倒吊人',
    en: 'THE HANGED MAN',
    keywords: ['暫停', '換位', '放下'],
    light: '此刻的停滯並非浪費。換一個角度，原本無解的局面會顯露新的意義。',
    shadow: '無止境等待，或用犧牲感逃避主動選擇。',
    guidance: '放下一個「事情非得如此」的假設，看看還剩下哪些可能。',
    x: 445,
    y: 400,
  },
  {
    number: 'XIII',
    name: '死神',
    en: 'DEATH',
    keywords: ['結束', '蛻變', '更新'],
    light: '一個階段已走到盡頭。允許它離開，新的生命才有空間進入。',
    shadow: '抗拒改變使告別被拉長，過去仍佔據著現在。',
    guidance: '替結束舉行一個小小的告別，承認失去，也承認你已經不同。',
    x: 557,
    y: 400,
  },
  {
    number: 'XIV',
    name: '節制',
    en: 'TEMPERANCE',
    keywords: ['調和', '療癒', '耐心'],
    light:
      '看似相反的兩端可以被調和。穩定的小幅調整，比一次劇烈改變更接近答案。',
    shadow: '失衡、過量，或急著跳過需要時間發生的整合。',
    guidance: '今天少做一點極端的事，為自己找回可長久維持的節奏。',
    x: 664,
    y: 400,
  },
  {
    number: 'XV',
    name: '惡魔',
    en: 'THE DEVIL',
    keywords: ['束縛', '慾望', '覺察'],
    light: '看見束縛就是鬆綁的開始。你有能力重新選擇與慾望、權力或依賴的關係。',
    shadow: '你可能明知不適合，仍被短暫滿足或恐懼牽引。',
    guidance: '誠實說出這個模式給你的好處；理解交換條件，才能真正離開。',
    x: 1,
    y: 593,
  },
  {
    number: 'XVI',
    name: '高塔',
    en: 'THE TOWER',
    keywords: ['震盪', '揭露', '重建'],
    light: '不穩固的結構正在瓦解，真相雖猛烈，卻會替你清出更誠實的地基。',
    shadow: '害怕崩塌而緊抓舊局，或內在壓力已逼近臨界。',
    guidance: '先保護最重要的人與事；別急著重建，讓真相完整落地。',
    x: 111,
    y: 593,
  },
  {
    number: 'XVII',
    name: '星星',
    en: 'THE STAR',
    keywords: ['希望', '清澈', '復原'],
    light:
      '風暴後的天空重新清澈。你可以慢慢相信未來，也可以讓真實的自己被看見。',
    shadow: '失望讓你暫時看不見方向，但光並沒有消失。',
    guidance: '做一件能讓明天的你感謝今天的你的微小事情。',
    x: 222,
    y: 593,
  },
  {
    number: 'XVIII',
    name: '月亮',
    en: 'THE MOON',
    keywords: ['潛意識', '迷霧', '敏感'],
    light:
      '直覺正在說話，但恐懼也混在其中。此刻適合感受與觀察，不適合匆忙定論。',
    shadow: '焦慮、投射或未說出口的事，使現實看起來比它更危險。',
    guidance: '先等待更多資訊；在迷霧裡，慢一點本身就是智慧。',
    x: 333,
    y: 593,
  },
  {
    number: 'XIX',
    name: '太陽',
    en: 'THE SUN',
    keywords: ['喜悅', '成功', '坦率'],
    light: '光明、活力與清楚的肯定來到你身邊。允許自己享受成果，不必縮小快樂。',
    shadow: '過度樂觀或追求外在肯定，可能遮住仍需照顧的細節。',
    guidance: '把好消息說出口，也把你的光分享給一位重要的人。',
    x: 445,
    y: 593,
  },
  {
    number: 'XX',
    name: '審判',
    en: 'JUDGEMENT',
    keywords: ['覺醒', '召喚', '寬恕'],
    light: '過去的經驗正在匯聚成新的理解。聽見召喚，允許自己走向更大的版本。',
    shadow: '自我批判或對過去的執著，讓你遲遲無法回應改變。',
    guidance: '原諒當時只能那樣選擇的自己，然後用現在的智慧再選一次。',
    x: 557,
    y: 593,
  },
  {
    number: 'XXI',
    name: '世界',
    en: 'THE WORLD',
    keywords: ['完成', '整合', '圓滿'],
    light: '一段旅程完整收束。你已把沿途所學整合成新的自己，值得好好慶祝。',
    shadow: '差最後一步卻不敢完成，或完成後不知道該往哪裡去。',
    guidance: '為這一章寫下句點；結束不是空白，而是下一個圓的起點。',
    x: 664,
    y: 593,
  },
];

const spreads: {
  id: SpreadId;
  icon: string;
  title: string;
  note: string;
  count: number;
  positions: string[];
}[] = [
  {
    id: 'daily',
    icon: '☉',
    title: '每日一牌',
    note: '今日的核心指引',
    count: 1,
    positions: ['今日指引'],
  },
  {
    id: 'love',
    icon: '♡',
    title: '愛情關係',
    note: '你・對方・關係走向',
    count: 3,
    positions: ['你的心', '對方的能量', '關係的走向'],
  },
  {
    id: 'career',
    icon: '♄',
    title: '工作方向',
    note: '現況・阻礙・下一步',
    count: 3,
    positions: ['目前狀態', '需要跨越', '行動建議'],
  },
  {
    id: 'yesno',
    icon: '✦',
    title: '是非題',
    note: '一張牌給你清楚訊號',
    count: 1,
    positions: ['宇宙的回應'],
  },
  {
    id: 'three',
    icon: '☾',
    title: '經典三牌',
    note: '過去・現在・未來',
    count: 3,
    positions: ['過去留下的線索', '此刻的核心', '未來可能的方向'],
  },
];

function TarotArt({ card }: { card: Arcana }) {
  return (
    <div
      className="rws-art"
      style={{ '--crop-x': card.x, '--crop-y': card.y } as React.CSSProperties}
    >
      <Image src="/major-arcana.png" alt="" width={768} height={785} />
    </div>
  );
}

function CardBack({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`tarot-back ${selected ? 'is-selected' : ''}`}>
      <div className="back-frame">
        <span className="back-star">✦</span>
        <span className="back-moon">☾</span>
        <i className="back-orbit orbit-a" />
        <i className="back-orbit orbit-b" />
        <span className="back-sun">☉</span>
      </div>
    </div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [text]);
  return (
    <>
      {shown}
      <span className="typing-caret" aria-hidden="true" />
    </>
  );
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [spread, setSpread] = useState<SpreadId>('daily');
  const [phase, setPhase] = useState<'home' | 'ritual' | 'choose' | 'reading'>(
    'home',
  );
  const [drawn, setDrawn] = useState<Drawn[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('lumen-readings') || '[]');
    } catch {
      return [];
    }
  });
  const ritualRef = useRef<HTMLElement>(null);
  const activeSpread = spreads.find((item) => item.id === spread)!;
  const fan = useMemo(() => Array.from({ length: 11 }), []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        '--mouse-x',
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        '--mouse-y',
        `${event.clientY}px`,
      );
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  function enterRitual() {
    setPhase('ritual');
    window.setTimeout(
      () =>
        ritualRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        }),
      60,
    );
  }
  function finishShuffle() {
    setDragging(false);
    setDrag(0);
    setDrawn([]);
    setRevealed([]);
    setPhase('choose');
  }
  function chooseCard() {
    if (drawn.length >= activeSpread.count) return;
    const available = arcana.filter(
      (card) => !drawn.some((item) => item.number === card.number),
    );
    const card = available[Math.floor(Math.random() * available.length)];
    setDrawn((items) => [
      ...items,
      { ...card, reversed: Math.random() > 0.73 },
    ]);
  }
  function beginReading() {
    setPhase('reading');
    window.setTimeout(
      () =>
        ritualRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        }),
      40,
    );
  }
  function revealCard(index: number) {
    setRevealed((items) => (items.includes(index) ? items : [...items, index]));
  }
  function restart() {
    setPhase('ritual');
    setDrawn([]);
    setRevealed([]);
    setNotice('');
    ritualRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  function saveReading() {
    const saved: SavedReading[] = [...savedReadings];
    saved.unshift({
      date: new Date().toISOString(),
      question,
      spread: activeSpread.title,
      cards: drawn.map(({ name, reversed }) => ({ name, reversed })),
    });
    const next = saved.slice(0, 20);
    localStorage.setItem('lumen-readings', JSON.stringify(next));
    setSavedReadings(next);
    setNotice('這次啟示已收藏在你的裝置中');
    window.setTimeout(() => setNotice(''), 2600);
  }
  async function shareReading() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, '#0d1021');
    gradient.addColorStop(1, '#24213d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = '#d9a95f';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 970, 1240);
    ctx.fillStyle = '#f0d39a';
    ctx.textAlign = 'center';
    ctx.font = '28px serif';
    ctx.fillText('✦  微 光 塔 羅  ✦', 540, 135);
    ctx.fillStyle = '#f8edda';
    ctx.font = '54px serif';
    ctx.fillText(activeSpread.title, 540, 235);
    ctx.fillStyle = '#b9adbd';
    ctx.font = '28px sans-serif';
    ctx.fillText(question || '此刻，宇宙想讓我知道什麼？', 540, 305);
    drawn.forEach((card, index) => {
      const y = 440 + index * 245;
      ctx.fillStyle = '#f2d8d3';
      ctx.font = '48px serif';
      ctx.fillText(`${card.name} · ${card.reversed ? '逆位' : '正位'}`, 540, y);
      ctx.fillStyle = '#d9a95f';
      ctx.font = '24px sans-serif';
      ctx.fillText(card.keywords.join('　·　'), 540, y + 54);
    });
    ctx.fillStyle = '#8f98c7';
    ctx.font = '25px serif';
    ctx.fillText('答案一直都在，只是等待被看見。', 540, 1240);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    );
    if (!blob) return;
    const file = new File([blob], '微光塔羅.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] }))
      await navigator.share({ title: '我的微光塔羅占卜', files: [file] });
    else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(link.href);
      setNotice('分享圖片已下載');
      window.setTimeout(() => setNotice(''), 2600);
    }
  }

  return (
    <main className="site-shell">
      <div className="cursor-aurora" aria-hidden="true" />
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          onClick={() => setPhase('home')}
          aria-label="微光塔羅首頁"
        >
          <span className="brand-sigil">
            <MoonStar aria-hidden="true" />
          </span>
          <span>
            <b>微光塔羅</b>
            <small>LUMEN TAROT</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="header-whisper">
            <Sparkles aria-hidden="true" /> 今夜，讓星辰替你回答
          </span>
          <button
            className="collection-button"
            onClick={() => setHistoryOpen(true)}
            aria-label="打開星夜收藏匣"
          >
            <Bookmark aria-hidden="true" />
            <span>收藏匣</span>
            {savedReadings.length > 0 && <b>{savedReadings.length}</b>}
          </button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> A RITUAL FOR YOUR INNER VOICE
          </p>
          <h1>
            答案一直都在，
            <br />
            <em>只是等待被看見。</em>
          </h1>
          <p className="hero-intro">
            寫下此刻縈繞心頭的問題。深呼吸，讓牌面在星光之間為你展開一條通往內在的路。
          </p>
          <div className="intention-box">
            <label htmlFor="question">你的心中，正想詢問什麼？</label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={120}
              placeholder="例如：接下來的我，該將力量放在哪裡？"
            />
            <span>{question.length} / 120</span>
          </div>
          <Button className="begin-button" size="lg" onClick={enterRitual}>
            開始今晚的儀式 <ArrowRight aria-hidden="true" />
          </Button>
          <p className="privacy-note">✦ 你的問題只停留在這次占卜之中</p>
        </div>
        <div className="hero-visual" aria-label="五張漂浮在星空中的塔羅牌">
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <Image
            src="/tarot-hero.png"
            alt="午夜星空裡展開的原創塔羅牌陣"
            width={1536}
            height={1024}
            priority
          />
          <span className="float-rune rune-one">☾</span>
          <span className="float-rune rune-two">✦</span>
          <span className="float-rune rune-three">☉</span>
        </div>
      </section>
      <section className="promise-strip" aria-label="占卜流程">
        <span>01　寫下意念</span>
        <i>✦</i>
        <span>02　親手選牌</span>
        <i>✦</i>
        <span>03　聆聽啟示</span>
      </section>

      {phase !== 'home' && (
        <section ref={ritualRef} className="ritual-room">
          <div className="ritual-heading">
            <p className="eyebrow">
              <span /> CHOOSE YOUR RITUAL
            </p>
            <h2>
              {phase === 'ritual'
                ? '選擇今夜的牌陣'
                : phase === 'choose'
                  ? '讓直覺替你選牌'
                  : '你的星夜啟示'}
            </h2>
            <p>
              {phase === 'ritual'
                ? '每一種牌陣，都是靠近答案的不同路徑。'
                : phase === 'choose'
                  ? `請選出 ${activeSpread.count} 張呼喚你的牌。`
                  : '依序點擊牌面，讓訊息慢慢顯現。'}
            </p>
          </div>

          {phase === 'ritual' && (
            <>
              <div className="spread-menu">
                {spreads.map((item) => (
                  <button
                    key={item.id}
                    className={spread === item.id ? 'active' : ''}
                    onClick={() => setSpread(item.id)}
                  >
                    <span className="spread-icon">{item.icon}</span>
                    <span>
                      <b>{item.title}</b>
                      <small>{item.note}</small>
                    </span>
                    {spread === item.id && <Check aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <div className="shuffle-altar">
                <p>閉上眼睛，將問題默念三次</p>
                <div
                  className="shuffle-zone"
                  onPointerDown={(e) => {
                    setDragging(true);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!dragging) return;
                    setDrag((value) =>
                      Math.min(
                        110,
                        value + Math.abs(e.movementX) + Math.abs(e.movementY),
                      ),
                    );
                  }}
                  onPointerUp={() => {
                    if (drag > 72) finishShuffle();
                    else {
                      setDragging(false);
                      setDrag(0);
                    }
                  }}
                  style={
                    { '--shuffle-progress': `${drag}%` } as React.CSSProperties
                  }
                >
                  <div
                    className={
                      dragging ? 'shuffle-deck dragging' : 'shuffle-deck'
                    }
                  >
                    <CardBack />
                    <div />
                    <div />
                  </div>
                  <span>
                    {drag > 72 ? '鬆手，讓牌展開' : '按住牌組，左右拖曳洗牌'}
                  </span>
                  <i>
                    <b style={{ width: `${drag}%` }} />
                  </i>
                </div>
                <Button className="secondary-action" onClick={finishShuffle}>
                  或輕觸開始洗牌 <Sparkles aria-hidden="true" />
                </Button>
              </div>
            </>
          )}

          {phase === 'choose' && (
            <div className="choose-stage">
              <div className="selection-count">
                <span>{drawn.length}</span> / {activeSpread.count} 張已選
              </div>
              <div className="card-fan">
                {fan.map((_, index) => (
                  <button
                    key={index}
                    onClick={chooseCard}
                    disabled={drawn.length >= activeSpread.count}
                    style={{ '--fan-index': index } as React.CSSProperties}
                    aria-label={`選擇第 ${index + 1} 張牌`}
                  >
                    <CardBack selected={index < drawn.length} />
                  </button>
                ))}
              </div>
              <p className="choose-hint">
                不需要分析。第一張吸引目光的牌，就是它。
              </p>
              {drawn.length === activeSpread.count && (
                <Button
                  className="begin-button reveal-ready"
                  onClick={beginReading}
                >
                  帶我進入揭牌時刻 <ArrowRight aria-hidden="true" />
                </Button>
              )}
            </div>
          )}

          {phase === 'reading' && (
            <div className="reading-wrap">
              <div className={`drawn-grid count-${drawn.length}`}>
                {drawn.map((card, index) => {
                  const isOpen = revealed.includes(index);
                  return (
                    <article
                      className={`result-card ${isOpen ? 'revealed' : ''}`}
                      key={`${card.number}-${index}`}
                    >
                      <button
                        className="flip-card"
                        onClick={() => revealCard(index)}
                        aria-label={
                          isOpen
                            ? `${card.name}，${card.reversed ? '逆位' : '正位'}`
                            : `揭開第 ${index + 1} 張牌`
                        }
                      >
                        <div className="flip-inner">
                          <div className="flip-back">
                            <CardBack />
                          </div>
                          <div
                            className={`flip-face ${card.reversed ? 'reversed' : ''}`}
                          >
                            <TarotArt card={card} />
                            <span>{card.number}</span>
                          </div>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="card-message">
                          <p className="position-tag">
                            {activeSpread.positions[index]}
                          </p>
                          <h3>
                            {card.name}
                            <small>{card.en}</small>
                          </h3>
                          <div className="orientation-row">
                            <span>{card.reversed ? '逆位' : '正位'}</span>
                            {card.keywords.map((word) => (
                              <i key={word}>{word}</i>
                            ))}
                          </div>
                          <p className="meaning">
                            <Typewriter
                              text={card.reversed ? card.shadow : card.light}
                            />
                          </p>
                          <blockquote>
                            <b>給你的行動指引</b>
                            {card.guidance}
                          </blockquote>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
              {revealed.length < drawn.length && (
                <p className="tap-prompt">輕觸牌背，依序揭開你的訊息</p>
              )}
              {revealed.length === drawn.length && (
                <div className="reading-actions">
                  <div className="closing-oracle">
                    <MoonStar aria-hidden="true" />
                    <p>
                      <b>請記住</b>
                      塔羅不是替你決定命運，而是照亮你已經感受到、卻還沒有說出口的事。
                    </p>
                  </div>
                  <div>
                    <Button onClick={saveReading}>
                      <Bookmark aria-hidden="true" />
                      收藏這次占卜
                    </Button>
                    <Button variant="outline" onClick={shareReading}>
                      <Share2 aria-hidden="true" />
                      分享結果圖片
                    </Button>
                    <Button variant="ghost" onClick={restart}>
                      <RotateCcw aria-hidden="true" />
                      再問一次
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          {phase !== 'ritual' && (
            <button className="ritual-back" onClick={restart}>
              <ArrowLeft aria-hidden="true" />
              重新選擇牌陣
            </button>
          )}
        </section>
      )}

      <section className="arcana-library">
        <div>
          <p className="eyebrow">
            <span /> THE MAJOR ARCANA
          </p>
          <h2>二十二道靈魂原型</h2>
          <p>
            從愚者的第一步，到世界的完整圓滿。每張牌，都是你生命旅程中曾經走過的一幕。
          </p>
        </div>
        <div className="library-marquee" aria-hidden="true">
          {arcana.slice(0, 10).map((card) => (
            <div className="mini-arcana" key={card.number}>
              <TarotArt card={card} />
              <span>{card.name}</span>
            </div>
          ))}
        </div>
      </section>
      <footer>
        <div className="footer-sigil">☾</div>
        <b>微光塔羅</b>
        <p>願每一次翻牌，都讓你更靠近自己。</p>
        <small>塔羅內容僅供自我探索與娛樂參考，不取代專業建議。</small>
      </footer>
      {notice && (
        <div className="toast">
          <Check aria-hidden="true" />
          {notice}
        </div>
      )}
      {historyOpen && (
        <div
          className="collection-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setHistoryOpen(false);
          }}
        >
          <dialog
            open
            className="collection-drawer"
            aria-modal="true"
            aria-labelledby="collection-title"
          >
            <button
              className="drawer-close"
              onClick={() => setHistoryOpen(false)}
              aria-label="關閉收藏匣"
            >
              ×
            </button>
            <p className="eyebrow">
              <span /> YOUR CONSTELLATION
            </p>
            <h2 id="collection-title">星夜收藏匣</h2>
            <p>你曾經向牌面提出的問題，都化成了這裡的一點星光。</p>
            {savedReadings.length === 0 ? (
              <div className="collection-empty">
                <MoonStar aria-hidden="true" />
                <b>收藏匣還是空的</b>
                <span>完成一次占卜並收藏，它就會出現在這裡。</span>
              </div>
            ) : (
              <div className="saved-list">
                {savedReadings.map((item, index) => (
                  <article key={`${item.date}-${index}`}>
                    <time>
                      {new Date(item.date).toLocaleDateString('zh-TW')}
                    </time>
                    <span>{item.spread}</span>
                    <h3>{item.question || '此刻，宇宙想讓我知道什麼？'}</h3>
                    <p>
                      {item.cards
                        .map(
                          (card) =>
                            `${card.name}・${card.reversed ? '逆位' : '正位'}`,
                        )
                        .join('　')}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </dialog>
        </div>
      )}
    </main>
  );
}
