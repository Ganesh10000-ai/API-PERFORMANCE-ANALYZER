import { useState, useEffect } from "react";
import TestForm from "./components/TestForm";
import MetricsCards from "./components/MetricsCards";
import LatencyChart from "./components/LatencyChart";
import HistoryTable from "./components/HistoryTable";
import { runTest, getHistory } from "./api";
import { exportToCSV } from "./utils/exportCSV";

export default function App() {
  const [result, setResult]       = useState(null);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [exported, setExported]   = useState(false);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => { getHistory().then(setHistory).catch(() => {}); }, []);

  const handleSubmit = async (url, num, mode, thresh, method, body) => {
  setLoading(true); setError(null); setExported(false);
  setThreshold(thresh || 0);
  try {
    const data = await runTest(url, num, mode, method, body);
    setResult(data);
    const h = await getHistory();
    setHistory(h);
  } catch (e) {
    setError(e.response?.data?.detail || "Test failed. Check the URL and try again.");
  } finally {
    setLoading(false);
  }
};

  const handleExport = () => {
    if (!result) return;
    exportToCSV(result);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "36px 20px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 8 }}>
          <div style={{ width: 44, height: 44, background: "#e0f2fe", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 12px rgba(2,132,199,0.15)" }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>API Performance Analyzer</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Measure latency, success rate & response patterns of any HTTP endpoint</p>
          </div>
        </div>

        {/* Test Form Card */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 16 }}>
            Configure Test
          </div>
          <TestForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div style={{ marginTop: 14, padding: "10px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background: "#e0f2fe", borderRadius: "var(--radius)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #bae6fd" }}>
            <span style={{ fontSize: 18, animation: "spin 1s linear infinite" }}>🔄</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--accent)" }}>Running performance test…</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Sending requests and measuring response times</div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                Latest Results
              </span>
              <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
              <button
                onClick={handleExport}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                  border: exported ? "1.5px solid #059669" : "1.5px solid var(--border)",
                  background: exported ? "#ecfdf5" : "var(--surface)",
                  color: exported ? "#059669" : "var(--text-muted)",
                  fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => { if (!exported) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}}
                onMouseLeave={e => { if (!exported) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}}
              >
                {exported ? "✓ Downloaded!" : "⬇ Export CSV"}
              </button>
            </div>

            <MetricsCards result={result} />
            <LatencyChart latencies={result.latencies} threshold={threshold} />
          </>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", marginBottom: 6 }}>No test results yet</div>
            <div style={{ fontSize: 13 }}>Enter an API URL above and click Run Test to begin</div>
          </div>
        )}

        <HistoryTable history={history} />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}