// ads.js - Ad injection for Adsterra and Google AdSense
(function() {
  function init() {
    // Adsterra ad placeholders are already in the HTML
    // They will be replaced with actual ad code once Adsterra account is set up
    // For now, the placeholder divs with data-adsterra-key serve as markers

    // Google AdSense auto-ads are loaded via the script in <head>
    // Manual AdSense slot below converter
    initAdSenseSlot();
  }

  function initAdSenseSlot() {
    const slot = document.getElementById('adsense-converter-slot');
    if (!slot) return;

    // Insert AdSense ad unit (will only show when approved)
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', 'ca-pub-7098271335538021');
    ins.setAttribute('data-ad-slot', 'auto');
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');

    // Only insert if AdSense is loaded
    if (window.adsbygoogle) {
      slot.innerHTML = '';
      slot.appendChild(ins);
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch(e) {}
    }
  }

  window.Ads = { init };
})();
