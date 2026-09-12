export function exportToCSV(result) {
  // ── Summary sheet ──────────────────────────────────────────
  const summaryHeaders = [
    "API URL", "Mode", "Total Requests", "Min Latency (ms)",
    "Avg Latency (ms)", "P95 Latency (ms)", "P99 Latency (ms)",
    "Max Latency (ms)", "Success Rate (%)", "Timestamp"
  ];

  const summaryRow = [
    result.api_url,
    result.mode,
    result.num_requests,
    result.min_latency.toFixed(2),
    result.avg_latency.toFixed(2),
    result.p95_latency.toFixed(2),
    result.p99_latency.toFixed(2),
    result.max_latency.toFixed(2),
    result.success_rate.toFixed(2),
    new Date(result.timestamp).toLocaleString(),
  ];

  // ── Per-request sheet ──────────────────────────────────────
  const requestHeaders = ["Request #", "Latency (ms)", "Status"];

  const requestRows = result.latencies.map((latency, i) => [
    i + 1,
    latency.toFixed(2),
    latency > 0 ? "Success" : "Failed",
  ]);

  // ── Build CSV string ───────────────────────────────────────
  const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;

  const lines = [
    "SUMMARY",
    summaryHeaders.map(escape).join(","),
    summaryRow.map(escape).join(","),
    "",
    "PER-REQUEST BREAKDOWN",
    requestHeaders.map(escape).join(","),
    ...requestRows.map(row => row.map(escape).join(",")),
  ];

  const csvContent = lines.join("\n");

  // ── Trigger download ───────────────────────────────────────
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const host = result.api_url.replace(/https?:\/\//, "").split("/")[0];
    const date = new Date(result.timestamp);
    const datePart = date.toISOString().slice(0, 10);                      // 2026-03-07
    const timePart = date.toTimeString().slice(0, 8).replace(/:/g, "-");   // 14-32-24
    const mode = result.mode === "concurrent" ? "CONC" : "SEQ";
    const reqs = `${result.num_requests}req`;
    const avg = `avg${Math.round(result.avg_latency)}ms`;

    const filename = `APM_${host}_${mode}_${reqs}_${avg}_${datePart}_${timePart}.csv`;

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}