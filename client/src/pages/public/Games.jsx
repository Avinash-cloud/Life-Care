import React, { useState } from "react";
import { Container, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { ShieldCheck } from "lucide-react";
import { assessmentAPI } from "../../services/api";
import BubblePopGame from "./games/BubblePopGame";
import WordCompleteGame from "./games/WordCompleteGame";

// ─── Game Selection Card ───────────────────────────────────────────────────────
const GameCard = ({ title, description, emoji, tag, tagColor, gradient, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "white",
      border: "none",
      borderRadius: "24px",
      padding: "0",
      cursor: "pointer",
      textAlign: "left",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      overflow: "hidden",
      width: "100%",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.08)";
    }}
  >
    {/* Gradient banner */}
    <div
      style={{
        background: gradient,
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3.5rem",
      }}
    >
      {emoji}
    </div>
    {/* Content */}
    <div style={{ padding: "20px 24px 24px" }}>
      <span
        style={{
          background: tagColor,
          color: "white",
          borderRadius: "20px",
          padding: "3px 12px",
          fontSize: "0.75rem",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {tag}
      </span>
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: "800",
          color: "#1a1a2e",
          margin: "12px 0 8px",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#607d8b", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 16px" }}>
        {description}
      </p>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: tagColor.replace(")", ", 0.9)").replace("bg(", "rgba("),
          fontWeight: "700",
          fontSize: "0.9rem",
        }}
      >
        Play Now →
      </div>
    </div>
  </button>
);

// ─── Save Result Modal (same as AnxietyTest) ──────────────────────────────────
const SaveModal = ({ show, gameTitle, score, onHide }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.email) {
      setSaveError("Please provide either your Name or Email Address.");
      return;
    }
    setIsSaving(true);
    setSaveError("");
    try {
      await assessmentAPI.saveResult({
        ...formData,
        score,
        testUrl: `${window.location.origin}/game — ${gameTitle}`,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setFormData({ name: "", email: "", phone: "" });
        onHide();
      }, 2000);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => !isSaving && !saveSuccess && onHide()}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton={!isSaving && !saveSuccess}>
        <Modal.Title>🎮 Save Your Game Results</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {!saveSuccess ? (
          <>
            <p style={{ color: "#546e7a", marginBottom: "16px", fontSize: "0.95rem" }}>
              You completed <strong>{gameTitle}</strong> with a score of{" "}
              <strong>{score}</strong>. Save your results to your profile!
            </p>
            {saveError && <Alert variant="danger">{saveError}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Form.Text className="text-muted">Fill this OR your email below.</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  required
                  placeholder="Enter your mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Form.Group>
              <div className="d-grid mt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: "11px",
                    background: "#3d6a5f",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {isSaving ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                      Saving…
                    </>
                  ) : (
                    "Save Results"
                  )}
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={onHide}
                  disabled={isSaving}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#90a4ae",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Skip for now
                </button>
              </div>
            </Form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <ShieldCheck size={48} color="#43a047" style={{ marginBottom: "12px" }} />
            <h4 style={{ color: "#2e7d32", fontWeight: "700" }}>Successfully Saved!</h4>
            <p style={{ color: "#546e7a" }}>Your results have been securely recorded.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

// ─── Main Games Page ───────────────────────────────────────────────────────────
const Games = () => {
  const [activeGame, setActiveGame] = useState(null); // null | 'bubble' | 'word'
  const [modalState, setModalState] = useState({ show: false, gameTitle: "", score: 0 });

  const handleGameComplete = (gameTitle, score) => {
    setTimeout(() => {
      setModalState({ show: true, gameTitle, score });
    }, 800);
  };

  const closeModal = () => setModalState((s) => ({ ...s, show: false }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f8f9ff 0%, #f0f4f8 50%, #edf7f5 100%)",
        fontFamily: "'DM Sans', sans-serif",
        paddingTop: "80px",
        paddingBottom: "60px",
      }}
    >
      <Container>
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #e8f5e9, #e0f2f1)",
              color: "#2e7d32",
              borderRadius: "30px",
              padding: "6px 20px",
              fontSize: "0.85rem",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            🧘 Mental Wellness Games
          </span>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: "800",
              color: "#1a1a2e",
              marginBottom: "14px",
              lineHeight: "1.25",
            }}
          >
            Play Your Anxiety Away
          </h1>
          <p
            style={{
              color: "#607d8b",
              fontSize: "1.05rem",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            These mindful mini-games are designed to help you focus, breathe, and feel calmer — one
            interaction at a time.
          </p>
        </div>

        {/* Back button when a game is active */}
        {activeGame && (
          <div style={{ marginBottom: "24px" }}>
            <button
              onClick={() => setActiveGame(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "white",
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                padding: "8px 18px",
                color: "#455a64",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              ← Back to Games
            </button>
          </div>
        )}

        {/* ── Game Cards (landing) ─────────────────────────────────── */}
        {!activeGame && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            <GameCard
              title="Bubble Wrap Calm Pop"
              description="Pop virtual bubbles one by one to release tension and anxiety. Watch your calm level rise with every satisfying pop!"
              emoji="🫧"
              tag="Stress Relief"
              tagColor="#00897b"
              gradient="linear-gradient(135deg, #b2ebf2 0%, #80deea 100%)"
              onClick={() => setActiveGame("bubble")}
            />
            <GameCard
              title="Complete the Positive Word"
              description="Fill in missing letters to reveal uplifting words. A gentle brain exercise that shifts attention from worry to focus."
              emoji="✍️"
              tag="Mindful Focus"
              tagColor="#7c4dff"
              gradient="linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)"
              onClick={() => setActiveGame("word")}
            />
          </div>
        )}

        {/* ── Active Game ────────────────────────────────────────────── */}
        {activeGame === "bubble" && (
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <BubblePopGame
              onComplete={(score) => handleGameComplete("Bubble Wrap Calm Pop", score)}
            />
          </div>
        )}

        {activeGame === "word" && (
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <WordCompleteGame
              onComplete={(score) => handleGameComplete("Complete the Positive Word", score)}
            />
          </div>
        )}

        {/* Bottom note */}
        {!activeGame && (
          <p
            style={{
              textAlign: "center",
              color: "#90a4ae",
              fontSize: "0.85rem",
              marginTop: "40px",
            }}
          >
            These games are therapeutic tools, not a replacement for professional mental health care.
          </p>
        )}
      </Container>

      {/* Save Result Modal */}
      <SaveModal
        show={modalState.show}
        gameTitle={modalState.gameTitle}
        score={modalState.score}
        onHide={closeModal}
      />
    </div>
  );
};

export default Games;
