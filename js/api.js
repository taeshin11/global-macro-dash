// api.js - API clients for exchange rates and historical data
(function() {
  // Frankfurter API (primary - unlimited, no key needed)
  const FRANKFURTER_BASE = 'https://api.frankfurter.dev/v1';

  // Cache keys and TTLs
  const CACHE_LATEST_TTL = 5 * 60 * 1000; // 5 minutes
  const CACHE_HISTORICAL_TTL = 60 * 60 * 1000; // 1 hour

  function getCached(key) {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch(e) {
      return null;
    }
  }

  function setCache(key, data, ttl) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), ttl }));
    } catch(e) {
      // Storage full, clear old entries
      sessionStorage.clear();
    }
  }

  // Fetch latest exchange rates from Frankfurter
  async function fetchLatestRates(base = 'USD') {
    const cacheKey = `gmd-latest-${base}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const resp = await fetch(`${FRANKFURTER_BASE}/latest?from=${base}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      // Add the base currency with rate 1
      data.rates[base] = 1;
      setCache(cacheKey, data, CACHE_LATEST_TTL);
      return data;
    } catch(err) {
      console.error('Error fetching latest rates:', err);
      throw err;
    }
  }

  // Fetch historical rates for sparklines (last 7 days)
  async function fetchHistoricalRates(base = 'USD', targetCurrencies = []) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 10); // Get 10 days to ensure 7 business days

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const symbols = targetCurrencies.join(',');

    const cacheKey = `gmd-hist-${base}-${symbols}-${start}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `${FRANKFURTER_BASE}/${start}..${end}?from=${base}&to=${symbols}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setCache(cacheKey, data, CACHE_HISTORICAL_TTL);
      return data;
    } catch(err) {
      console.error('Error fetching historical rates:', err);
      throw err;
    }
  }

  // Fetch pair rate for converter
  async function fetchPairRate(from, to, amount = 1) {
    try {
      const resp = await fetch(`${FRANKFURTER_BASE}/latest?from=${from}&to=${to}&amount=${amount}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch(err) {
      console.error('Error fetching pair rate:', err);
      throw err;
    }
  }

  // Get available currencies
  async function fetchCurrencies() {
    const cacheKey = 'gmd-currencies';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const resp = await fetch(`${FRANKFURTER_BASE}/currencies`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setCache(cacheKey, data, CACHE_HISTORICAL_TTL);
      return data;
    } catch(err) {
      console.error('Error fetching currencies:', err);
      return {};
    }
  }

  // Get yesterday's rates for daily change calculation
  async function fetchYesterdayRates(base = 'USD', targetCurrencies = []) {
    const yesterday = new Date();
    // Go back to find last business day
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.getDay() === 0) yesterday.setDate(yesterday.getDate() - 2);
    if (yesterday.getDay() === 6) yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = yesterday.toISOString().split('T')[0];
    const symbols = targetCurrencies.join(',');

    const cacheKey = `gmd-yesterday-${base}-${symbols}-${dateStr}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `${FRANKFURTER_BASE}/${dateStr}?from=${base}&to=${symbols}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setCache(cacheKey, data, CACHE_HISTORICAL_TTL);
      return data;
    } catch(err) {
      console.error('Error fetching yesterday rates:', err);
      return null;
    }
  }

  // Static commodity data (fallback)
  function getCommodityData() {
    return {
      lastUpdated: new Date().toISOString().split('T')[0],
      commodities: [
        {
          name: 'Gold',
          symbol: 'XAU/USD',
          price: 3118.50,
          change: 12.30,
          changePercent: 0.40,
          unit: 'per troy ounce',
          history: [3050, 3065, 3080, 3072, 3095, 3106, 3118.50]
        },
        {
          name: 'Silver',
          symbol: 'XAG/USD',
          price: 34.28,
          change: -0.15,
          changePercent: -0.44,
          unit: 'per troy ounce',
          history: [33.50, 33.82, 34.10, 34.45, 34.20, 34.43, 34.28]
        },
        {
          name: 'Crude Oil (WTI)',
          symbol: 'WTI',
          price: 69.36,
          change: -0.82,
          changePercent: -1.17,
          unit: 'per barrel',
          history: [71.20, 70.85, 70.40, 69.90, 70.18, 70.18, 69.36]
        }
      ]
    };
  }

  window.API = {
    fetchLatestRates,
    fetchHistoricalRates,
    fetchPairRate,
    fetchCurrencies,
    fetchYesterdayRates,
    getCommodityData
  };
})();
