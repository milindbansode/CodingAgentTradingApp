// ─── App Controller ────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ── State ──────────────────────────────────────────────────────────────────
  let state = {
    budget: 300,
    activeFilter: "all",
    activeActionFilter: "all",
  };

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const budgetSlider = document.getElementById("budgetSlider");
  const budgetDisplay = document.getElementById("budgetDisplay");
  const budgetInput = document.getElementById("budgetInput");
  const dateDisplay = document.getElementById("dateDisplay");
  const recContainer = document.getElementById("recommendations");
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modalClose");
  const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
  const actionFilterBtns = document.querySelectorAll(".filter-btn[data-action]");
  const summaryBudget = document.getElementById("summaryBudget");
  const summaryCount = document.getElementById("summaryCount");
  const summaryBuys = document.getElementById("summaryBuys");
  const summarySells = document.getElementById("summarySells");

  // ── Helpers ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtCurrency(n) {
    return "₹" + fmt(n);
  }

  function today() {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // ── Filter logic ──────────────────────────────────────────────────────────
  function getFilteredData() {
    const { STOCKS, FNO } = window.AppData;
    let data = [...STOCKS, ...FNO];

    if (state.activeFilter === "equity") data = data.filter((d) => d.type === "Equity");
    else if (state.activeFilter === "fno") data = data.filter((d) => d.type === "F&O");

    if (state.activeActionFilter === "buy") data = data.filter((d) => d.action === "BUY");
    else if (state.activeActionFilter === "sell") data = data.filter((d) => d.action === "SELL");

    return data;
  }

  // ── Card builder ──────────────────────────────────────────────────────────
  function buildCard(item, index) {
    const { calcQuantity, calcPnL } = window.AppData;
    const qtyInfo = calcQuantity(item, state.budget);
    const pnl = calcPnL(item, qtyInfo);
    const isBuy = item.action === "BUY";
    const absPct = Math.abs(pnl.pct);
    const riskClass = { Low: "risk-low", Medium: "risk-medium", High: "risk-high" }[item.riskLevel];
    const actionClass = isBuy ? "action-buy" : "action-sell";

    const subtitle =
      item.type === "F&O"
        ? item.optionType === "Futures"
          ? `Futures · Expiry: ${item.expiry}`
          : `${item.optionType} ${item.strikePrice} · Expiry: ${item.expiry}`
        : item.sector;

    const priceLabel = item.type === "F&O" && item.optionType !== "Futures" ? "Premium" : "LTP";

    const qtyLabel =
      item.type === "F&O"
        ? `${qtyInfo.qty} ${qtyInfo.unit} (lot size: ${qtyInfo.lotSize})`
        : `${qtyInfo.qty} ${qtyInfo.unit}`;

    return `
      <div class="card" data-index="${index}">
        <div class="card-header">
          <div class="card-title-group">
            <div class="card-symbol">${item.symbol}</div>
            <div class="card-name">${item.name}</div>
            <div class="card-subtitle">${subtitle}</div>
          </div>
          <div class="card-badges">
            <span class="badge badge-type">${item.type}</span>
            <span class="badge ${actionClass}">${item.action}</span>
            <span class="badge ${riskClass}">${item.riskLevel} Risk</span>
          </div>
        </div>

        <div class="card-metrics">
          <div class="metric">
            <span class="metric-label">${priceLabel}</span>
            <span class="metric-value">${fmtCurrency(item.price)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Target</span>
            <span class="metric-value target">${fmtCurrency(item.target)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Stop Loss</span>
            <span class="metric-value stoploss">${fmtCurrency(item.stopLoss)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Qty (Budget)</span>
            <span class="metric-value">${qtyLabel}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Potential Gain</span>
            <span class="metric-value gain">+₹${pnl.gain} (${absPct}%)</span>
          </div>
          <div class="metric">
            <span class="metric-label">Max Loss</span>
            <span class="metric-value loss">-₹${pnl.loss}</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="why-btn" data-index="${index}" aria-label="Why this recommendation?">
            💡 Why this recommendation?
          </button>
        </div>
      </div>
    `;
  }

  // ── Summary stats ──────────────────────────────────────────────────────────
  function updateSummary(data) {
    const buys = data.filter((d) => d.action === "BUY").length;
    const sells = data.filter((d) => d.action === "SELL").length;
    summaryBudget.textContent = fmtCurrency(state.budget);
    summaryCount.textContent = data.length;
    summaryBuys.textContent = buys;
    summarySells.textContent = sells;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function render() {
    const allItems = [...window.AppData.STOCKS, ...window.AppData.FNO];
    const filtered = getFilteredData();

    updateSummary(filtered);

    if (filtered.length === 0) {
      recContainer.innerHTML = `<p class="empty-state">No recommendations match the selected filters.</p>`;
      return;
    }

    recContainer.innerHTML = filtered
      .map((item) => {
        const originalIndex = allItems.indexOf(item);
        return buildCard(item, originalIndex);
      })
      .join("");

    // Attach why-btn listeners
    recContainer.querySelectorAll(".why-btn").forEach((btn) => {
      btn.addEventListener("click", () => openModal(Number(btn.dataset.index)));
    });
  }

  // ── Modal ──────────────────────────────────────────────────────────────────
  function openModal(index) {
    const allItems = [...window.AppData.STOCKS, ...window.AppData.FNO];
    const item = allItems[index];
    if (!item) return;

    const isBuy = item.action === "BUY";

    const analysisHTML = buildAnalysisHTML(item);
    const reasonsHTML = item.reasons
      .map((r, i) => `<li class="reason-item"><span class="reason-num">${i + 1}</span>${r}</li>`)
      .join("");

    document.getElementById("modalTitle").textContent = `${item.symbol} – ${item.name}`;
    document.getElementById("modalSubtitle").textContent =
      item.type === "F&O"
        ? `${item.optionType !== "Futures" ? item.optionType + " " + item.strikePrice + " · " : ""}${item.type} · Expiry: ${item.expiry}`
        : `${item.type} · ${item.sector}`;

    document.getElementById("modalAction").textContent = item.action;
    document.getElementById("modalAction").className = `modal-action-badge ${isBuy ? "action-buy" : "action-sell"}`;
    document.getElementById("modalAnalysis").innerHTML = analysisHTML;
    document.getElementById("modalReasons").innerHTML = `<ul class="reasons-list">${reasonsHTML}</ul>`;

    modal.classList.add("visible");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-box").focus();
  }

  function buildAnalysisHTML(item) {
    const rows = Object.entries(item.analysis).map(([key, val]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return `<tr><td class="analysis-key">${label}</td><td class="analysis-val">${val}</td></tr>`;
    });
    return `<table class="analysis-table"><tbody>${rows.join("")}</tbody></table>`;
  }

  function closeModal() {
    modal.classList.remove("visible");
    document.body.classList.remove("modal-open");
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  function init() {
    // Date
    dateDisplay.textContent = today();

    // Budget controls
    budgetSlider.value = state.budget;
    budgetInput.value = state.budget;
    budgetDisplay.textContent = fmtCurrency(state.budget);

    budgetSlider.addEventListener("input", () => {
      const val = Number(budgetSlider.value);
      state.budget = val;
      budgetInput.value = val;
      budgetDisplay.textContent = fmtCurrency(val);
      render();
    });

    budgetInput.addEventListener("change", () => {
      let val = Number(budgetInput.value);
      val = Math.min(500, Math.max(100, val));
      state.budget = val;
      budgetSlider.value = val;
      budgetInput.value = val;
      budgetDisplay.textContent = fmtCurrency(val);
      render();
    });

    // Type filters
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeFilter = btn.dataset.filter;
        render();
      });
    });

    // Action filters
    actionFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        actionFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeActionFilter = btn.dataset.action;
        render();
      });
    });

    // Modal close
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
