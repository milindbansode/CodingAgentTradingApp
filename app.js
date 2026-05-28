const STORAGE_KEY = "trading-research-workspace-v1";
const SLOT_COUNT = 20;

function createResearchRow(kind) {
  return {
    symbol: "",
    thesis: "",
    entry: "",
    stop: "",
    target: "",
    capital: "",
    exitPlan: "",
    notes: "",
    kind,
  };
}

function createDefaultMarketState() {
  return {
    equities: Array.from({ length: SLOT_COUNT }, () => createResearchRow("equity")),
    derivatives: Array.from({ length: SLOT_COUNT }, () => createResearchRow("derivative")),
    shortTermNotes: "",
    catalystNotes: "",
  };
}

function createDefaultState() {
  return {
    us: createDefaultMarketState(),
    india: createDefaultMarketState(),
    journal: [],
  };
}

function normalizeMarketState(savedMarket = {}) {
  const defaults = createDefaultMarketState();
  const normalizeRows = (rows, kind) =>
    Array.from({ length: SLOT_COUNT }, (_, index) => ({
      ...createResearchRow(kind),
      ...(rows?.[index] ?? {}),
    }));

  return {
    ...defaults,
    ...savedMarket,
    equities: normalizeRows(savedMarket.equities, "equity"),
    derivatives: normalizeRows(savedMarket.derivatives, "derivative"),
  };
}

