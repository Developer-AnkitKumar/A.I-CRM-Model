import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function LogInteractionScreen() {
  const [form, setForm] = useState({
    hcp_name: "",
    interaction_type: "Visit",
    date: "",
    time: "",
    notes: "",
    products_discussed: "",
    follow_up_date: "",
    suggestion: "",
    interest_level: "",
    smart_followup: "",
  });

  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Log interaction details here (e.g., 'Met Dr. Smith...') or ask for help.",
    },
  ]);

  const [message, setMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔥 auto scroll
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const applyPatch = (patch) => {
    setForm((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const sendToAI = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    try {
      setLoadingAI(true);
      setError("");

      setChat((prev) => [...prev, { role: "user", text: userMsg }]);

      const res = await axios.post("http://localhost:8000/chat", {
        message: userMsg,
      });

      setChat((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);

      if (res.data.data) {
        applyPatch(res.data.data);
      }

      setMessage("");
    } catch (err) {
      setError("AI request failed");

      setChat((prev) => [
        ...prev,
        { role: "ai", text: "❌ AI error aaya, try again." },
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      setError("");

      setChat((prev) => [
        ...prev,
        { role: "user", text: "Save interaction" },
      ]);

      await axios.post("http://localhost:8000/save", form);

      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text:
              "📝 Interaction summary saved.\n\n✅ Interaction logged successfully!\nThe details have been auto-filled.\n\nWould you like me to suggest a follow-up action?",
          },
        ]);
      }, 600);

      setMessage("");
    } catch (err) {
      setError("Save failed");

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "❌ Save nahi ho paya, please retry.",
        },
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT FORM */}
      <div style={styles.left}>
        <h2 style={styles.title}>🧠 AI Live Interaction Logger</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          value={form.hcp_name}
          onChange={(e) =>
            setForm({ ...form, hcp_name: e.target.value })
          }
          placeholder="HCP Name"
          style={styles.input}
        />

        <select
          value={form.interaction_type}
          onChange={(e) =>
            setForm({ ...form, interaction_type: e.target.value })
          }
          style={styles.input}
        >
          <option>Visit</option>
          <option>Call</option>
          <option>Meeting</option>
        </select>

        <div style={styles.row}>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <textarea
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          placeholder="Notes..."
          style={{ ...styles.input, height: 90 }}
        />

        <input
          value={form.products_discussed}
          onChange={(e) =>
            setForm({
              ...form,
              products_discussed: e.target.value,
            })
          }
          placeholder="Products"
          style={styles.input}
        />

        <input
          type="date"
          value={form.follow_up_date}
          onChange={(e) =>
            setForm({ ...form, follow_up_date: e.target.value })
          }
          style={styles.input}
        />

        <div style={styles.aiBox}>
          <p><b>AI Suggestion:</b> {form.suggestion || "-"}</p>
          <p><b>Interest Level:</b> {form.interest_level || "-"}</p>
          <p><b>Smart Follow-up:</b> {form.smart_followup || "-"}</p>
        </div>

        <button
          onClick={saveData}
          disabled={saving}
          style={{
            ...styles.btn,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Final Interaction"}
        </button>
      </div>

      {/* RIGHT CHAT */}
      <div style={styles.right}>
        <h3>🤖 AI Chat Assistant</h3>

        <div style={styles.chatBox}>
          {chat.map((c, i) => {
            const isSuccess =
              c.role === "ai" &&
              c.text.includes("Interaction logged successfully");

            return (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  alignSelf:
                    c.role === "user" ? "flex-end" : "flex-start",
                  background:
                    c.role === "user"
                      ? "#007bff"
                      : isSuccess
                      ? "#d4edda"
                      : "#eee",
                  color:
                    c.role === "user"
                      ? "white"
                      : isSuccess
                      ? "#155724"
                      : "black",
                  border: isSuccess
                    ? "1px solid #c3e6cb"
                    : "none",
                }}
              >
                <div style={{ whiteSpace: "pre-line" }}>
                  {c.text}
                </div>
              </div>
            );
          })}

          {loadingAI && (
            <div style={styles.typing}>AI is thinking...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 👇 FIXED BOTTOM INPUT */}
        <div style={styles.inputArea}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Talk to AI..."
            style={{ ...styles.input, marginTop: 0 }}
          />

          <button
            onClick={sendToAI}
            disabled={loadingAI}
            style={styles.btn}
          >
            {loadingAI ? "Processing..." : "Send to AI"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const styles = {
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    padding: 20,
    background: "#f6f8fb",
    minHeight: "100vh",
    fontFamily: "Arial",
  },
  left: {
    flex: "1 1 600px",
    background: "white",
    padding: 20,
    borderRadius: 12,
  },
  right: {
    flex: "1 1 350px",
    background: "white",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    height: "80vh",
  },
  inputArea: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
  },
  title: { marginBottom: 10 },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  row: { display: "flex", gap: 10 },
  btn: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
  aiBox: {
    marginTop: 15,
    padding: 12,
    background: "#eef7ff",
    borderRadius: 10,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
  },
  typing: { fontSize: 12, color: "#888" },
  error: {
    background: "#ffe6e6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "red",
  },
};