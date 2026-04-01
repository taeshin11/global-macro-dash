// converter.js - Currency converter logic
(function() {
  let debounceTimer = null;
  let allRates = {};

  async function init(rates) {
    allRates = rates || {};

    const currencies = await API.fetchCurrencies();
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');

    if (!fromSelect || !toSelect) return;

    const sortedCodes = Object.keys(currencies).sort();
    const flagMap = getCurrencyFlags();

    sortedCodes.forEach(code => {
      const flag = flagMap[code] || '';
      const optFrom = new Option(`${flag} ${code} - ${currencies[code]}`, code);
      const optTo = new Option(`${flag} ${code} - ${currencies[code]}`, code);
      fromSelect.add(optFrom);
      toSelect.add(optTo);
    });

    fromSelect.value = 'USD';
    toSelect.value = 'EUR';

    // Attach event listeners with debounce
    const amountInput = document.getElementById('converter-amount');
    amountInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(convert, 300);
    });
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);

    // Initial conversion
    convert();
  }

  async function convert() {
    const amount = parseFloat(document.getElementById('converter-amount').value) || 0;
    const from = document.getElementById('converter-from').value;
    const to = document.getElementById('converter-to').value;
    const outputEl = document.getElementById('converter-output');
    const infoEl = document.getElementById('converter-rate-info');

    if (!from || !to || amount <= 0) {
      outputEl.textContent = '--';
      infoEl.textContent = '';
      return;
    }

    try {
      const data = await API.fetchPairRate(from, to, amount);
      const result = data.rates[to];
      const rate = result / amount;

      outputEl.textContent = I18n.formatCurrency(result, to);
      infoEl.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} | ${I18n.t('inverse_rate')}: 1 ${to} = ${(1/rate).toFixed(6)} ${from}`;

      // Track converter usage
      if (window.Analytics) {
        Analytics.track('converter_used', `${from}/${to}`);
      }
    } catch(err) {
      outputEl.textContent = I18n.t('error_loading');
      infoEl.textContent = '';
    }
  }

  function swap() {
    const fromSelect = document.getElementById('converter-from');
    const toSelect = document.getElementById('converter-to');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convert();
  }

  function quickConvert(from, to) {
    document.getElementById('converter-from').value = from;
    document.getElementById('converter-to').value = to;
    convert();
  }

  function getCurrencyFlags() {
    return {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
      'CHF': '🇨🇭', 'CAD': '🇨🇦', 'AUD': '🇦🇺', 'NZD': '🇳🇿',
      'CNY': '🇨🇳', 'HKD': '🇭🇰', 'SGD': '🇸🇬', 'SEK': '🇸🇪',
      'NOK': '🇳🇴', 'DKK': '🇩🇰', 'KRW': '🇰🇷', 'INR': '🇮🇳',
      'BRL': '🇧🇷', 'MXN': '🇲🇽', 'ZAR': '🇿🇦', 'TRY': '🇹🇷',
      'RUB': '🇷🇺', 'PLN': '🇵🇱', 'THB': '🇹🇭', 'IDR': '🇮🇩',
      'MYR': '🇲🇾', 'PHP': '🇵🇭', 'CZK': '🇨🇿', 'HUF': '🇭🇺',
      'ILS': '🇮🇱', 'BGN': '🇧🇬', 'HRK': '🇭🇷', 'RON': '🇷🇴',
      'ISK': '🇮🇸'
    };
  }

  window.Converter = { init, convert, swap, quickConvert };
})();
