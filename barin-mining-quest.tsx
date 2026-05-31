import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================
// SUPABASE CONFIG
// ============================================
const SUPABASE_URL = "https://leqkbgdqcqincjwwlyef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlcWtiZ2RxY3FpbmNqd3dseWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDk3MDgsImV4cCI6MjA5NTgyNTcwOH0.vfNSOI8aDv9julOWHuNitpP1eAxEdWhO2EDSrqQqqZw";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// COLORS & CONSTANTS
// ============================================
const COLORS = {
  bg: "#07080f", surface: "#0d0f1a", card: "#12141f", border: "#1e2235",
  gold: "#F59E0B", goldDim: "#92600a", white: "#F9FAFB", gray: "#6B7280", grayDim: "#374151",
};

const BASE_IMG = "https://raw.githubusercontent.com/BarinMT/barin-mining-quest/main/";

const CHARACTERS = [
  { id: "geologist", phase: 1, phaseLabel: "EXPLORATION", color: "#F59E0B", glow: "#f59e0b44", mineral: "Fe • Cu", male: { name: "Kaveh", title: "Geologist", quote: "I read the earth — I sense the ore", emoji: "🪨", img: BASE_IMG + "IMG_6164.PNG" }, female: { name: "Sara", title: "Geologist", quote: "Every rock tells a story — I listen", emoji: "🪨", img: BASE_IMG + "IMG_6163.PNG" }, skills: ["Mineral ID", "Field Mapping", "Rock Analysis"], xp: 300, missions: 4 },
  { id: "geophysicist", phase: 1, phaseLabel: "EXPLORATION", color: "#06B6D4", glow: "#06b6d444", mineral: "Li • Ni", male: { name: "Aria", title: "Geophysicist", quote: "I see the earth from above", emoji: "🛸", img: BASE_IMG + "IMG_6162.PNG" }, female: { name: "Nila", title: "Geophysicist", quote: "My sensors never lie — data is truth", emoji: "🛸", img: BASE_IMG + "IMG_6158.PNG" }, skills: ["Aerial Survey", "Geo-Mapping", "AI Analysis"], xp: 350, missions: 4 },
  { id: "engineer", phase: 2, phaseLabel: "EXTRACTION", color: "#EF4444", glow: "#ef444444", mineral: "Fe • Au", male: { name: "Rostam", title: "Mining Engineer", quote: "The pit design is mine — I decide", emoji: "⛏️", img: BASE_IMG + "IMG_6157.PNG" }, female: { name: "Ana", title: "Mining Engineer", quote: "I move mountains — literally", emoji: "⛏️", img: BASE_IMG + "IMG_6161.PNG" }, skills: ["Pit Design", "Drill Planning", "Blast Control"], xp: 500, missions: 4 },
  { id: "process", phase: 3, phaseLabel: "PROCESSING", color: "#10B981", glow: "#10b98144", mineral: "Cu • Li", male: { name: "Daniyar", title: "Process Engineer", quote: "I turn raw stone into pure product", emoji: "🏭", img: BASE_IMG + "IMG_6160.PNG" }, female: { name: "Mahsa", title: "Process Engineer", quote: "Chemistry is my superpower", emoji: "🏭", img: BASE_IMG + "IMG_6155.PNG" }, skills: ["Crushing", "Concentration", "Quality Control"], xp: 600, missions: 4 },
  { id: "commerce", phase: 4, phaseLabel: "EXPORT", color: "#8B5CF6", glow: "#8b5cf644", mineral: "Au • Ag", male: { name: "Shayan", title: "Commerce Director", quote: "I sell the mine's product to the world", emoji: "🚢", img: BASE_IMG + "IMG_6154.PNG" }, female: { name: "Layla", title: "Commerce Director", quote: "Every shipment is a story on-chain", emoji: "🚢", img: BASE_IMG + "IMG_6159.PNG" }, skills: ["Global Trade", "Blockchain Export", "Market Analysis"], xp: 800, missions: 4 },
];

