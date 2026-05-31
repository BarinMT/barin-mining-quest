import { useState, useEffect, useRef, useCallback } from "react";

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
  { id: 1, charId: "geologist", title: "Mineral Post", desc: "Post about hematite or magnetite on X", reward: 30, platform: "X", icon: "🐦", difficulty: "Easy" },
  { id: 2, charId: "geologist", title: "Community Share", desc: "Share BARIN infographic in Telegram", reward: 25, platform: "TG", icon: "✈️", difficulty: "Easy" },
  { id: 3, charId: "geologist", title: "Refer a Miner", desc: "Invite a new member to BARIN community", reward: 35, platform: "TG", icon: "👥", difficulty: "Medium" },
  { id: 4, charId: "geologist", title: "Weekly Quiz", desc: "Answer the weekly technical question", reward: 40, platform: "TG", icon: "❓", difficulty: "Medium" },
  { id: 5, charId: "geophysicist", title: "Aerial Mapping", desc: "Explain aerial vs ground exploration on X", reward: 35, platform: "X", icon: "🗺️", difficulty: "Easy" },
  { id: 6, charId: "geophysicist", title: "AI in Mining", desc: "Write thread about AI in mineral exploration", reward: 45, platform: "X", icon: "🤖", difficulty: "Medium" },
  { id: 7, charId: "geophysicist", title: "Go Global", desc: "Introduce BARIN to an English-speaking group", reward: 40, platform: "Global", icon: "🌍", difficulty: "Medium" },
  { id: 8, charId: "geophysicist", title: "Data Video", desc: "Short video about BARIN technical data", reward: 50, platform: "TG", icon: "🎬", difficulty: "Hard" },
  { id: 9, charId: "engineer", title: "Pit Design Post", desc: "Explain open-pit vs underground mining", reward: 40, platform: "TG", icon: "⛏️", difficulty: "Easy" },
  { id: 10, charId: "engineer", title: "Extraction Post", desc: "Post with #BarinMining about extraction", reward: 45, platform: "X", icon: "💥", difficulty: "Easy" },
  { id: 11, charId: "engineer", title: "Digital Modeling", desc: "Create infographic of extraction phases", reward: 55, platform: "TG", icon: "📊", difficulty: "Medium" },
  { id: 12, charId: "engineer", title: "Team Building", desc: "Refer 3 new members to BARIN community", reward: 60, platform: "TG", icon: "👷", difficulty: "Hard" },
  { id: 13, charId: "process", title: "Digital Crushing", desc: "Explain raw ore vs concentrate difference", reward: 50, platform: "X", icon: "🏭", difficulty: "Easy" },
  { id: 14, charId: "process", title: "Quality Testing", desc: "Answer hard technical question about processing", reward: 60, platform: "TG", icon: "🔬", difficulty: "Medium" },
  { id: 15, charId: "process", title: "Plant Design", desc: "Create infographic of processing phases", reward: 70, platform: "X", icon: "⚗️", difficulty: "Hard" },
  { id: 16, charId: "commerce", title: "Digital Export", desc: "Introduce BARIN to 2 English-language groups", reward: 70, platform: "Global", icon: "🌐", difficulty: "Medium" },
  { id: 17, charId: "commerce", title: "EV Market Analysis", desc: "Explain role of minerals in EV industry", reward: 65, platform: "X", icon: "⚡", difficulty: "Medium" },
  { id: 18, charId: "commerce", title: "Blockchain Export", desc: "Thread: why blockchain improves mineral exports", reward: 80, platform: "X", icon: "⛓️", difficulty: "Hard" },
  { id: 19, charId: "commerce", title: "BARIN Ambassador", desc: "Produce article or short podcast about BARIN", reward: 100, platform: "Any", icon: "🎙️", difficulty: "Hard" },
  { id: 20, charId: "geologist", title: "Exploration Report", desc: "Create detailed field report post on X", reward: 45, platform: "X", icon: "📋", difficulty: "Hard" },
];

