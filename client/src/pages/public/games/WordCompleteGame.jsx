import React, { useState, useEffect, useRef, useMemo } from "react";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const WORD_PROMPTS = [
  { word: "C_LM",    answer: "CALM",    hint: "Feeling peaceful and relaxed",            emoji: "😌" },
  { word: "B_EATH",  answer: "BREATH",  hint: "What you do to relax — inhale & exhale",  emoji: "🌬️" },
  { word: "H_PE",    answer: "HOPE",    hint: "A positive feeling about the future",      emoji: "🌈" },
  { word: "P_ACE",   answer: "PEACE",   hint: "Inner stillness and quiet of mind",        emoji: "☮️" },
  { word: "H_AL",    answer: "HEAL",    hint: "To recover and feel better",               emoji: "💚" },
  { word: "J_Y",     answer: "JOY",     hint: "A feeling of great happiness",             emoji: "🎉" },
  { word: "R_ST",    answer: "REST",    hint: "Time to relax and recharge",               emoji: "😴" },
  { word: "T_UST",   answer: "TRUST",   hint: "Believing in yourself or others",          emoji: "🤝" },
  { word: "S_FE",    answer: "SAFE",    hint: "Protected from harm or danger",            emoji: "🛡️" },
  { word: "GR_W",    answer: "GROW",    hint: "To develop and become stronger",           emoji: "🌱" },
  { word: "K_ND",    answer: "KIND",    hint: "Being caring and compassionate",           emoji: "🌸" },
  { word: "M_ND",    answer: "MIND",    hint: "Your thoughts and consciousness",          emoji: "🧠" },
  { word: "STR_NG",  answer: "STRONG",  hint: "Resilient and capable",                   emoji: "💪" },
  { word: "GR_CE",   answer: "GRACE",   hint: "Elegance and a kind spirit",              emoji: "🕊️" },
  { word: "B_LANCE", answer: "BALANCE", hint: "Equilibrium between mind and body",       emoji: "⚖️" },
];

const TOTAL = WORD_PROMPTS.length;

