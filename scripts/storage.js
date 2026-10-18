
const PhishStorage = (() => {
  const KEY = "phishshield_history";
  const MAX_ITEMS = 8;

  async function getHistory() {
    const result = await chrome.storage.local.get(KEY);
    return Array.isArray(result[KEY]) ? result[KEY] : [];
  }

  async function save(report) {
    const history = await getHistory();

    const entry = {
      url: report.url,
      score: report.score,
      level: report.level,
      signals: report.signals,
      timestamp: Date.now()
    };

    await chrome.storage.local.set({
      [KEY]: [entry, ...history].slice(0, MAX_ITEMS)
    });
  }

  async function clear() {
    await chrome.storage.local.remove(KEY);
  }

  return { getHistory, save, clear };
})();

if (typeof globalThis !== "undefined") {
  globalThis.PhishStorage = PhishStorage;
}