const MISSIONS = [
  { id: 1, charId: "geologist", title: "Mineral Post", desc: "Post about hematite or magnetite on X", reward: 30, platform: "X", icon: "🐦", difficulty: "Easy", instruction: "یه پست درباره هماتیت یا مگنتیت در X بنویس و لینکش رو اینجا بذار" },
  { id: 2, charId: "geologist", title: "Community Share", desc: "Share BARIN infographic in Telegram", reward: 25, platform: "TG", icon: "✈️", difficulty: "Easy", instruction: "اینفوگرافیک BARIN رو در تلگرام به اشتراک بذار و لینک پست رو بفرست" },
  { id: 3, charId: "geologist", title: "Refer a Miner", desc: "Invite a new member to BARIN community", reward: 35, platform: "TG", icon: "👥", difficulty: "Medium", instruction: "یه نفر جدید رو به کانال تلگرام BARIN دعوت کن و یوزرنیمش رو بفرست" },
  { id: 4, charId: "geologist", title: "Weekly Quiz", desc: "Answer the weekly technical question", reward: 40, platform: "TG", icon: "❓", difficulty: "Medium", instruction: "سوال هفتگی: هماتیت چند درصد آهن داره؟ جوابت رو بنویس" },
  { id: 5, charId: "geophysicist", title: "Aerial Mapping", desc: "Explain aerial vs ground exploration on X", reward: 35, platform: "X", icon: "🗺️", difficulty: "Easy", instruction: "تفاوت اکتشاف هوایی و زمینی رو در X توضیح بده و لینک پست رو بفرست" },
  { id: 6, charId: "geophysicist", title: "AI in Mining", desc: "Write thread about AI in mineral exploration", reward: 45, platform: "X", icon: "🤖", difficulty: "Medium", instruction: "یه thread درباره نقش AI در اکتشاف معدن بنویس و لینکش رو بفرست" },
  { id: 7, charId: "geophysicist", title: "Go Global", desc: "Introduce BARIN to an English-speaking group", reward: 40, platform: "Global", icon: "🌍", difficulty: "Medium", instruction: "BARIN رو به یه گروه انگلیسی‌زبان معرفی کن و لینک پست رو بفرست" },
  { id: 8, charId: "geophysicist", title: "Data Video", desc: "Short video about BARIN technical data", reward: 50, platform: "TG", icon: "🎬", difficulty: "Hard", instruction: "یه ویدیو کوتاه درباره داده‌های فنی BARIN بساز و لینکش رو بفرست" },
  { id: 9, charId: "engineer", title: "Pit Design Post", desc: "Explain open-pit vs underground mining", reward: 40, platform: "TG", icon: "⛏️", difficulty: "Easy", instruction: "تفاوت معدن روباز و زیرزمینی رو در تلگرام توضیح بده و لینک رو بفرست" },
  { id: 10, charId: "engineer", title: "Extraction Post", desc: "Post with #BarinMining about extraction", reward: 45, platform: "X", icon: "💥", difficulty: "Easy", instruction: "یه پست با هشتگ #BarinMining درباره استخراج بنویس و لینکش رو بفرست" },
  { id: 11, charId: "engineer", title: "Digital Modeling", desc: "Create infographic of extraction phases", reward: 55, platform: "TG", icon: "📊", difficulty: "Medium", instruction: "یه اینفوگرافیک از مراحل استخراج بساز و لینکش رو بفرست" },
  { id: 12, charId: "engineer", title: "Team Building", desc: "Refer 3 new members to BARIN community", reward: 60, platform: "TG", icon: "👷", difficulty: "Hard", instruction: "۳ نفر جدید به کانال BARIN دعوت کن و یوزرنیم‌هاشون رو بفرست" },
  { id: 13, charId: "process", title: "Digital Crushing", desc: "Explain raw ore vs concentrate difference", reward: 50, platform: "X", icon: "🏭", difficulty: "Easy", instruction: "تفاوت سنگ خام و کنسانتره رو در X توضیح بده و لینک پست رو بفرست" },
  { id: 14, charId: "process", title: "Quality Testing", desc: "Answer hard technical question about processing", reward: 60, platform: "TG", icon: "🔬", difficulty: "Medium", instruction: "سوال: فرآیند فلوتاسیون در فراوری مس چیه؟ جوابت رو بنویس" },
  { id: 15, charId: "process", title: "Plant Design", desc: "Create infographic of processing phases", reward: 70, platform: "X", icon: "⚗️", difficulty: "Hard", instruction: "اینفوگرافیک مراحل فراوری رو بساز و در X پست کن، لینک رو بفرست" },
  { id: 16, charId: "commerce", title: "Digital Export", desc: "Introduce BARIN to 2 English-language groups", reward: 70, platform: "Global", icon: "🌐", difficulty: "Medium", instruction: "BARIN رو به ۲ گروه انگلیسی‌زبان معرفی کن و لینک‌ها رو بفرست" },
  { id: 17, charId: "commerce", title: "EV Market Analysis", desc: "Explain role of minerals in EV industry", reward: 65, platform: "X", icon: "⚡", difficulty: "Medium", instruction: "نقش مواد معدنی در صنعت EV رو در X توضیح بده و لینک پست رو بفرست" },
  { id: 18, charId: "commerce", title: "Blockchain Export", desc: "Thread: why blockchain improves mineral exports", reward: 80, platform: "X", icon: "⛓️", difficulty: "Hard", instruction: "یه thread درباره مزایای بلاکچین در صادرات معدنی بنویس و لینک رو بفرست" },
  { id: 19, charId: "commerce", title: "BARIN Ambassador", desc: "Produce article or short podcast about BARIN", reward: 100, platform: "Any", icon: "🎙️", difficulty: "Hard", instruction: "یه مقاله یا پادکست کوتاه درباره BARIN بساز و لینکش رو بفرست" },
  { id: 20, charId: "geologist", title: "Exploration Report", desc: "Create detailed field report post on X", reward: 45, platform: "X", icon: "📋", difficulty: "Hard", instruction: "یه گزارش میدانی دقیق درباره اکتشاف معدنی در X پست کن و لینک رو بفرست" },
];

