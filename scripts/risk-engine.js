
const RiskEngine = (() => {
  const MAX_SCORE = 100;

  function analyze(url) {
    let score = 0;
    const signals = [];

    function add(points, message) {
      score += points;
      signals.push({ risky: true, points, message });
    }

    function note(message) {
      signals.push({ risky: false, points: 0, message });
    }

    const host = url.hostname;
    const pathAndQuery = `${url.pathname} ${url.search}`;

    if (url.protocol !== "https:") {
      add(15, "Connection uses HTTP, not HTTPS.");
    } else {
      note("HTTPS is used; encryption does not establish trust.");
    }

    if (url.isIpv4) {
      add(25, "The hostname is an IPv4 address.");
    }

    if (url.isPunycode) {
      add(20, "The hostname contains a punycode label.");
    }

    if (host.length > 45) {
      add(10, "Hostname is unusually long.");
    }

    if (url.labels.length >= 5) {
      add(10, "Hostname has many labels or subdomains.");
    }

    if (url.port && !["80", "443"].includes(url.port)) {
      add(10, "URL specifies a non-standard web port.");
    }

    if (/@/.test(url.href)) {
      add(15, "URL contains an @ character.");
    }

    if (/\b(login|verify|account|password|wallet|signin)\b/i.test(pathAndQuery)) {
      add(10, "Path or query contains account-related keywords.");
    }

    if (host.split("-").length >= 5) {
      add(5, "Hostname contains many hyphen-separated segments.");
    }

    score = Math.min(score, MAX_SCORE);

    if (!signals.some(signal => signal.risky)) {
      note("No configured warning patterns were detected.");
    }

    const level = score >= 60
      ? "High risk"
      : score >= 30
        ? "Medium risk"
        : "Lower risk";

    return {
      score,
      level,
      signals,
      analyzedAt: new Date().toISOString(),
      disclaimer: "Heuristic assessment, not a verdict on site safety."
    };
  }

  return { analyze };
})();

if (typeof globalThis !== "undefined") {
  globalThis.RiskEngine = RiskEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = RiskEngine;
}