const MINERALS_TAP = [
  { symbol: "Fe", name: "Iron", color: "#EF4444", glow: "#ef444466", reward: 10 },
  { symbol: "Cu", name: "Copper", color: "#F97316", glow: "#f9731666", reward: 15 },
  { symbol: "Li", name: "Lithium", color: "#10B981", glow: "#10b98166", reward: 25 },
  { symbol: "Au", name: "Gold", color: "#F59E0B", glow: "#f59e0b66", reward: 50 },
  { symbol: "Ni", name: "Nickel", color: "#8B5CF6", glow: "#8b5cf666", reward: 20 },
];

function GoldBorder({ children, color = "#F59E0B", style = {} }) {
  return <div style={{ border: `1px solid ${color}33`, borderRadius: 16, background: "#12141f", ...style }}>{children}</div>;
}

function Badge({ label, color }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>;
}

function ProgressBar({ value, max, color }) {
  return (
    <div style={{ background: "#ffffff0a", borderRadius: 20, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: `linear-gradient(to right, ${color}88, ${color})`, borderRadius: 20, transition: "width 0.3s", boxShadow: `0 0 8px ${color}66` }} />
    </div>
  );
}

function BottomNav({ active, setActive }) {
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

function Onboarding({ onComplete }) {
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

function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(null);
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
          const person = char[gender];
          const isSel = selected?.id === char.id;
          return (
            <div key={char.id} onClick={() => setSelected({ ...char, person, gender })} style={{ padding: 16, borderRadius: 16, cursor: "pointer", background: "#12141f", border: `2px solid ${isSel ? char.color : "#1e2235"}`, boxShadow: isSel ? `0 0 20px ${char.glow}` : "none", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", border: `2px solid ${char.color}55`, flexShrink: 0, background: `${char.color}15` }}>{person.img ? <img src={person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{person.emoji}</div>}</div>
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

function Home({ character, xp, barin, setActive }) {
  const char = CHARACTERS.find(c => c.id === character.id);
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
      <GoldBorder color={char.color} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", border: `2px solid ${char.color}55`, background: `${char.color}20` }}>{character.person.img ? <img src={character.person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{person.emoji}</div>}</div>
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

function Missions({ character, onComplete, completedMissions }) {
  const [filter, setFilter] = useState("all");
  const myMissions = MISSIONS.filter(m => filter === "all" ? true : m.charId === filter);
  const diffColor = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };
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
          const char = CHARACTERS.find(c => c.id === m.charId);
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
                    {!done && <button onClick={() => onComplete(m.id, m.reward)} style={{ padding: "6px 14px", background: `${char.color}22`, border: `1px solid ${char.color}55`, borderRadius: 10, cursor: "pointer", fontSize: 10, fontWeight: 700, color: char.color, fontFamily: "monospace" }}>SUBMIT</button>}
                  </div>
                </div>
              </div>
            </GoldBorder>
          );
        })}
      </div>
    </div>
  );
}

