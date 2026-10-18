
const $ = id => document.getElementById(id);

async function renderHistory() {
  const list = $("historyList");
  list.replaceChildren();

  const history = await PhishStorage.getHistory();

  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Your scans will appear here.";
    list.appendChild(empty);
    return;
  }

  for (const item of history) {
    const row = document.createElement("div");
    row.className = "history-item";

    const address = document.createElement("strong");
    address.textContent = item.url;

    const meta = document.createElement("div");
    meta.className = "history-meta";

    const level = document.createElement("span");
    level.textContent = item.level;

    const score = document.createElement("span");
    score.textContent = `Score: ${item.score}/100`;

    meta.append(level, score);
    row.append(address, meta);
    list.appendChild(row);
  }
}

function renderResult(report) {
  $("result").classList.remove("hidden");
  $("verdict").textContent = report.level;
  $("score").textContent = String(report.score);
  $("resultUrl").textContent = report.url;

  const color = report.score >= 60
    ? "var(--red)"
    : report.score >= 30
      ? "var(--amber)"
      : "var(--green)";

  $("scoreRing").style.borderColor = color;
  $("scoreRing").style.color = color;
  $("scoreBar").style.background = color;
  $("scoreBar").style.width = `${report.score}%`;

  const list = $("signals");
  list.replaceChildren();

  for (const signal of report.signals) {
    const li = document.createElement("li");
    const mark = document.createElement("span");
    const message = document.createElement("span");

    mark.className = "signal-mark";
    mark.textContent = signal.risky ? "!" : "✓";
    message.textContent = signal.message;

    if (!signal.risky) li.classList.add("signal-good");

    li.append(mark, message);
    list.appendChild(li);
  }
}

async function scanUrl(value) {
  const button = $("scanBtn");
  button.disabled = true;
  $("status").textContent = "Analyzing URL...";

  try {
    const parsed = UrlAnalyzer.parse(value);
    const analysis = RiskEngine.analyze(parsed);

    const report = {
      ...analysis,
      url: parsed.href
    };

    renderResult(report);
    await PhishStorage.save(report);
    await renderHistory();

    $("status").textContent = "Analysis complete.";
  } catch (error) {
    $("status").textContent =
      error.message || "Unable to analyze this URL.";
  } finally {
    button.disabled = false;
  }
}

$("scanBtn").addEventListener("click", () => {
  scanUrl($("urlInput").value);
});

$("urlInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    scanUrl($("urlInput").value);
  }
});

$("clearHistory").addEventListener("click", async () => {
  try {
    await PhishStorage.clear();
    await renderHistory();
    $("status").textContent = "Scan history cleared.";
  } catch {
    $("status").textContent = "Could not clear scan history.";
  }
});

async function initialize() {
  try {
    await renderHistory();

    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });

    if (tab?.url && /^https?:/i.test(tab.url)) {
      $("urlInput").value = tab.url;
      $("status").textContent =
        "Active tab detected. Ready to scan.";
    } else {
      $("status").textContent = "Enter a website URL to begin.";
    }
  } catch {
    $("status").textContent = "Ready to analyze.";
  }
}

initialize();
