import React, { useState, useMemo } from "react";

const total = 48;

export default function BubblePopGame({ onComplete }) {
  const [popped, setPopped] = useState([]);
  const [poppingId, setPoppingId] = useState(null);

  const bubbles = useMemo(
    () => Array.from({ length: total }, (_, i) => ({ id: i })),
    []
  );

  const score = popped.length;
  const calmLevel = Math.min(100, Math.round((score / total) * 100));

  const getMessage = () => {
    if (calmLevel < 30) return "Start gently popping one by one 🌿";
    if (calmLevel < 70) return "Nice… keep the relaxing rhythm ✨";
    if (calmLevel < 100) return "So satisfying 😌 your mind is settling";
    return "You popped them all! Amazing calm 🎉";
  };

  const handlePop = (id) => {
    if (popped.includes(id)) return;
    setPoppingId(id);
    setTimeout(() => {
      setPopped((prev) => {
        const next = [...prev, id];
        if (next.length === total) {
          setTimeout(() => onComplete && onComplete(next.length), 600);
        }
        return next;
      });
      setPoppingId(null);
    }, 150);
  };

  const resetBoard = () => setPopped([]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #e0f7f4 0%, #b2ebf2 100%)",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "20px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,150,136,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#00695c",
            margin: "0 0 6px",
          }}
        >
          Bubble Wrap Calm Pop
        </h2>
        <p style={{ color: "#4db6ac", margin: "0 0 14px", fontSize: "0.95rem" }}>
          {getMessage()}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            fontSize: "0.9rem",
            color: "#00695c",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          <span>
            Popped:{" "}
            <strong>
              {score}/{total}
            </strong>
          </span>
          <span>
            Calm: <strong>{calmLevel}%</strong>
          </span>
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: "10px",
            background: "#b2dfdb",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${calmLevel}%`,
              background: "linear-gradient(90deg, #26a69a, #00bcd4)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Bubble Grid */}
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 8px 40px rgba(0,150,136,0.12)",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "10px",
        }}
      >
        {bubbles.map((bubble) => {
          const isPopped = popped.includes(bubble.id);
          const isPopping = poppingId === bubble.id;
          return (
            <button
              key={bubble.id}
              onClick={() => handlePop(bubble.id)}
              title={isPopped ? "Already popped!" : "Pop me!"}
              style={{
                aspectRatio: "1",
                borderRadius: "50%",
                border: isPopped ? "2px solid #bdbdbd" : "2px solid rgba(255,255,255,0.8)",
                cursor: isPopped ? "default" : "pointer",
                background: isPopped
                  ? "radial-gradient(circle at 40% 35%, #e0e0e0, #bdbdbd)"
                  : "radial-gradient(circle at 35% 30%, #80deea, #26c6da, #0097a7)",
                boxShadow: isPopped
                  ? "inset 0 2px 6px rgba(0,0,0,0.15)"
                  : "0 4px 12px rgba(0,188,212,0.3), inset 0 -2px 6px rgba(255,255,255,0.4)",
                transform: isPopping ? "scale(0.7)" : isPopped ? "scale(0.88)" : "scale(1)",
                transition: "transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease",
                padding: 0,
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isPopped) e.currentTarget.style.transform = "scale(1.12)";
              }}
              onMouseLeave={(e) => {
                if (!isPopped) e.currentTarget.style.transform = "scale(1)";
              }}
            />
          );
        })}
      </div>

      {/* Reset */}
      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <button
          onClick={resetBoard}
          style={{
            padding: "10px 28px",
            borderRadius: "14px",
            background: "white",
            border: "2px solid #b2dfdb",
            color: "#00695c",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,150,136,0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e0f7f4";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,150,136,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,150,136,0.1)";
          }}
        >
          Reset Bubble Wrap 🔄
        </button>
      </div>
    </div>
  );
}