function loadState() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return createDefaultState();
    }

    const savedState = JSON.parse(rawState);
    return {
      ...createDefaultState(),
      ...savedState,
      us: normalizeMarketState(savedState.us),
      india: normalizeMarketState(savedState.india),
      journal: Array.isArray(savedState.journal) ? savedState.journal : [],
    };
  } catch (error) {
    console.warn("Failed to load saved data", error);
    return createDefaultState();
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseAmount(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value, currency = "$") {
  return `${currency}${value.toFixed(2)}`;
}

function computeJournalPnl(entry) {
  const quantity = parseAmount(entry.quantity);
  const entryPrice = parseAmount(entry.entryPrice);
  const exitPrice = parseAmount(entry.exitPrice);
  const priceDelta = entry.direction === "Short" ? entryPrice - exitPrice : exitPrice - entryPrice;
  return quantity * priceDelta;
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll(`"`, `""`)}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderMarketBoard(marketKey, targetId, titlePrefix) {
  const market = state[marketKey];
  const target = document.getElementById(targetId);
  const filledEquities = market.equities.filter((row) => row.symbol || row.thesis).length;
  const filledDerivatives = market.derivatives.filter((row) => row.symbol || row.thesis).length;
  const plannedCapital = [...market.equities, ...market.derivatives].reduce(
    (sum, row) => sum + parseAmount(row.capital),
    0,
  );

  target.innerHTML = `
    <div class="card-grid">
      <article class="board-panel">
        <h3>${titlePrefix} board summary</h3>
        <div class="board-meta">
          <div class="board-pill">
            <span>Equity ideas used</span>
            <strong>${filledEquities}/${SLOT_COUNT}</strong>
          </div>
          <div class="board-pill">
            <span>F&amp;O ideas used</span>
            <strong>${filledDerivatives}/${SLOT_COUNT}</strong>
          </div>
          <div class="board-pill">
            <span>Planned capital</span>
            <strong>${formatMoney(plannedCapital)}</strong>
          </div>
        </div>
      </article>
      <article class="board-panel">
        <h3>Short-term notes</h3>
        <label>
          <textarea data-market="${marketKey}" data-notes="shortTermNotes" placeholder="Track momentum names, sector rotations, swing-trade ideas, and your own watchlist notes.">${market.shortTermNotes}</textarea>
        </label>
      </article>
      <article class="board-panel">
        <h3>Catalysts &amp; review checklist</h3>
        <label>
          <textarea data-market="${marketKey}" data-notes="catalystNotes" placeholder="Track earnings, macro events, expiry dates, RBI/Fed updates, and your next-day review notes.">${market.catalystNotes}</textarea>
        </label>
      </article>
    </div>
    ${renderResearchTable(marketKey, "equities", `${titlePrefix} equity research slots`)}
    ${renderResearchTable(marketKey, "derivatives", `${titlePrefix} futures/options research slots`)}
  `;
}

function renderResearchTable(marketKey, tableKey, title) {
  const rows = state[marketKey][tableKey];

  return `
    <article class="board-panel">
      <h3>${title}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Symbol / Contract</th>
              <th>Research thesis</th>
              <th>Entry zone</th>
              <th>Stop</th>
              <th>Target</th>
              <th>Capital</th>
              <th>Exit rule</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="symbol" value="${escapeHtml(row.symbol)}" placeholder="Ticker / contract" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="thesis" value="${escapeHtml(row.thesis)}" placeholder="Setup or reason" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="entry" value="${escapeHtml(row.entry)}" placeholder="Entry level" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="stop" value="${escapeHtml(row.stop)}" placeholder="Risk limit" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="target" value="${escapeHtml(row.target)}" placeholder="Target level" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="capital" value="${escapeHtml(row.capital)}" placeholder="Planned amount" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="exitPlan" value="${escapeHtml(row.exitPlan)}" placeholder="When to exit" /></td>
                    <td><input data-market="${marketKey}" data-table="${tableKey}" data-index="${index}" data-field="notes" value="${escapeHtml(row.notes)}" placeholder="Extra notes" /></td>
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll(`"`, "&quot;");
}

function renderJournal() {
  const journalRows = document.getElementById("journal-rows");
  const totalPnl = state.journal.reduce((sum, entry) => sum + computeJournalPnl(entry), 0);
  const averagePnl = state.journal.length ? totalPnl / state.journal.length : 0;

  document.getElementById("journal-count").textContent = String(state.journal.length);
  document.getElementById("journal-total-pnl").textContent = formatMoney(totalPnl);
  document.getElementById("journal-avg-pnl").textContent = formatMoney(averagePnl);
  document.getElementById("journal-pnl").textContent = formatMoney(totalPnl);

  journalRows.innerHTML = state.journal
    .map((entry, index) => {
      const pnl = computeJournalPnl(entry);
      const pnlClass = pnl >= 0 ? "pnl-positive" : "pnl-negative";

      return `
        <tr>
          <td>${escapeHtml(entry.tradeDate)}</td>
          <td>${escapeHtml(entry.market)}</td>
          <td>${escapeHtml(entry.instrumentType)}</td>
          <td>${escapeHtml(entry.symbol)}</td>
          <td>${escapeHtml(entry.direction)}</td>
          <td>${escapeHtml(entry.quantity)}</td>
          <td>${escapeHtml(entry.entryPrice)}</td>
          <td>${escapeHtml(entry.exitPrice)}</td>
          <td class="${pnlClass}">${formatMoney(pnl)}</td>
          <td>${escapeHtml(entry.notes)}</td>
          <td><button class="inline-delete" data-journal-delete="${index}">Delete</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderOverview() {
  const researchRows = [
    ...state.us.equities,
    ...state.us.derivatives,
    ...state.india.equities,
    ...state.india.derivatives,
  ];
  const filledCount = researchRows.filter((row) => row.symbol || row.thesis).length;
  document.getElementById("filled-slot-count").textContent = String(filledCount);
  document.getElementById("total-slot-count").textContent = String(SLOT_COUNT * 4);
}

function renderApp() {
  renderMarketBoard("us", "us-market-content", "US");
  renderMarketBoard("india", "india-market-content", "India");
  renderJournal();
  renderOverview();
}

function updateResearchField(input) {
  const { market, table, index, field } = input.dataset;
  if (!market || !table || index === undefined || !field) {
    return;
  }

  state[market][table][Number(index)][field] = input.value;
  saveState();
  renderApp();
}

function updateNotesField(element) {
  const { market, notes } = element.dataset;
  if (!market || !notes) {
    return;
  }

  state[market][notes] = element.value;
  saveState();
}

function handleTabClick(button) {
  const targetId = button.dataset.tabTarget;
  document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  button.classList.add("active");
  document.getElementById(targetId)?.classList.add("active");
}

function handleJournalSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.journal.unshift({
    tradeDate: form.get("tradeDate"),
    market: form.get("market"),
    instrumentType: form.get("instrumentType"),
    symbol: form.get("symbol"),
    direction: form.get("direction"),
    quantity: form.get("quantity"),
    entryPrice: form.get("entryPrice"),
    exitPrice: form.get("exitPrice"),
    notes: form.get("notes"),
  });

  saveState();
  event.currentTarget.reset();
  renderApp();
}

function exportResearch(marketKey) {
  const marketLabel = marketKey === "us" ? "us" : "india";
  const rows = [["Section", "Slot", "Symbol", "Thesis", "Entry", "Stop", "Target", "Capital", "Exit Rule", "Notes"]];
  ["equities", "derivatives"].forEach((tableKey) => {
    state[marketKey][tableKey].forEach((row, index) => {
      rows.push([
        tableKey,
        index + 1,
        row.symbol,
        row.thesis,
        row.entry,
        row.stop,
        row.target,
        row.capital,
        row.exitPlan,
        row.notes,
      ]);
    });
  });
  rows.push(["notes", "", "shortTermNotes", state[marketKey].shortTermNotes, "", "", "", "", "", ""]);
  rows.push(["notes", "", "catalystNotes", state[marketKey].catalystNotes, "", "", "", "", "", ""]);
  downloadCsv(`${marketLabel}-research-board.csv`, rows);
}

function exportJournal() {
  const rows = [["Trade Date", "Market", "Type", "Symbol", "Direction", "Quantity", "Entry", "Exit", "P&L", "Notes"]];
  state.journal.forEach((entry) => {
    rows.push([
      entry.tradeDate,
      entry.market,
      entry.instrumentType,
      entry.symbol,
      entry.direction,
      entry.quantity,
      entry.entryPrice,
      entry.exitPrice,
      computeJournalPnl(entry).toFixed(2),
      entry.notes,
    ]);
  });
  downloadCsv("paper-trade-journal.csv", rows);
}

function clearLocalData() {
  const confirmed = window.confirm("Clear all saved research boards and journal entries?");
  if (!confirmed) {
    return;
  }

  state = createDefaultState();
  saveState();
  renderApp();
}

document.addEventListener("click", (event) => {
  const tabButton = event.target.closest(".tab-button");
  if (tabButton) {
    handleTabClick(tabButton);
  }

  const exportButton = event.target.closest(".export-research");
  if (exportButton) {
    exportResearch(exportButton.dataset.market);
  }

  const journalDeleteIndex = event.target.dataset.journalDelete;
  if (journalDeleteIndex !== undefined) {
    state.journal.splice(Number(journalDeleteIndex), 1);
    saveState();
    renderApp();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-market][data-table][data-index][data-field]")) {
    updateResearchField(target);
  }

  if (target.matches("textarea[data-market][data-notes]")) {
    updateNotesField(target);
  }
});

document.getElementById("journal-form").addEventListener("submit", handleJournalSubmit);
document.getElementById("export-journal").addEventListener("click", exportJournal);
document.getElementById("clear-storage").addEventListener("click", clearLocalData);

renderApp();