const MINERALS_TAP = [
  { symbol: "Fe", name: "Iron", color: "#EF4444", glow: "#ef444466", reward: 10 },
  { symbol: "Cu", name: "Copper", color: "#F97316", glow: "#f9731666", reward: 15 },
  { symbol: "Li", name: "Lithium", color: "#10B981", glow: "#10b98166", reward: 25 },
  { symbol: "Au", name: "Gold", color: "#F59E0B", glow: "#f59e0b66", reward: 50 },
  { symbol: "Ni", name: "Nickel", color: "#8B5CF6", glow: "#8b5cf666", reward: 20 },
];

// ============================================
// HELPER COMPONENTS
// ============================================
function GoldBorder({ children, color = "#F59E0B", style = {} }: any) {
  return <div style={{ border: `1px solid ${color}33`, borderRadius: 16, background: "#12141f", ...style }}>{children}</div>;
}

function Badge({ label, color }: any) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>;
}

function ProgressBar({ value, max, color }: any) {
  return (
    <div style={{ background: "#ffffff0a", borderRadius: 20, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: `linear-gradient(to right, ${color}88, ${color})`, borderRadius: 20, transition: "width 0.3s", boxShadow: `0 0 8px ${color}66` }} />
    </div>
  );
}

function BottomNav({ active, setActive }: any) {
  const tabs = [{ id: "home", label: "Home", icon: "⛏️" }, { id: "missions", label: "Missions", icon: "🎯" }, { id: "tap", label: "Mine", icon: "💎" }, { id: "leaderboard", label: "Ranks", icon: "🏆" }, { id: "learn", label: "Learn", icon: "📚" }];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#0d0f1a", borderTop: "1px solid #1e2235", display: "flex", padding: "8px 0 8px" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0" }}>
          <span style={{ fontSize: 18, filter: active === t.id ? "none" : "grayscale(1) opacity(0.4)" }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: active === t.id ? "#F59E0B" : "#6B7280", fontFamily: "monospace" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// MISSION SUBMIT MODAL
// ============================================
function MissionModal({ mission, onClose, onSubmit, char }: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await onSubmit(mission, input.trim());
    setSuccess(true);
    setLoading(false);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000cc", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, background: "#12141f", borderRadius: "20px 20px 0 0", padding: 24, border: `1px solid ${char.color}44` }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>ثبت شد!</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>ماموریت در صف بررسی هست</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#F9FAFB" }}>{mission.icon} {mission.title}</div>
                <div style={{ fontSize: 11, color: char.color, marginTop: 2 }}>+{mission.reward} BARIN</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7280", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ background: `${char.color}11`, border: `1px solid ${char.color}33`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: char.color, letterSpacing: 1, marginBottom: 6 }}>📋 راهنما</div>
              <div style={{ fontSize: 13, color: "#F9FAFB", lineHeight: 1.7 }}>{mission.instruction}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>لینک یا جواب خود را وارد کنید:</div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="https://... یا جواب خود را اینجا بنویسید"
                style={{ width: "100%", background: "#0d0f1a", border: `1px solid ${char.color}44`, borderRadius: 12, padding: 12, color: "#F9FAFB", fontSize: 13, fontFamily: "monospace", resize: "none", height: 80, boxSizing: "border-box", outline: "none" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              style={{ width: "100%", padding: 14, background: input.trim() ? `linear-gradient(135deg, ${char.color}cc, ${char.color})` : "#1e2235", border: "none", borderRadius: 12, cursor: input.trim() ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 900, color: input.trim() ? "#000" : "#6B7280", fontFamily: "monospace" }}
            >
              {loading ? "⏳ در حال ثبت..." : "✅ ثبت ماموریت"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// ONBOARDING
// ============================================
function Onboarding({ onComplete }: any) {
  const [step, setStep] = useState(0);
  const slides = [
    { icon: "⛏️", title: "BARIN Mining Quest", sub: "Powered by Earth. Proven on Chain.", desc: "The world's first educational Web3 game backed by real mineral mining operations on Polygon.", color: "#F59E0B" },
    { icon: "🎯", title: "Complete Missions", sub: "Learn. Share. Earn.", desc: "Each mission teaches you about real mining operations and rewards you with BARIN tokens.", color: "#06B6D4" },
    { icon: "💎", title: "Tap to Mine", sub: "Daily Mining Rewards", desc: "Mine virtual ore every day. Build combos, hit criticals, and earn BARIN rewards.", color: "#10B981" },
    { icon: "🚀", title: "Free to Start", sub: "No purchase required", desc: "Start free, connect your wallet to earn real BARIN tokens, stake to unlock even more rewards.", color: "#8B5CF6" },
  ];
  const s = slides[step];
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "monospace" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
        {slides.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? s.color : "#1e2235", transition: "all 0.3s" }} />)}
      </div>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: `${s.color}15`, border: `2px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 40, boxShadow: `0 0 40px ${s.color}22` }}>{s.icon}</div>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F9FAFB", marginBottom: 8 }}>{s.title}</div>
        <div style={{ fontSize: 12, color: s.color, letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>{s.sub}</div>
        <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, maxWidth: 280 }}>{s.desc}</div>
      </div>
      <button onClick={() => step < slides.length - 1 ? setStep(step + 1) : onComplete()} style={{ width: "100%", maxWidth: 320, padding: 16, background: `linear-gradient(135deg, ${s.color}cc, ${s.color})`, border: "none", borderRadius: 16, cursor: "pointer", fontSize: 14, fontWeight: 900, color: "#000", letterSpacing: 2, fontFamily: "monospace", boxShadow: `0 8px 24px ${s.color}44` }}>
        {step < slides.length - 1 ? "NEXT →" : "START MINING ⛏️"}
      </button>
      {step < slides.length - 1 && <button onClick={onComplete} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 12, marginTop: 16, fontFamily: "monospace" }}>Skip</button>}
    </div>
  );
}

// ============================================
// CHARACTER SELECT
// ============================================
function CharacterSelect({ onSelect }: any) {
  const [selected, setSelected] = useState<any>(null);
  const [gender, setGender] = useState("male");
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", fontFamily: "monospace", padding: "24px 16px 120px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3, marginBottom: 8 }}>⛏️ BARIN MINING QUEST</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F9FAFB" }}>Choose Your Character</div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Each role unlocks unique missions</div>
      </div>
      <div style={{ display: "flex", background: "#0d0f1a", borderRadius: 12, padding: 4, marginBottom: 20, border: "1px solid #1e2235" }}>
        {["male", "female"].map(g => <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: 8, background: gender === g ? "#F59E0B" : "none", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 900, color: gender === g ? "#000" : "#6B7280", fontFamily: "monospace", transition: "all 0.2s" }}>{g === "male" ? "👨 Male" : "👩 Female"}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHARACTERS.map(char => {
          const person = char[gender as "male" | "female"];
          const isSel = selected?.id === char.id;
          return (
            <div key={char.id} onClick={() => setSelected({ ...char, person, gender })} style={{ padding: 16, borderRadius: 16, cursor: "pointer", background: "#12141f", border: `2px solid ${isSel ? char.color : "#1e2235"}`, boxShadow: isSel ? `0 0 20px ${char.glow}` : "none", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", border: `2px solid ${char.color}55`, flexShrink: 0, background: `${char.color}15` }}>
                  {person.img ? <img src={person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{person.emoji}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#F9FAFB" }}>{person.name}</span>
                    <Badge label={char.phaseLabel} color={char.color} />
                  </div>
                  <div style={{ fontSize: 11, color: char.color, marginBottom: 6 }}>{person.title}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", fontStyle: "italic" }}>"{person.quote}"</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: char.color }}>{char.xp}</div>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>MAX XP</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{char.missions} missions</div>
                </div>
              </div>
              {isSel && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1e2235" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {char.skills.map(s => <span key={s} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, background: `${char.color}15`, color: char.color, border: `1px solid ${char.color}33` }}>{s}</span>)}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>Mineral Focus: <span style={{ color: char.color }}>{char.mineral}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "#07080f", borderTop: "1px solid #1e2235" }}>
          <button onClick={() => onSelect(selected)} style={{ width: "100%", padding: 16, background: `linear-gradient(135deg, ${selected.color}cc, ${selected.color})`, border: "none", borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 900, color: "#000", letterSpacing: 2, fontFamily: "monospace", boxShadow: `0 8px 24px ${selected.color}44` }}>
            START AS {selected.person.name.toUpperCase()} ⛏️
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// HOME
// ============================================
function Home({ character, xp, barin, setActive, streak }: any) {
  const char = CHARACTERS.find(c => c.id === character.id)!;
  const person = character.person;
  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>⛏️ BARIN MINING QUEST</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB", marginTop: 2 }}>Welcome, {person.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{barin}</div>
          <div style={{ fontSize: 9, color: "#6B7280" }}>BARIN EARNED</div>
        </div>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <div style={{ background: "linear-gradient(135deg, #F59E0B22, #EF444422)", border: "1px solid #F59E0B44", borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#F59E0B" }}>{streak} Day Streak!</div>
            <div style={{ fontSize: 10, color: "#6B7280" }}>هر روز وارد شو تا streak رو حفظ کنی</div>
          </div>
        </div>
      )}

      <GoldBorder color={char.color} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", border: `2px solid ${char.color}55`, background: `${char.color}20` }}>
            {character.person.img ? <img src={character.person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{person.emoji}</div>}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB" }}>{person.name}</div>
            <div style={{ fontSize: 11, color: char.color }}>{person.title}</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2, fontStyle: "italic" }}>"{person.quote}"</div>
          </div>
        </div>
        <div style={{ marginBottom: 6, fontSize: 10, color: "#6B7280", display: "flex", justifyContent: "space-between" }}><span>XP PROGRESS</span><span style={{ color: char.color }}>{xp} / {char.xp}</span></div>
        <ProgressBar value={xp} max={char.xp} color={char.color} />
      </GoldBorder>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[{ label: "Daily Mine", sub: "Tap to earn", icon: "💎", tab: "tap", color: "#10B981" }, { label: "Missions", sub: "Complete & earn", icon: "🎯", tab: "missions", color: "#F59E0B" }, { label: "Leaderboard", sub: "Your rank", icon: "🏆", tab: "leaderboard", color: "#8B5CF6" }, { label: "Learn", sub: "Industry insights", icon: "📚", tab: "learn", color: "#06B6D4" }].map(item => (
          <button key={item.tab} onClick={() => setActive(item.tab)} style={{ padding: "16px 14px", background: "#12141f", border: `1px solid ${item.color}33`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#F9FAFB" }}>{item.label}</div>
            <div style={{ fontSize: 10, color: "#6B7280" }}>{item.sub}</div>
          </button>
        ))}
      </div>

      <GoldBorder style={{ padding: 16 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 2, marginBottom: 8 }}>💡 DAILY FACT</div>
        <div style={{ fontSize: 13, color: "#F9FAFB", lineHeight: 1.6 }}>The Golden Gate Bridge contains <span style={{ color: "#F59E0B" }}>83,000 tons of steel</span> — all sourced from iron ore like the hematite BARIN mines.</div>
      </GoldBorder>
    </div>
  );
}

// ============================================
// MISSIONS
// ============================================
function Missions({ character, onComplete, completedMissions }: any) {
  const [filter, setFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<any>(null);
  const myMissions = MISSIONS.filter(m => filter === "all" ? true : m.charId === filter);
  const diffColor: any = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>🎯 MISSIONS</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>Complete & Earn</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{completedMissions.length} / {MISSIONS.length} completed</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {["all", "geologist", "geophysicist", "engineer", "process", "commerce"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, background: filter === f ? "#F59E0B" : "#12141f", border: `1px solid ${filter === f ? "#F59E0B" : "#1e2235"}`, color: filter === f ? "#000" : "#6B7280", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "monospace" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {myMissions.map(m => {
          const done = completedMissions.includes(m.id);
          const char = CHARACTERS.find(c => c.id === m.charId)!;
          return (
            <GoldBorder key={m.id} color={done ? "#10B981" : char.color} style={{ padding: 16, opacity: done ? 0.7 : 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${char.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: done ? "#10B981" : "#F9FAFB" }}>{done ? "✓ " : ""}{m.title}</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>+{m.reward}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8, lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6 }}><Badge label={m.platform} color={char.color} /><Badge label={m.difficulty} color={diffColor[m.difficulty]} /></div>
                    {!done && (
                      <button onClick={() => setActiveModal({ mission: m, char })} style={{ padding: "6px 14px", background: `${char.color}22`, border: `1px solid ${char.color}55`, borderRadius: 10, cursor: "pointer", fontSize: 10, fontWeight: 700, color: char.color, fontFamily: "monospace" }}>
                        SUBMIT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GoldBorder>
          );
        })}
      </div>

      {activeModal && (
        <MissionModal
          mission={activeModal.mission}
          char={activeModal.char}
          onClose={() => setActiveModal(null)}
          onSubmit={async (mission: any, input: string) => {
            await onComplete(mission.id, mission.reward, input);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// TAP TO EARN
// ============================================
function TapToEarn({ onEarn }: any) {
  const [energy, setEnergy] = useState(100);
  const [oreHP, setOreHP] = useState(100);
  const [mineralIdx, setMineralIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [floats, setFloats] = useState<any[]>([]);
  const [shaking, setShaking] = useState(false);
  const [totalMined, setTotalMined] = useState(0);
  const [extracted, setExtracted] = useState<any>({ Fe: 0, Cu: 0, Li: 0, Au: 0, Ni: 0 });
  const floatId = useRef(0);
  const m = MINERALS_TAP[mineralIdx];

  useEffect(() => { const t = setInterval(() => setEnergy(e => Math.min(100, e + 1)), 2000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => { if (Date.now() - lastTap > 1500) setCombo(0); }, 500); return () => clearInterval(t); }, [lastTap]);
  useEffect(() => { const t = setInterval(() => setFloats(f => f.filter((x: any) => Date.now() - x.born < 1000)), 100); return () => clearInterval(t); }, []);

  const handleTap = useCallback((e: any) => {
    if (energy <= 0) return;
    const now = Date.now();
    const newCombo = now - lastTap < 800 ? combo + 1 : 1;
    setCombo(newCombo); setLastTap(now);
    const isCrit = newCombo > 5 && Math.random() > 0.6;
    const dmg = Math.min(5 + Math.floor(newCombo / 3), 15);
    const earned = isCrit ? dmg * 2 : dmg;
    setEnergy(en => Math.max(0, en - 1));
    setShaking(true); setTimeout(() => setShaking(false), 150);
    const rect = e.currentTarget.getBoundingClientRect();
    setFloats(f => [...f, { id: floatId.current++, x: e.clientX - rect.left, y: e.clientY - rect.top, text: isCrit ? `⚡ CRIT +${earned}` : `+${earned}`, color: isCrit ? "#FCD34D" : m.color, born: Date.now() }]);
    setOreHP(hp => { const next = Math.max(0, hp - dmg); if (next <= 0) { setTimeout(() => { setMineralIdx(prev => (prev + 1) % MINERALS_TAP.length); setOreHP(100); }, 300); } return next; });
    setTotalMined(t => t + earned);
    setExtracted((ex: any) => ({ ...ex, [m.symbol]: ex[m.symbol] + earned }));
    onEarn(earned);
  }, [energy, combo, lastTap, m, onEarn]);

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div><div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>💎 DAILY MINE</div><div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>Tap to Mine</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{totalMined}</div><div style={{ fontSize: 9, color: "#6B7280" }}>MINED TODAY</div></div>
      </div>
      {combo > 1 && <div style={{ textAlign: "center", marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 900, color: combo > 5 ? "#FCD34D" : "#F59E0B" }}>{combo > 5 ? "⚡ CRITICAL! " : ""}COMBO ×{combo}</span></div>}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} onClick={handleTap}>
        <div style={{ width: 200, height: 200, position: "relative", cursor: energy > 0 ? "pointer" : "not-allowed", transition: "transform 0.1s", transform: shaking ? "scale(0.95) rotate(-2deg)" : "scale(1)", filter: `drop-shadow(0 0 20px ${m.glow})` }}>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
            <defs><radialGradient id="og" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor={m.color} stopOpacity="0.9" /><stop offset="100%" stopColor="#1a0a00" stopOpacity="0.9" /></radialGradient></defs>
            <polygon points="100,18 160,45 178,105 155,165 100,182 45,165 22,105 40,45" fill="url(#og)" />
            <polygon points="100,18 160,45 178,105 155,165 100,182 45,165 22,105 40,45" fill="rgba(0,0,0,0.4)" opacity={1 - oreHP / 100} />
            <text x="100" y="115" textAnchor="middle" fill={m.color} fontSize="36" fontWeight="900" fontFamily="Courier New" opacity="0.9">{m.symbol}</text>
          </svg>
          {floats.map((f: any) => { const age = (Date.now() - f.born) / 1000; return <div key={f.id} style={{ position: "absolute", left: f.x - 30, top: f.y - 40 - age * 60, opacity: Math.max(0, 1 - age), fontSize: 14, fontWeight: 900, color: f.color, pointerEvents: "none", whiteSpace: "nowrap", textShadow: `0 0 10px ${f.color}` }}>{f.text}</div>; })}
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: m.color, marginBottom: 20, fontWeight: 700 }}>{m.name} — {m.reward} BARIN base reward</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 5 }}><span>ORE INTEGRITY</span><span style={{ color: m.color }}>{oreHP}%</span></div>
        <ProgressBar value={oreHP} max={100} color={m.color} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 5 }}><span>⚡ ENERGY</span><span style={{ color: energy > 30 ? "#06B6D4" : "#EF4444" }}>{energy}/100</span></div>
        <ProgressBar value={energy} max={100} color={energy > 30 ? "#06B6D4" : "#EF4444"} />
        {energy === 0 && <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "#EF4444" }}>⏳ Recharging...</div>}
      </div>
      <GoldBorder style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 2, marginBottom: 10 }}>MINERALS EXTRACTED</div>
        <div style={{ display: "flex", gap: 8 }}>
          {MINERALS_TAP.map(min => <div key={min.symbol} style={{ flex: 1, textAlign: "center", background: extracted[min.symbol] > 0 ? `${min.color}11` : "#0d0f1a", borderRadius: 10, padding: "8px 4px", border: `1px solid ${extracted[min.symbol] > 0 ? min.color + "33" : "#1e2235"}` }}><div style={{ fontSize: 13, fontWeight: 900, color: extracted[min.symbol] > 0 ? min.color : "#6B7280" }}>{min.symbol}</div><div style={{ fontSize: 10, color: "#6B7280" }}>{extracted[min.symbol]}</div></div>)}
        </div>
      </GoldBorder>
    </div>
  );
}

// ============================================
// LEADERBOARD (REAL DATA)
// ============================================
function Leaderboard({ myBarin, myName, userId }: any) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("players")
        .select("username, barin, character_id, telegram_id")
        .order("barin", { ascending: false })
        .limit(20);
      if (data) setPlayers(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const rankColor: any = { 0: "#F59E0B", 1: "#9CA3AF", 2: "#B45309" };
  const rankEmoji: any = { 0: "🥇", 1: "🥈", 2: "🥉" };
  const charEmoji: any = { geologist: "🪨", geophysicist: "🛸", engineer: "⛏️", process: "🏭", commerce: "🚢" };

  if (loading) return (
    <div style={{ padding: "40px 16px", fontFamily: "monospace", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
      <div style={{ color: "#6B7280" }}>Loading leaderboard...</div>
    </div>
  );

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>🏆 LEADERBOARD</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>Weekly Rankings</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>Live — Updated in real time</div>
      </div>

      {players.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⛏️</div>
          <div style={{ color: "#6B7280", fontSize: 14 }}>اولین نفری باش که امتیاز کسب میکنه!</div>
        </div>
      ) : (
        <>
          {players.length >= 3 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {players.slice(0, 3).map((p, i) => (
                <div key={p.telegram_id || i} style={{ flex: 1, textAlign: "center", padding: "14px 8px", background: "#12141f", border: `1px solid ${rankColor[i]}44`, borderRadius: 14, boxShadow: i === 0 ? `0 0 20px ${rankColor[0]}22` : "none" }}>
                  <div style={{ fontSize: 22 }}>{rankEmoji[i]}</div>
                  <div style={{ fontSize: 18 }}>{charEmoji[p.character_id] || "💎"}</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: rankColor[i], marginTop: 4 }}>{p.username || "Miner"}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B", marginTop: 6 }}>{p.barin}</div>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>BARIN</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {players.map((p, i) => {
              const isMe = p.telegram_id === userId;
              return (
                <div key={p.telegram_id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: isMe ? "#F59E0B11" : "#12141f", border: `1px solid ${isMe ? "#F59E0B44" : "#1e2235"}`, borderRadius: 12 }}>
                  <div style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 900, color: rankColor[i] || "#6B7280" }}>{rankEmoji[i] || i + 1}</div>
                  <div style={{ fontSize: 18 }}>{charEmoji[p.character_id] || "💎"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: isMe ? "#F59E0B" : "#F9FAFB" }}>{p.username || "Miner"}{isMe ? " (You)" : ""}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>{p.barin}</div>
                    <div style={{ fontSize: 9, color: "#6B7280" }}>BARIN</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// LEARN
// ============================================
function Learn() {
  const [open, setOpen] = useState<number | null>(null);
  const topics = [
    { id: 1, icon: "🌋", title: "تشکیل مواد معدنی", color: "#EF4444", mineral: "Fe • Cu • Au", fact: "سنگ آهن میلیون‌ها سال طول کشید تا شکل بگیرد", content: "مواد معدنی در اعماق زمین تحت فشار و دمای بسیار بالا شکل می‌گیرند. آهن از بقایای ستارگان قدیمی است که میلیاردها سال پیش در زمین نشست کرد. هماتیت (Fe₂O₃) و مگنتیت (Fe₃O₄) دو شکل اصلی سنگ آهن هستند که BARIN استخراج می‌کند." },
    { id: 2, icon: "🪨", title: "شناسایی سنگ‌های معدنی", color: "#F59E0B", mineral: "هماتیت • مگنتیت • مالاکیت", fact: "هماتیت با رنگ قرمز‌قهوه‌ای شناخته می‌شود", content: "هماتیت: رنگ قرمز تا خاکستری، درخشش فلزی، ۷۰٪ آهن خالص.\nمگنتیت: رنگ سیاه، خاصیت مغناطیسی قوی، ۷۲٪ آهن.\nمالاکیت: رنگ سبز زیبا، منبع اصلی مس.\nزنجیر: رنگ آبی آسمانی، سنگ ارزشمند مس." },
    { id: 3, icon: "⛏️", title: "روش‌های استخراج", color: "#06B6D4", mineral: "معدن روباز • زیرزمینی", fact: "۸۰٪ معادن دنیا از روش روباز استفاده می‌کنند", content: "معدن روباز: برای کانسارهای نزدیک به سطح زمین. ارزان‌تر و ایمن‌تر.\nمعدن زیرزمینی: برای کانسارهای عمیق. هزینه بالاتر ولی تأثیر محیطی کمتر.\nحفاری: اولین قدم برای تعیین عمق و کیفیت کانسار.\nانفجار کنترل‌شده: روش اصلی استخراج در معادن بزرگ." },
    { id: 4, icon: "🏭", title: "فراوری مواد معدنی", color: "#10B981", mineral: "خردایش • فلوتاسیون • ذوب", fact: "از هر ۱۰۰ تن سنگ مس، فقط ۱ تن مس خالص بدست می‌آید", content: "خردایش: سنگ بزرگ به ذرات کوچک تبدیل می‌شود.\nفلوتاسیون: با استفاده از حباب هوا، مواد معدنی از سنگ جدا می‌شوند.\nتغلیظ: کنسانتره با عیار بالا تولید می‌شود.\nذوب و تصفیه: محصول نهایی با خلوص بالا آماده صادرات می‌شود." },
    { id: 5, icon: "⚡", title: "معادن و انرژی پاک", color: "#8B5CF6", mineral: "Li • Ni • Co • Cu", fact: "هر خودرو برقی به ۸ کیلوگرم لیتیوم نیاز دارد", content: "انقلاب انرژی پاک بدون معدن‌کاری ممکن نیست. باتری‌های لیتیوم‌یون به لیتیوم، نیکل، کبالت و مس نیاز دارند. پنل‌های خورشیدی از سیلیکون و نقره ساخته می‌شوند. توربین‌های بادی به مقادیر زیادی فولاد و مس نیاز دارند. BARIN در تأمین این مواد حیاتی نقش مستقیم دارد." },
    { id: 6, icon: "⛓️", title: "بلاکچین در معدن", color: "#F97316", mineral: "Polygon • BARIN Token", fact: "BARIN اولین توکن معدنی با پشتوانه عملیاتی واقعی", content: "BARIN چطور صنعت معدن را متحول می‌کند:\n• شفافیت کامل در زنجیره تأمین\n• قراردادهای هوشمند برای صادرات\n• tokenization دارایی‌های معدنی\n• استیکینگ و مشارکت در حاکمیت\n• ردیابی ESG و پایداری زیست‌محیطی" },
  ];

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>📚 LEARN</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>دانش معدنی</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>بدون مواد معدنی، دنیای دیجیتال وجود ندارد</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topics.map(t => (
          <div key={t.id} onClick={() => setOpen(open === t.id ? null : t.id)} style={{ background: "#12141f", border: `1px solid ${open === t.id ? t.color : "#1e2235"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${t.color}15`, border: `1.5px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#F9FAFB" }}>{t.title}</div>
                <div style={{ fontSize: 10, color: t.color, marginTop: 3 }}>{t.mineral}</div>
              </div>
              <div style={{ fontSize: 18, color: "#6B7280", transition: "transform 0.2s", transform: open === t.id ? "rotate(180deg)" : "none" }}>▾</div>
            </div>
            {open === t.id && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e2235" }}>
                <div style={{ background: `${t.color}11`, border: `1px solid ${t.color}33`, borderRadius: 10, padding: "10px 14px", margin: "12px 0" }}>
                  <div style={{ fontSize: 10, color: t.color, letterSpacing: 1, marginBottom: 4 }}>💡 نکته کلیدی</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>{t.fact}</div>
                </div>
                <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.9, whiteSpace: "pre-line" }}>{t.content}</div>
                <div style={{ marginTop: 12 }}><Badge label="BARIN Connected" color={t.color} /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [character, setCharacter] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [xp, setXp] = useState(0);
  const [barin, setBarin] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get Telegram user info
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserId(String(user.id));
        setUsername(user.username || user.first_name || "Miner");
      }
    } else {
      // Dev mode
      setUserId("dev_" + Math.random().toString(36).substr(2, 9));
      setUsername("DevMiner");
    }
  }, []);

  // Load player data from Supabase
  useEffect(() => {
    if (!userId) return;
    const loadPlayer = async () => {
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("telegram_id", userId)
        .single();

      if (data) {
        setBarin(data.barin || 0);
        setXp(data.xp || 0);
        setCompletedMissions(data.completed_missions || []);
        setStreak(data.streak || 0);
        if (data.character_id) {
          const char = CHARACTERS.find(c => c.id === data.character_id);
          if (char) {
            const person = char[data.gender as "male" | "female"] || char.male;
            setCharacter({ ...char, person, gender: data.gender });
            setScreen("game");
          }
        }
        // Update streak
        const lastLogin = new Date(data.last_login || 0);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          const newStreak = (data.streak || 0) + 1;
          setStreak(newStreak);
          await supabase.from("players").update({ streak: newStreak, last_login: today.toISOString() }).eq("telegram_id", userId);
        } else if (diffDays > 1) {
          setStreak(1);
          await supabase.from("players").update({ streak: 1, last_login: today.toISOString() }).eq("telegram_id", userId);
        }
      }
      setLoading(false);
    };
    loadPlayer();
  }, [userId]);

  // Save character selection
  const handleCharSelect = async (char: any) => {
    setCharacter(char);
    setScreen("game");
    await supabase.from("players").upsert({
      telegram_id: userId,
      username,
      character_id: char.id,
      gender: char.gender,
      barin: 0,
      xp: 0,
      completed_missions: [],
      streak: 1,
      last_login: new Date().toISOString(),
    });
  };

  // Mission complete with Supabase save
  const handleMissionComplete = useCallback(async (id: number, reward: number, submission: string) => {
    if (completedMissions.includes(id)) return;
    const newCompleted = [...completedMissions, id];
    const newBarin = barin + reward;
    const newXp = xp + Math.floor(reward * 0.5);
    setCompletedMissions(newCompleted);
    setBarin(newBarin);
    setXp(newXp);

    // Save to Supabase
    await supabase.from("players").update({
      barin: newBarin,
      xp: newXp,
      completed_missions: newCompleted,
    }).eq("telegram_id", userId);

    // Save submission for review
    await supabase.from("mission_submissions").insert({
      telegram_id: userId,
      username,
      mission_id: id,
      submission,
      status: "pending",
      created_at: new Date().toISOString(),
    });
  }, [completedMissions, barin, xp, userId, username]);

  // Tap earn with Supabase save
  const handleTapEarn = useCallback(async (amount: number) => {
    const earned = Math.floor(amount * 0.1);
    setBarin(b => {
      const newBarin = b + earned;
      supabase.from("players").update({ barin: newBarin }).eq("telegram_id", userId);
      return newBarin;
    });
  }, [userId]);

  if (loading && userId) return (
    <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⛏️</div>
        <div style={{ color: "#F59E0B", fontSize: 14 }}>Loading BARIN Quest...</div>
      </div>
    </div>
  );

  if (screen === "onboarding") return <Onboarding onComplete={() => setScreen("charselect")} />;
  if (screen === "charselect") return <CharacterSelect onSelect={handleCharSelect} />;

  return (
    <div style={{ minHeight: "100vh", background: "#07080f", color: "#F9FAFB", fontFamily: "monospace", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {activeTab === "home" && <Home character={character} xp={xp} barin={barin} setActive={setActiveTab} streak={streak} />}
      {activeTab === "missions" && <Missions character={character} onComplete={handleMissionComplete} completedMissions={completedMissions} />}
      {activeTab === "tap" && <TapToEarn onEarn={handleTapEarn} />}
      {activeTab === "leaderboard" && <Leaderboard myBarin={barin} myName={username} userId={userId} />}
      {activeTab === "learn" && <Learn />}
      <BottomNav active={activeTab} setActive={setActiveTab} />
    </div>
  );
}
