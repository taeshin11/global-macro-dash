// app.js - Core rendering, state management, auto-refresh
(function() {
  'use strict';

  // Currency pairs to display
  const CURRENCY_PAIRS = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'GBP' },
    { from: 'USD', to: 'CHF' },
    { from: 'USD', to: 'CAD' },
    { from: 'USD', to: 'AUD' },
    { from: 'EUR', to: 'GBP' },
    { from: 'EUR', to: 'JPY' },
    { from: 'GBP', to: 'JPY' }
  ];

  const FLAGS = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
    'CHF': '🇨🇭', 'CAD': '🇨🇦', 'AUD': '🇦🇺', 'NZD': '🇳🇿',
    'CNY': '🇨🇳', 'KRW': '🇰🇷', 'INR': '🇮🇳', 'BRL': '🇧🇷',
    'US': '🇺🇸', 'EU': '🇪🇺', 'GB': '🇬🇧', 'JP': '🇯🇵',
    'CN': '🇨🇳', 'CA': '🇨🇦', 'AU': '🇦🇺', 'KR': '🇰🇷',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'BR': '🇧🇷', 'IN': '🇮🇳'
  };

  // State
  let refreshInterval = null;
  let countdownInterval = null;
  let countdownSeconds = 300; // 5 minutes
  let macroData = null;
  let sortColumn = null;
  let sortDirection = 'asc';

  // Initialize the application
  async function init() {
    // Apply i18n
    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = I18n.getCurrentLang();
    I18n.applyTranslations();

    // Init analytics
    Analytics.init();

    // Init ads
    Ads.init();

    // Load data
    await loadAllData();

    // Init converter
    Converter.init();

    // Start auto-refresh
    startAutoRefresh();

    // Page Visibility API
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update share links
    updateShareLinks();
  }

  async function loadAllData() {
    try {
      await Promise.all([
        loadCurrencyCards(),
        loadCommodities(),
        loadMacroTable()
      ]);
      updateTimestamp();
    } catch(err) {
      console.error('Error loading data:', err);
    }
  }

  // =====================
  // Currency Pair Cards
  // =====================
  async function loadCurrencyCards() {
    const container = document.getElementById('currency-cards');
    if (!container) return;

    // Get unique base currencies
    const bases = [...new Set(CURRENCY_PAIRS.map(p => p.from))];
    const targetsByBase = {};
    bases.forEach(b => {
      targetsByBase[b] = CURRENCY_PAIRS.filter(p => p.from === b).map(p => p.to);
    });

    // Fetch latest and yesterday rates for all bases
    const ratesData = {};
    const yesterdayData = {};
    const histData = {};

    await Promise.all(bases.map(async (base) => {
      const targets = targetsByBase[base];
      try {
        const [latest, yesterday, hist] = await Promise.all([
          API.fetchLatestRates(base),
          API.fetchYesterdayRates(base, targets),
          API.fetchHistoricalRates(base, targets)
        ]);
        ratesData[base] = latest;
        yesterdayData[base] = yesterday;
        histData[base] = hist;
      } catch(err) {
        console.error(`Error fetching data for ${base}:`, err);
      }
    }));

    // Build cards HTML
    let html = '';
    CURRENCY_PAIRS.forEach((pair, index) => {
      const { from, to } = pair;
      const latestRates = ratesData[from];
      const yesterdayRates = yesterdayData[from];
      const historical = histData[from];

      if (!latestRates || !latestRates.rates[to]) {
        html += buildCardSkeleton(from, to);
        return;
      }

      const currentRate = latestRates.rates[to];
      const prevRate = yesterdayRates && yesterdayRates.rates && yesterdayRates.rates[to]
        ? yesterdayRates.rates[to] : currentRate;

      const change = currentRate - prevRate;
      const changePct = prevRate ? ((change / prevRate) * 100) : 0;
      const isPositive = change >= 0;

      // Get sparkline data
      let sparkData = [];
      if (historical && historical.rates) {
        const dates = Object.keys(historical.rates).sort();
        sparkData = dates.map(d => historical.rates[d][to]).filter(v => v != null);
      }

      const decimals = to === 'JPY' ? 3 : 4;
      const canvasId = `spark-${from}-${to}`;

      html += `
        <div class="rate-card flex flex-col gap-2" role="group" aria-label="${from}/${to} exchange rate">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg" aria-hidden="true">${FLAGS[from] || ''}</span>
              <span class="text-lg" aria-hidden="true">${FLAGS[to] || ''}</span>
              <span class="font-semibold text-sm text-dash-text">${from} / ${to}</span>
            </div>
            <div class="sparkline-container" title="7-day trend for ${from}/${to}">
              <canvas id="${canvasId}" ${sparkData.length ? `data-pending='${JSON.stringify(sparkData)}'` : ''}
                aria-label="7-day trend chart for ${from}/${to} showing ${isPositive ? 'upward' : 'downward'} trend" role="img"></canvas>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-2xl font-mono font-semibold text-dash-text" id="rate-${from}-${to}">${currentRate.toFixed(decimals)}</p>
              <p class="text-xs flex items-center gap-1 ${isPositive ? 'text-dash-positive' : 'text-dash-negative'}"
                 aria-label="${from}/${to} ${isPositive ? 'up' : 'down'} ${Math.abs(changePct).toFixed(2)} percent">
                <span aria-hidden="true">${isPositive ? '▲' : '▼'}</span>
                <span class="font-mono">${isPositive ? '+' : ''}${change.toFixed(decimals)}</span>
                <span class="font-mono">(${isPositive ? '+' : ''}${changePct.toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Render sparklines after DOM update
    if (typeof Chart !== 'undefined') {
      Charts.observeSparklines();
    } else {
      // Wait for Chart.js to load
      window.addEventListener('load', () => Charts.observeSparklines());
    }
  }

  function buildCardSkeleton(from, to) {
    return `
      <div class="rate-card animate-pulse">
        <div class="flex items-center gap-2 mb-2">
          <span>${FLAGS[from] || ''}</span>
          <span>${FLAGS[to] || ''}</span>
          <span class="font-semibold text-sm">${from} / ${to}</span>
        </div>
        <div class="skeleton h-8 w-32 mb-2"></div>
        <div class="skeleton h-4 w-24"></div>
      </div>
    `;
  }

  // =====================
  // Commodities
  // =====================
  function loadCommodities() {
    const container = document.getElementById('commodity-cards');
    if (!container) return;

    const data = API.getCommodityData();
    const i18nNames = {
      'Gold': 'gold',
      'Silver': 'silver',
      'Crude Oil (WTI)': 'crude_oil'
    };
    const units = {
      'Gold': 'per_ounce',
      'Silver': 'per_ounce',
      'Crude Oil (WTI)': 'per_barrel'
    };

    let html = '';
    data.commodities.forEach((c, i) => {
      const isPositive = c.change >= 0;
      const canvasId = `spark-commodity-${i}`;
      const nameKey = i18nNames[c.name] || c.name;
      const unitKey = units[c.name] || '';

      html += `
        <div class="rate-card flex flex-col gap-2" role="group" aria-label="${c.name} price">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-semibold text-sm text-dash-text" data-i18n="${nameKey}">${I18n.t(nameKey)}</span>
              <span class="text-xs text-dash-text-sec ml-1">${c.symbol}</span>
            </div>
            <div class="sparkline-container" title="7-day trend for ${c.name}">
              <canvas id="${canvasId}" data-pending='${JSON.stringify(c.history)}'
                aria-label="7-day trend chart for ${c.name}" role="img"></canvas>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-2xl font-mono font-semibold text-dash-text">$${I18n.formatNumber(c.price, 2)}</p>
              <p class="text-xs flex items-center gap-1 ${isPositive ? 'text-dash-positive' : 'text-dash-negative'}">
                <span aria-hidden="true">${isPositive ? '▲' : '▼'}</span>
                <span class="font-mono">${isPositive ? '+' : ''}${c.change.toFixed(2)}</span>
                <span class="font-mono">(${isPositive ? '+' : ''}${c.changePercent.toFixed(2)}%)</span>
              </p>
              <p class="text-xs text-dash-text-sec mt-1" data-i18n="${unitKey}">${I18n.t(unitKey)}</p>
            </div>
          </div>
        </div>
      `;
    });

    html += `<p class="text-xs text-dash-text-sec col-span-full">${I18n.t('last_updated')}: ${data.lastUpdated} (${I18n.t('source')}: Market Data)</p>`;
    container.innerHTML = html;
  }

  // =====================
  // Macro Indicators Table
  // =====================
  async function loadMacroTable() {
    try {
      const resp = await fetch('data/macro-indicators.json');
      macroData = await resp.json();
      renderMacroTable(macroData.indicators);
      const sourceEl = document.getElementById('macro-source');
      if (sourceEl) {
        sourceEl.textContent = `${I18n.t('source')}: ${macroData.source} | ${I18n.t('last_updated')}: ${macroData.lastUpdated}`;
      }
    } catch(err) {
      console.error('Error loading macro indicators:', err);
    }
  }

  function renderMacroTable(indicators) {
    const tbody = document.getElementById('macro-table-body');
    if (!tbody) return;

    let html = '';
    indicators.forEach((ind, i) => {
      const rowClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      html += `
        <tr class="${rowClass} border-b border-dash-border/50 hover:bg-blue-50/30 transition-colors">
          <td class="px-4 py-3 text-sm font-medium">
            <span class="mr-2" aria-hidden="true">${FLAGS[ind.code] || ''}</span>${ind.country}
          </td>
          <td class="px-4 py-3 text-sm text-right font-mono ${ind.gdpGrowth >= 0 ? 'text-dash-positive' : 'text-dash-negative'}">${ind.gdpGrowth.toFixed(1)}%</td>
          <td class="px-4 py-3 text-sm text-right font-mono ${ind.inflation > 3 ? 'text-dash-negative' : 'text-dash-positive'}">${ind.inflation.toFixed(1)}%</td>
          <td class="px-4 py-3 text-sm text-right font-mono">${ind.interestRate.toFixed(2)}%</td>
          <td class="px-4 py-3 text-sm text-right font-mono ${ind.unemployment > 6 ? 'text-dash-negative' : 'text-dash-text-sec'}">${ind.unemployment.toFixed(1)}%</td>
          <td class="px-4 py-3 text-sm">${ind.currency}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  function sortTable(column) {
    if (!macroData) return;

    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }

    const sorted = [...macroData.indicators].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    renderMacroTable(sorted);

    // Update sort icons
    document.querySelectorAll('.macro-table th').forEach(th => {
      th.classList.remove('sorted');
      if (th.dataset.sort === column) {
        th.classList.add('sorted');
      }
    });

    // Track sort
    if (window.Analytics) {
      Analytics.track('table_sort', column);
    }
  }

  // =====================
  // Auto-Refresh
  // =====================
  function startAutoRefresh() {
    countdownSeconds = 300;
    clearInterval(countdownInterval);
    clearInterval(refreshInterval);

    countdownInterval = setInterval(() => {
      countdownSeconds--;
      updateCountdown();
      if (countdownSeconds <= 0) {
        refreshNow();
      }
    }, 1000);
  }

  function updateCountdown() {
    const el = document.getElementById('refresh-countdown');
    if (!el) return;
    const min = Math.floor(countdownSeconds / 60);
    const sec = countdownSeconds % 60;
    el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  }

  async function refreshNow() {
    countdownSeconds = 300;
    updateCountdown();

    // Add spin animation to refresh button
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.classList.add('animate-spin');
      setTimeout(() => btn.classList.remove('animate-spin'), 1000);
    }

    await loadAllData();

    // Flash updated values
    document.querySelectorAll('.rate-card').forEach(card => {
      card.classList.add('flash-update');
      setTimeout(() => card.classList.remove('flash-update'), 1000);
    });
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(countdownInterval);
    } else {
      startAutoRefresh();
    }
  }

  // =====================
  // Utilities
  // =====================
  function updateTimestamp() {
    const el = document.getElementById('last-updated-time');
    if (el) {
      el.textContent = new Date().toLocaleString(I18n.getCurrentLang());
    }
  }

  function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out live exchange rates and macro economic data on Global Macro Dash!');

    const twitter = document.getElementById('share-twitter');
    const facebook = document.getElementById('share-facebook');
    const linkedin = document.getElementById('share-linkedin');

    if (twitter) twitter.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (facebook) facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (linkedin) linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.querySelector('.copy-link span[data-i18n="copy_link"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = I18n.t('copied');
        setTimeout(() => { btn.textContent = original; }, 2000);
      }
    }).catch(() => {});
  }

  function changeLanguage(lang) {
    I18n.setLanguage(lang);
    // Re-render data-dependent sections
    loadCommodities();
    if (macroData) {
      renderMacroTable(macroData.indicators);
      const sourceEl = document.getElementById('macro-source');
      if (sourceEl) {
        sourceEl.textContent = `${I18n.t('source')}: ${macroData.source} | ${I18n.t('last_updated')}: ${macroData.lastUpdated}`;
      }
    }
    updateTimestamp();
    updateShareLinks();
  }

  // Public API
  window.GlobalMacroDash = {
    refreshNow,
    sortTable,
    swapCurrencies: () => Converter.swap(),
    quickConvert: (from, to) => Converter.quickConvert(from, to),
    copyLink,
    changeLanguage
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
