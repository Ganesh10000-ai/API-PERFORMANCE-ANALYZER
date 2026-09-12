import { useState } from "react";

export default function TestForm({ onSubmit, loading }) {
  const [url, setUrl]             = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [num, setNum]             = useState(10);
  const [mode, setMode]           = useState("concurrent");
  const [threshold, setThreshold] = useState(1000);
  const [method, setMethod]       = useState("GET");
  const [body, setBody]           = useState(`{\n  "title": "test",\n  "body": "hello",\n  "userId": 1\n}`);
  const [bodyError, setBodyError] = useState(null);

  const showBody = ["POST", "PUT", "PATCH"].includes(method);

  const handleMethodChange = (m) => {
    setMethod(m);
    setBodyError(null);
  };

  const handle = (e) => {
    e.preventDefault();
    setBodyError(null);

    let parsedBody = null;
    if (showBody && body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setBodyError("Invalid JSON — please fix the request body before running.");
        return;
      }
    }
    onSubmit(url, parseInt(num), mode, parseInt(threshold), method, parsedBody);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    borderRadius: 10, border: "1.5px solid var(--border)",
    background: "var(--surface)", color: "var(--text)",
    fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
    outline: "none", transition: "border 0.2s",
  };

  const focusIn  = e => e.target.style.borderColor = "var(--accent)";
  const focusOut = e => e.target.style.borderColor = "var(--border)";

  const methodColors = {
    GET:    { color: "#059669", bg: "#ecfdf5", border: "#bbf7d0" },
    POST:   { color: "#0284c7", bg: "#e0f2fe", border: "#bae6fd" },
    PUT:    { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    PATCH:  { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    DELETE: { color: "#e11d48", bg: "#fff1f2", border: "#fecdd3" },
  };

  return (
    <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Row 1: Method selector */}
      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          HTTP Method
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => {
            const active = method === m;
            const c = methodColors[m];
            return (
              <button key={m} type="button" onClick={() => handleMethodChange(m)}
                style={{
                  padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                  border: active ? `2px solid ${c.color}` : `2px solid var(--border)`,
                  background: active ? c.bg : "var(--surface)",
                  color: active ? c.color : "var(--text-muted)",
                  transition: "all 0.15s",
                  boxShadow: active ? `0 2px 8px ${c.color}22` : "none",
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: URL + Requests + Threshold */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>

        {/* Method badge + URL */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            API Endpoint URL
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{
              position: "absolute", left: 12, fontSize: 11, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: methodColors[method].color,
              background: methodColors[method].bg,
              border: `1px solid ${methodColors[method].border}`,
              borderRadius: 5, padding: "2px 6px", pointerEvents: "none",
              zIndex: 1,
            }}>
              {method}
            </span>
            <input
              value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              required
              style={{ ...inputStyle, paddingLeft: method.length * 8 + 28 }}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        <div style={{ width: 100 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Requests
          </label>
          <input
            type="number" value={num} onChange={e => setNum(e.target.value)}
            min={1} max={100} style={inputStyle}
            onFocus={focusIn} onBlur={focusOut}
          />
        </div>

        <div style={{ width: 130 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#e11d48", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            ⚠ SLA Threshold
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number" value={threshold} onChange={e => setThreshold(e.target.value)}
              min={1} placeholder="1000"
              style={{ ...inputStyle, borderColor: "#fecdd3", paddingRight: 36 }}
              onFocus={e => e.target.style.borderColor = "#e11d48"}
              onBlur={e => e.target.style.borderColor = "#fecdd3"}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#e11d48", fontWeight: 600, pointerEvents: "none" }}>
              ms
            </span>
          </div>
        </div>

      </div>

      {/* Request body — only for POST / PUT / PATCH */}
      {showBody && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Request Body <span style={{ color: "#94a3b8", textTransform: "none", fontWeight: 400 }}>(JSON)</span>
          </label>
          <textarea
            value={body}
            onChange={e => { setBody(e.target.value); setBodyError(null); }}
            rows={5}
            placeholder={'{\n  "key": "value"\n}'}
            style={{
              ...inputStyle,
              resize: "vertical", lineHeight: 1.6,
              borderColor: bodyError ? "#e11d48" : "var(--border)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
            onFocus={focusIn} onBlur={focusOut}
          />
          {bodyError && (
            <div style={{ marginTop: 6, fontSize: 12, color: "#e11d48", display: "flex", alignItems: "center", gap: 6 }}>
              ⚠ {bodyError}
            </div>
          )}
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
            This body will be sent with every {method} request as <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>Content-Type: application/json</code>
          </div>
        </div>
      )}

      {/* Row 3: Mode toggle + Run button */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Execution Mode
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { value: "concurrent", label: "⚡ Concurrent", desc: "All at once", color: "#0284c7", bg: "#e0f2fe" },
              { value: "sequential", label: "⏩ Sequential",  desc: "One by one",  color: "#7c3aed", bg: "#f5f3ff" },
            ].map(opt => {
              const active = mode === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setMode(opt.value)}
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                    border: active ? `2px solid ${opt.color}` : "2px solid var(--border)",
                    background: active ? opt.bg : "var(--surface)",
                    transition: "all 0.18s", textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? opt.color : "var(--text-muted)" }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{
            padding: "11px 28px", borderRadius: 10, alignSelf: "flex-end",
            background: loading ? "var(--border)" : "var(--accent)",
            color: loading ? "var(--text-muted)" : "#fff",
            border: "none", fontWeight: 600, fontSize: 13,
            fontFamily: "'Sora', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap",
            boxShadow: loading ? "none" : "0 4px 14px rgba(2,132,199,0.25)",
          }}
        >
          {loading ? "⏳ Testing…" : "▶ Run Test"}
        </button>
      </div>

      {/* Mode explanation banner */}
      <div style={{
        padding: "10px 14px", borderRadius: 10, fontSize: 12,
        background: mode === "concurrent" ? "#e0f2fe" : "#f5f3ff",
        color: mode === "concurrent" ? "#0369a1" : "#6d28d9",
        border: `1px solid ${mode === "concurrent" ? "#bae6fd" : "#ddd6fe"}`,
      }}>
        {mode === "concurrent"
          ? "⚡ All requests fire simultaneously — simulates real user load."
          : "⏩ Requests fire one after another — simulates a single user's experience."}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </form>
  );
}