function TapToEarn({ onEarn }) {
  const [energy, setEnergy] = useState(100);
  const [oreHP, setOreHP] = useState(100);
  const [mineralIdx, setMineralIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [floats, setFloats] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [totalMined, setTotalMined] = useState(0);
  const [extracted, setExtracted] = useState({ Fe: 0, Cu: 0, Li: 0, Au: 0, Ni: 0 });
  const floatId = useRef(0);
  const m = MINERALS_TAP[mineralIdx];

  useEffect(() => { const t = setInterval(() => setEnergy(e => Math.min(100, e + 1)), 2000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => { if (Date.now() - lastTap > 1500) setCombo(0); }, 500); return () => clearInterval(t); }, [lastTap]);
  useEffect(() => { const t = setInterval(() => setFloats(f => f.filter(x => Date.now() - x.born < 1000)), 100); return () => clearInterval(t); }, []);

  const handleTap = useCallback((e) => {
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
    setExtracted(ex => ({ ...ex, [m.symbol]: ex[m.symbol] + earned }));
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
          {floats.map(f => { const age = (Date.now() - f.born) / 1000; return <div key={f.id} style={{ position: "absolute", left: f.x - 30, top: f.y - 40 - age * 60, opacity: Math.max(0, 1 - age), fontSize: 14, fontWeight: 900, color: f.color, pointerEvents: "none", whiteSpace: "nowrap", textShadow: `0 0 10px ${f.color}` }}>{f.text}</div>; })}
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

function Leaderboard({ myBarin, myName }) {
  const players = [
    { name: "Kaveh_M", barin: 1240, char: "⛏️", country: "🇮🇷" },
    { name: "Sara_B", barin: 980, char: "🛸", country: "🇨🇦" },
    { name: "Alex_W", barin: 875, char: "🏭", country: "🇩🇪" },
    { name: "Nila_K", barin: 720, char: "🪨", country: "🇦🇪" },
    { name: myName || "You", barin: myBarin || 0, char: "💎", country: "⭐", isMe: true },
    { name: "Rostam_P", barin: 540, char: "⛏️", country: "🇫🇷" },
    { name: "Mahsa_T", barin: 420, char: "🚢", country: "🇬🇧" },
    { name: "David_L", barin: 380, char: "🪨", country: "🇦🇺" },
  ].sort((a, b) => b.barin - a.barin).map((p, i) => ({ ...p, rank: i + 1 }));
  const rankColor = { 1: "#F59E0B", 2: "#9CA3AF", 3: "#B45309" };
  const rankEmoji = { 1: "🥇", 2: "🥈", 3: "🥉" };
  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ marginBottom: 20 }}><div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>🏆 LEADERBOARD</div><div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>Weekly Rankings</div><div style={{ fontSize: 11, color: "#6B7280" }}>Resets every Friday</div></div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {players.slice(0, 3).map(p => <div key={p.name} style={{ flex: 1, textAlign: "center", padding: "14px 8px", background: "#12141f", border: `1px solid ${rankColor[p.rank]}44`, borderRadius: 14, boxShadow: p.rank === 1 ? `0 0 20px ${rankColor[1]}22` : "none" }}><div style={{ fontSize: 22 }}>{rankEmoji[p.rank]}</div><div style={{ fontSize: 18 }}>{p.char}</div><div style={{ fontSize: 11, fontWeight: 900, color: rankColor[p.rank], marginTop: 4 }}>{p.name}</div><div style={{ fontSize: 10, color: "#6B7280" }}>{p.country}</div><div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B", marginTop: 6 }}>{p.barin}</div><div style={{ fontSize: 9, color: "#6B7280" }}>BARIN</div></div>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {players.map(p => <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: p.isMe ? "#F59E0B11" : "#12141f", border: `1px solid ${p.isMe ? "#F59E0B44" : "#1e2235"}`, borderRadius: 12 }}><div style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 900, color: rankColor[p.rank] || "#6B7280" }}>{rankEmoji[p.rank] || p.rank}</div><div style={{ fontSize: 18 }}>{p.char}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 900, color: p.isMe ? "#F59E0B" : "#F9FAFB" }}>{p.name}{p.isMe ? " (You)" : ""}</div><div style={{ fontSize: 10, color: "#6B7280" }}>{p.country}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>{p.barin}</div><div style={{ fontSize: 9, color: "#6B7280" }}>BARIN</div></div></div>)}
      </div>
    </div>
  );
}

function Learn() {
  const [open, setOpen] = useState(null);
  const topics = [
    { id: 1, icon: "🌉", title: "Bridge Engineering", color: "#F59E0B", mineral: "Iron, Steel, Copper", fact: "The Golden Gate Bridge uses 83,000 tons of steel", content: "Steel bridges require enormous amounts of iron ore. BARIN's hematite and magnetite operations feed directly into the global steel supply chain. Every major bridge in the world depends on mineral extraction operations like ours." },
    { id: 2, icon: "🏗️", title: "Construction", color: "#06B6D4", mineral: "Steel, Aluminium, Copper, Gypsum", fact: "Average home uses 2-5 tons of steel", content: "Construction is the world's largest consumer of iron ore. From skyscrapers to homes, steel forms the skeleton of modern civilization. BARIN's mineral operations contribute to this critical global supply chain." },
    { id: 3, icon: "☀️", title: "Solar Cells", color: "#10B981", mineral: "Silicon, Silver, Copper", fact: "95% of solar panels use pure silicon", content: "Clean energy is built on critical minerals. Solar panels require silicon, silver contacts, and copper wiring — all products of mining operations. BARIN supports the clean energy transition from the ground up." },
    { id: 4, icon: "⚡", title: "EV Batteries", color: "#EF4444", mineral: "Lithium, Nickel, Cobalt, Copper", fact: "By 2030 the world needs 40x more lithium", content: "Electric vehicles run on lithium-ion batteries. By 2030, the world will need 40 times more lithium than today. BARIN is positioned to supply critical minerals for the EV revolution through responsible mining." },
    { id: 5, icon: "🌱", title: "Clean Energy", color: "#8B5CF6", mineral: "Steel, Rare Earth, Lithium, Copper", fact: "Clean energy uses 6x more minerals than fossil fuels", content: "Wind turbines, power grids, and energy storage all require critical minerals. The clean energy transition demands MORE mining, not less — but done responsibly. BARIN leads with ESG-aligned practices." },
  ];
  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace" }}>
      <div style={{ marginBottom: 20 }}><div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>📚 LEARN</div><div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>Minerals in Our World</div><div style={{ fontSize: 11, color: "#6B7280" }}>None of the digital world is possible without critical minerals</div></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topics.map(t => (
          <div key={t.id} onClick={() => setOpen(open === t.id ? null : t.id)} style={{ background: "#12141f", border: `1px solid ${open === t.id ? t.color : "#1e2235"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${t.color}15`, border: `1.5px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 900, color: "#F9FAFB" }}>{t.title}</div><div style={{ fontSize: 10, color: t.color, marginTop: 3 }}>{t.mineral}</div></div>
              <div style={{ fontSize: 18, color: "#6B7280", transition: "transform 0.2s", transform: open === t.id ? "rotate(180deg)" : "none" }}>▾</div>
            </div>
            {open === t.id && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e2235" }}>
                <div style={{ background: `${t.color}11`, border: `1px solid ${t.color}33`, borderRadius: 10, padding: "10px 14px", margin: "12px 0" }}>
                  <div style={{ fontSize: 10, color: t.color, letterSpacing: 1, marginBottom: 4 }}>KEY FACT</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>{t.fact}</div>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{t.content}</div>
                <div style={{ marginTop: 12 }}><Badge label="BARIN Connected" color={t.color} /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [character, setCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [xp, setXp] = useState(0);
  const [barin, setBarin] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);

  const handleMissionComplete = useCallback((id, reward) => {
    if (!completedMissions.includes(id)) {
      setCompletedMissions(prev => [...prev, id]);
      setBarin(b => b + reward);
      setXp(x => x + Math.floor(reward * 0.5));
    }
  }, [completedMissions]);

  const handleTapEarn = useCallback((amount) => { setBarin(b => b + Math.floor(amount * 0.1)); }, []);

  if (screen === "onboarding") return <Onboarding onComplete={() => setScreen("charselect")} />;
  if (screen === "charselect") return <CharacterSelect onSelect={(char) => { setCharacter(char); setScreen("game"); }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#07080f", color: "#F9FAFB", fontFamily: "monospace", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {activeTab === "home" && <Home character={character} xp={xp} barin={barin} setActive={setActiveTab} />}
      {activeTab === "missions" && <Missions character={character} onComplete={handleMissionComplete} completedMissions={completedMissions} />}
      {activeTab === "tap" && <TapToEarn onEarn={handleTapEarn} />}
      {activeTab === "leaderboard" && <Leaderboard myBarin={barin} myName={character?.person?.name} />}
      {activeTab === "learn" && <Learn />}
      <BottomNav active={activeTab} setActive={setActiveTab} />
    </div>
  );
}
