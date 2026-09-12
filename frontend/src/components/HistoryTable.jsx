export default function HistoryTable({ history }) {
  if (!history?.length) return null;

  const methodColors = {
    GET:    { color: "#059669", bg: "#ecfdf5" },
    POST:   { color: "#0284c7", bg: "#e0f2fe" },
    PUT:    { color: "#d97706", bg: "#fffbeb" },
    PATCH:  { color: "#7c3aed", bg: "#f5f3ff" },
    DELETE: { color: "#e11d48", bg: "#fff1f2" },
  };

  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>🕓</span>
        <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>Test History</span>
        <span style={{ marginLeft: "auto", fontSize: 11, background: "var(--accent-light)", color: "var(--accent)", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>
          {history.length} runs
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Endpoint", "Method", "Mode", "Reqs", "Min", "Avg", "Max", "Success", "When"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((r, i) => {
              const mc = methodColors[r.method] || methodColors.GET;
              return (
                <tr key={i}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  style={{ transition: "background 0.15s" }}
                >
                  <td style={{ padding: "12px 16px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--accent)", borderBottom: "1px solid #f1f5f9" }} title={r.api_url}>
                    {r.api_url}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", borderRadius: 6, padding: "3px 8px", background: mc.bg, color: mc.color }}>
                      {r.method || "GET"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "2px 10px", background: r.mode === "concurrent" ? "#e0f2fe" : "#f5f3ff", color: r.mode === "concurrent" ? "#0284c7" : "#7c3aed" }}>
                      {r.mode === "concurrent" ? "⚡ Conc" : "⏩ Seq"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", color: "var(--text)", borderBottom: "1px solid #f1f5f9" }}>{r.num_requests}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#059669", borderBottom: "1px solid #f1f5f9" }}>{r.min_latency.toFixed(1)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)", borderBottom: "1px solid #f1f5f9" }}>{r.avg_latency.toFixed(1)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#d97706", borderBottom: "1px solid #f1f5f9" }}>{r.max_latency.toFixed(1)}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, background: r.success_rate === 100 ? "#ecfdf5" : r.success_rate >= 80 ? "#fffbeb" : "#fef2f2", color: r.success_rate === 100 ? "#059669" : r.success_rate >= 80 ? "#d97706" : "#dc2626" }}>
                      {r.success_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 12, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                    {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}