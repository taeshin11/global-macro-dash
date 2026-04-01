// charts.js - Chart.js sparkline configuration
(function() {
  const chartInstances = {};

  function createSparkline(canvasId, dataPoints, isPositive) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    // Destroy existing chart
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    const ctx = canvas.getContext('2d');
    const color = isPositive ? '#22C55E' : '#EF4444';
    const bgColor = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataPoints.map((_, i) => `Day ${i + 1}`),
        datasets: [{
          data: dataPoints,
          borderColor: color,
          borderWidth: 2,
          backgroundColor: bgColor,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#1E293B',
            titleColor: '#F0F4F8',
            bodyColor: '#F0F4F8',
            titleFont: { size: 10 },
            bodyFont: { size: 11, family: 'JetBrains Mono' },
            padding: 6,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y.toFixed(4);
              }
            }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: {
          duration: 600,
          easing: 'easeOutQuart'
        }
      }
    });

    chartInstances[canvasId] = chart;
    return chart;
  }

  // Lazy load sparklines using Intersection Observer
  function observeSparklines() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const canvas = container.querySelector('canvas');
          if (canvas && canvas.dataset.pending) {
            const data = JSON.parse(canvas.dataset.pending);
            const isPositive = data[data.length - 1] >= data[0];
            createSparkline(canvas.id, data, isPositive);
            delete canvas.dataset.pending;
          }
          observer.unobserve(container);
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('.sparkline-container').forEach(el => {
      observer.observe(el);
    });
  }

  window.Charts = { createSparkline, observeSparklines };
})();