/* Inject styles once so Bootstrap cannot override them */
const STYLE_ID = "wc-game-styles";
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    .wc-submit-btn {
      flex: 1 1 0%;
      padding: 13px 10px !important;
      border-radius: 14px !important;
      background: linear-gradient(135deg, #7c4dff, #651fff) !important;
      color: #fff !important;
      border: none !important;
      font-weight: 700 !important;
      font-size: 1rem !important;
      cursor: pointer !important;
      box-shadow: 0 4px 16px rgba(124,77,255,0.35) !important;
      display: block !important;
      opacity: 1 !important;
      transition: opacity 0.2s;
    }
    .wc-submit-btn:hover { opacity: 0.88 !important; }

    .wc-skip-btn {
      padding: 13px 20px !important;
      border-radius: 14px !important;
      background: #ffffff !important;
      border: 2px solid #d1c4e9 !important;
      color: #7e57c2 !important;
      font-weight: 600 !important;
      font-size: 0.95rem !important;
      cursor: pointer !important;
      display: block !important;
      opacity: 1 !important;
      transition: background 0.2s;
    }
    .wc-skip-btn:hover { background: #f3e5f5 !important; }

    .wc-restart-btn {
      padding: 12px 32px !important;
      border-radius: 14px !important;
      background: linear-gradient(135deg, #7c4dff, #651fff) !important;
      color: #fff !important;
      border: none !important;
      font-weight: 700 !important;
      font-size: 1rem !important;
      cursor: pointer !important;
      box-shadow: 0 6px 20px rgba(124,77,255,0.35) !important;
      display: inline-block !important;
      opacity: 1 !important;
      transition: opacity 0.2s;
    }
    .wc-restart-btn:hover { opacity: 0.88 !important; }

    .wc-input {
      width: 100% !important;
      padding: 13px 18px !important;
      border-radius: 14px !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      text-align: center !important;
      letter-spacing: 0.1em !important;
      background: #fafafa !important;
      box-sizing: border-box !important;
      outline: none !important;
      transition: border-color 0.3s;
      display: block !important;
      color: #4527a0 !important;
    }

    @keyframes wc-shake {
      0%,100%{ transform:translateX(0); }
      20%    { transform:translateX(-8px); }
      40%    { transform:translateX(8px); }
      60%    { transform:translateX(-5px); }
      80%    { transform:translateX(5px); }
    }
    @keyframes wc-pulse {
      0%  { transform:scale(1); }
      50% { transform:scale(1.03); }
      100%{ transform:scale(1); }
    }
    .wc-shake { animation: wc-shake 0.4s ease; }
    .wc-pulse { animation: wc-pulse 0.4s ease; }
  `;
  document.head.appendChild(s);
}

export default function WordCompleteGame({ onComplete }) {
  const [seed, setSeed]         = useState(0); // bump to re-shuffle
  const [index, setIndex]       = useState(0);
  const [input, setInput]       = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);
  const [cardClass, setCardClass] = useState("");
  const inputRef = useRef(null);

  // Re-shuffle whenever seed changes (i.e. on every restart)
  const prompts = useMemo(() => shuffle(WORD_PROMPTS), [seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const current = prompts[index];

  /* Reset input & focus on word change */
  useEffect(() => {
    setInput("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [index]);

  const triggerCardAnimation = (cls) => {
    setCardClass(cls);
    setTimeout(() => setCardClass(""), 450);
  };

  const advance = (newScore) => {
    if (index + 1 >= TOTAL) {
      setDone(true);
      onComplete && onComplete(newScore);
    } else {
      setIndex((i) => i + 1);
      setFeedback(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === current.answer) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback("correct");
      triggerCardAnimation("wc-pulse");
      setTimeout(() => advance(newScore), 700);
    } else {
      setFeedback("wrong");
      triggerCardAnimation("wc-shake");
    }
  };

  const handleSkip = () => {
    setFeedback(null);
    advance(score);
  };

  const handleRestart = () => {
    setSeed((s) => s + 1); // triggers a new shuffle via useMemo
    setIndex(0);
    setScore(0);
    setInput("");
    setFeedback(null);
    setDone(false);
  };

  const progress = (index / TOTAL) * 100;

  /* ── Completion screen ───────────────────────────────────────── */
  if (done) {
    const pct = Math.round((score / TOTAL) * 100);
    return (
      <div style={{ textAlign: "center", padding: "28px 20px", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: "4rem", marginBottom: "12px" }}>🌟</div>
        <h3 style={{ color: "#4527a0", fontWeight: "800", fontSize: "1.5rem", marginBottom: "8px" }}>
          Word Journey Complete!
        </h3>
        <p style={{ color: "#7e57c2", marginBottom: "20px", fontSize: "1rem" }}>
          You got <strong>{score}/{TOTAL}</strong> words correct ({pct}% accuracy)
        </p>
        <div
          style={{
            background: "linear-gradient(135deg, #ede7f6, #e8eaf6)",
            borderRadius: "16px",
            padding: "16px 24px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#5c35a0", margin: 0, fontSize: "0.95rem" }}>
            {pct >= 80
              ? "Excellent! Your mind is sharp and focused 🎯"
              : pct >= 50
              ? "Good effort! Keep practicing for better focus 💜"
              : "Keep going — every attempt builds mental strength 🌱"}
          </p>
        </div>
        <button className="wc-restart-btn" onClick={handleRestart}>
          Play Again 🔄
        </button>
      </div>
    );
  }

  /* ── Game screen ─────────────────────────────────────────────── */
  const inputBorder =
    feedback === "wrong"
      ? "2px solid #ef9a9a"
      : feedback === "correct"
      ? "2px solid #a5d6a7"
      : "2px solid #d1c4e9";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ─────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #ede7f6 0%, #e8eaf6 100%)",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "20px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(124,77,255,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#4527a0", margin: "0 0 6px" }}>
          Complete the Positive Word
        </h2>
        <p style={{ color: "#7e57c2", margin: "0 0 14px", fontSize: "0.9rem" }}>
          Fill in the missing letters — every word brings calm 💜
        </p>

        {/* Score row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "#5c35a0",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          <span>Word {index + 1} of {TOTAL}</span>
          <span>Score: {score}</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: "8px", background: "#d1c4e9", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c4dff, #651fff)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* ── Game Card ─────────────────────────── */}
      <div
        className={cardClass}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "28px 24px",
          boxShadow: "0 8px 40px rgba(124,77,255,0.12)",
          border: "1px solid #ede7f6",
        }}
      >
        {/* Emoji */}
        <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "8px" }}>
          {current.emoji}
        </div>

        {/* Hint */}
        <p
          style={{
            textAlign: "center",
            color: "#78909c",
            fontSize: "0.9rem",
            marginBottom: "18px",
            background: "#f5f5f5",
            padding: "8px 16px",
            borderRadius: "10px",
          }}
        >
          💡 {current.hint}
        </p>

        {/* Letter tiles */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          {current.word.split("").map((ch, i) => (
            <div
              key={i}
              style={{
                width: "44px",
                height: "52px",
                borderRadius: "10px",
                background: ch === "_" ? "#ede7f6" : "#f3e5f5",
                border: ch === "_" ? "2px dashed #9575cd" : "2px solid #ce93d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.35rem",
                fontWeight: "800",
                color: ch === "_" ? "#bdbdbd" : "#6a1b9a",
              }}
            >
              {ch === "_" ? "?" : ch}
            </div>
          ))}
        </div>

        {/* Feedback messages */}
        {feedback === "correct" && (
          <p style={{ textAlign: "center", color: "#2e7d32", fontWeight: "700", fontSize: "1rem", marginBottom: "10px" }}>
            ✅ Correct! Well done!
          </p>
        )}
        {feedback === "wrong" && (
          <p style={{ textAlign: "center", color: "#c62828", fontWeight: "600", fontSize: "0.95rem", marginBottom: "10px" }}>
            ❌ Not quite — try again!
          </p>
        )}

        {/* Input + Buttons */}
        <form onSubmit={handleSubmit} style={{ margin: 0 }}>
          <input
            ref={inputRef}
            className="wc-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Type the full word here…"
            maxLength={20}
            autoComplete="off"
            style={{ border: inputBorder }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "14px",
              alignItems: "stretch",
            }}
          >
            <button type="submit" className="wc-submit-btn">
              Submit ✓
            </button>
            <button type="button" className="wc-skip-btn" onClick={handleSkip}>
              Skip →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
