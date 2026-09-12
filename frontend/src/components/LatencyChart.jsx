import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Cell
} from "recharts";

const CustomTooltip = ({ active, payload, threshold }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const breached = threshold && val > threshold;
  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${breached ? "#fecdd3" : "var(--border)"}`,
      borderRadius: 10, padding: "8px 14px", fontSize: 12,
      color: "var(--text)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
        color: breached ? "#e11d48" : "var(--accent)"
      }}>
        {val.toFixed(2)} ms
      </div>
      {breached && (
        <div style={{ color: "#e11d48", fontSize: 11, marginTop: 3 }}>
          ⚠ Exceeds {threshold}ms SLA
        </div>
      )}
    </div>
  );
};

export default function LatencyChart({ latencies, threshold }) {
  if (!latencies?.length) return null;

  const data = latencies.map((v, i) => ({
    req: `${i + 1}`,
    ms: parseFloat(v.toFixed(2)),
  }));

  const avg = data.reduce((s, d) => s + d.ms, 0) / data.length;
  const breachedCount = threshold ? data.filter(d => d.ms > threshold).length : 0;
  const breachPct = threshold ? ((breachedCount / data.length) * 100).toFixed(1) : 0;

  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--radius)",
      padding: "24px 20px", border: "1.5px solid var(--border)",
      boxShadow: "var(--shadow)"
    }}>

      {/* Chart header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>Latency Per Request</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Response time for each individual request (ms)
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "var(--accent)", background: "var(--accent-light)",
            borderRadius: 8, padding: "4px 12px", fontWeight: 600
          }}>
            avg {avg.toFixed(1)}ms
          </div>
          {threshold > 0 && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: "#e11d48", background: "#fff1f2",
              borderRadius: 8, padding: "4px 12px", fontWeight: 600,
              border: "1px solid #fecdd3"
            }}>
              SLA {threshold}ms
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
          <XAxis dataKey="req" tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} unit="ms" />
          <Tooltip content={<CustomTooltip threshold={threshold} />} cursor={{ fill: "#e0f2fe55" }} />

          {/* Average line */}
          <ReferenceLine y={avg} stroke="#0284c7" strokeDasharray="4 3" strokeWidth={1.5} />

          {/* SLA threshold line */}
          {threshold > 0 && (
            <ReferenceLine
              y={threshold}
              stroke="#e11d48"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: `SLA ${threshold}ms`,
                position: "insideTopRight",
                fill: "#e11d48",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}

          <Bar dataKey="ms" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={threshold && entry.ms > threshold ? "#fda4af" : "#7dd3fc"}
                stroke={threshold && entry.ms > threshold ? "#e11d48" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Breach summary banner — only shows if any requests failed SLA */}
      {threshold > 0 && breachedCount > 0 && (
        <div style={{
          marginTop: 16, padding: "10px 16px", borderRadius: 10,
          background: "#fff1f2", border: "1px solid #fecdd3",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🚨</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e11d48" }}>
              SLA Breach Detected
            </span>
            <span style={{ fontSize: 12, color: "#be123c" }}>
              {breachedCount} of {data.length} requests exceeded {threshold}ms
            </span>
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            fontWeight: 700, color: "#e11d48",
            background: "#fecdd3", borderRadius: 6, padding: "2px 10px"
          }}>
            {breachPct}% breach rate
          </span>
        </div>
      )}

      {/* All clear banner */}
      {threshold > 0 && breachedCount === 0 && (
        <div style={{
          marginTop: 16, padding: "10px 16px", borderRadius: 10,
          background: "#ecfdf5", border: "1px solid #bbf7d0",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>
            All requests within SLA
          </span>
          <span style={{ fontSize: 12, color: "#047857" }}>
            Every request completed under {threshold}ms
          </span>
        </div>
      )}

    </div>
  );
}