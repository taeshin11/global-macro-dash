// analytics.js - Visitor counter and Google Sheets webhook
(function() {
  // Google Sheets webhook URL placeholder
  // Replace with your actual Apps Script web app URL after deployment
  const WEBHOOK_URL = '';

  // Visitor counter using localStorage
  function initVisitorCounter() {
    const today = new Date().toISOString().split('T')[0];
    let stats = JSON.parse(localStorage.getItem('gmd-visitor-stats') || '{}');

    if (!stats.total) stats.total = 0;
    if (stats.lastDate !== today) {
      stats.todayCount = 0;
      stats.lastDate = today;
    }

    // Only count once per session
    if (!sessionStorage.getItem('gmd-counted')) {
      stats.todayCount = (stats.todayCount || 0) + 1;
      stats.total += 1;
      sessionStorage.setItem('gmd-counted', '1');
      localStorage.setItem('gmd-visitor-stats', JSON.stringify(stats));
    }

    updateCounterDisplay(stats.todayCount || 0, stats.total || 0);
  }

  function updateCounterDisplay(today, total) {
    const todayEl = document.getElementById('visitors-today');
    const totalEl = document.getElementById('visitors-total');
    if (todayEl) todayEl.textContent = today.toLocaleString();
    if (totalEl) totalEl.textContent = total.toLocaleString();
  }

  // Google Sheets webhook (non-blocking, silent)
  function track(action, detail) {
    if (!WEBHOOK_URL) return;

    const payload = {
      timestamp: new Date().toISOString(),
      action: action,
      detail: detail || '',
      language: window.I18n ? I18n.getCurrentLang() : 'en',
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent
    };

    // Non-blocking fire-and-forget
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(WEBHOOK_URL, JSON.stringify(payload));
      } else {
        fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        }).catch(() => {});
      }
    } catch(e) {
      // Silent fail
    }
  }

  // Initialize
  function init() {
    initVisitorCounter();
    track('page_load', window.location.href);
  }

  window.Analytics = { init, track };
})();
