const cards = [
  { key: "min_latency",  label: "Min Latency",  unit: "ms",  color: "#059669", bg: "#ecfdf5", icon: "▼" },
  { key: "avg_latency",  label: "Avg Latency",  unit: "ms",  color: "#0284c7", bg: "#e0f2fe", icon: "◆" },
  { key: "p95_latency",  label: "P95 Latency",  unit: "ms",  color: "#0891b2", bg: "#ecfeff", icon: "95" },
  { key: "p99_latency",  label: "P99 Latency",  unit: "ms",  color: "#e11d48", bg: "#fff1f2", icon: "99" },
  { key: "max_latency",  label: "Max Latency",  unit: "ms",  color: "#d97706", bg: "#fffbeb", icon: "▲" },
  { key: "success_rate", label: "Success Rate", unit: "%",   color: "#7c3aed", bg: "#f5f3ff", icon: "✓" },
  { key: "num_requests", label: "Total Reqs",   unit: "req", color: "#64748b", bg: "#f8fafc", icon: "#" },
];

function MetricCard({ label, value, unit, color, bg, icon }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 14,
        padding: "18px 20px",
        border: `1.5px solid ${color}22`,
        boxShadow: `0 2px 12px ${color}12`,
        transition: "transform 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
          textTransform: "uppercase", letterSpacing: "0.07em"
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 11, color, fontWeight: 700,
          background: `${color}18`, borderRadius: 6, padding: "2px 7px"
        }}>
          {icon}
        </span>
      </div>
      <div style={{
        color, fontSize: 26, fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace", lineHeight: 1
      }}>
        {typeof value === "number" ? value.toFixed(unit === "req" ? 0 : 1) : "—"}
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginLeft: 4 }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function MetricsCards({ result }) {
  if (!result) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Row 1: latency cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {cards.slice(0, 5).map(({ key, label, unit, color, bg, icon }) => (
          <MetricCard
            key={key}
            label={label}
            value={result[key]}
            unit={unit}
            color={color}
            bg={bg}
            icon={icon}
          />
        ))}
      </div>

      {/* Row 2: success rate + total requests */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {cards.slice(5).map(({ key, label, unit, color, bg, icon }) => (
          <MetricCard
            key={key}
            label={label}
            value={result[key]}
            unit={unit}
            color={color}
            bg={bg}
            icon={icon}
          />
        ))}
      </div>

      {/* P95 / P99 explanation banner */}
      <div style={{
        padding: "10px 16px", borderRadius: 10, fontSize: 12,
        background: "#fff1f2", border: "1px solid #fecdd3", color: "#9f1239",
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>💡 P95 / P99</span>
        <span style={{ color: "#be123c" }}>
          95% of requests completed within{" "}
          <strong>{result.p95_latency?.toFixed(1)}ms</strong>, 99% within{" "}
          <strong>{result.p99_latency?.toFixed(1)}ms</strong>.
          High P99 signals tail latency issues that averages hide.
        </span>
      </div>

    </div>
  );
}