# PRD: Global Macro Dash

## Live Exchange Rates & Macro Economy Tracker

---

## 1. Product Overview

### Service Name
Global Macro Dash

### Short Title
Live Exchange Rates & Macro Economy Tracker

### Description
Global Macro Dash is a comprehensive dashboard displaying major exchange rates, interest rates, inflation data, and key economic indicators in a clean, data-rich interface. Powered by free-tier APIs (ExchangeRate-API, Frankfurter API, or Open Exchange Rates), it provides traders, economists, students, and global business professionals with real-time currency data and macroeconomic context. Chart.js sparklines bring the data to life with 7-day trend visualization.

### Target Audience
- Forex traders and financial analysts
- Economics students and researchers
- International business professionals
- Expats and travelers monitoring rates
- Global e-commerce sellers tracking currencies

### Target Keywords (SEO)
- "exchange rate today"
- "live currency rates"
- "macro economy dashboard"
- "USD to EUR rate"
- "currency converter"
- "global economic indicators"
- "interest rate tracker"

---

## 2. Harness Design Methodology

### Agent Workflow

```
Planner Agent
  --> Analyze PRD, break into milestones and tasks
  --> Output: milestone_plan.json

Initializer Agent
  --> Generate feature_list.json
  --> Generate claude-progress.txt
  --> Generate init.sh (project scaffold)
  --> Bootstrap project structure

Fixed Session Routine
  --> Each session: read claude-progress.txt
  --> Pick next incomplete task
  --> Build -> Test -> Commit
  --> Update claude-progress.txt

Builder Agent
  --> Implements features per milestone
  --> Writes code, tests locally

Reviewer Agent
  --> Reviews code quality, accessibility, SEO
  --> Validates against PRD requirements
  --> Confirms milestone completion
```

### Initializer Agent Outputs

#### feature_list.json
```json
{
  "project": "GlobalMacroDash",
  "features": [
    {
      "id": "F01",
      "name": "Project Scaffold & Tailwind + Chart.js Setup",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F02",
      "name": "Exchange Rate API Integration",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F03",
      "name": "Major Currency Pair Cards with Live Rates",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F04",
      "name": "7-Day Sparkline Charts",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F05",
      "name": "Gold/Silver/Oil Price Display",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F06",
      "name": "Country Macro Indicators Table",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F07",
      "name": "Auto-Refresh Mechanism",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F08",
      "name": "Currency Converter Widget",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F09",
      "name": "Auto i18n (8+ Languages)",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F10",
      "name": "SEO Optimization",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F11",
      "name": "Ad Integration (Adsterra + AdSense)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F12",
      "name": "Google Sheets Webhook",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F13",
      "name": "Visitor Counter (Today + Total)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F14",
      "name": "Feedback & Social Sharing",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F15",
      "name": "Static Pages (About, FAQ, Privacy, Terms)",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F16",
      "name": "Deployment to Vercel",
      "milestone": 8,
      "status": "pending"
    }
  ]
}
```

#### claude-progress.txt
```
# Global Macro Dash - Progress Tracker
# Updated: [timestamp]

## Current Milestone: 1
## Current Task: F01 - Project Scaffold
## Status: NOT STARTED

### Milestone 1: Foundation [NOT STARTED]
- [ ] F01: Project Scaffold & Tailwind + Chart.js Setup
- [ ] F02: Exchange Rate API Integration

### Milestone 2: Currency Dashboard [NOT STARTED]
- [ ] F03: Major Currency Pair Cards
- [ ] F04: 7-Day Sparkline Charts

### Milestone 3: Extended Data [NOT STARTED]
- [ ] F05: Gold/Silver/Oil Prices
- [ ] F06: Country Macro Indicators Table

### Milestone 4: Interactive Features [NOT STARTED]
- [ ] F07: Auto-Refresh
- [ ] F08: Currency Converter Widget

### Milestone 5: SEO & i18n [NOT STARTED]
- [ ] F09: Auto i18n
- [ ] F10: SEO Optimization

### Milestone 6: Monetization & Analytics [NOT STARTED]
- [ ] F11: Ad Integration
- [ ] F12: Google Sheets Webhook
- [ ] F13: Visitor Counter

### Milestone 7: Content & Social [NOT STARTED]
- [ ] F14: Feedback & Social Sharing
- [ ] F15: Static Pages

### Milestone 8: Deployment [NOT STARTED]
- [ ] F16: Deploy to Vercel

### Notes:
```

#### init.sh
```bash
#!/bin/bash
# Global Macro Dash - Project Initializer

mkdir -p src/{css,js,data,images,pages}
touch src/index.html
touch src/css/styles.css
touch src/js/app.js
touch src/js/api.js
touch src/js/charts.js
touch src/js/converter.js
touch src/js/i18n.js
touch src/js/analytics.js
touch src/js/ads.js
touch src/data/macro-indicators.json
touch src/pages/about.html
touch src/pages/faq.html
touch src/pages/privacy.html
touch src/pages/terms.html
touch src/sitemap.xml
touch src/robots.txt

echo "Project scaffold created."
```

---

## 3. Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 (semantic) |
| Styling | Tailwind CSS (CDN), custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | Chart.js (CDN) for sparklines |
| APIs | ExchangeRate-API (free), Frankfurter API (free/unlimited) |
| Hosting | Vercel (free tier) |
| Ads | Adsterra (primary), Google AdSense (secondary) |
| Analytics | Google Sheets via Apps Script webhook |

### API Details

#### ExchangeRate-API (Primary)
- Base URL: `https://v6.exchangerate-api.com/v6/{API_KEY}/`
- Free tier: 1,500 requests/month
- Endpoints: `latest/{base}`, `pair/{from}/{to}/{amount}`
- 150+ currencies supported

#### Frankfurter API (Secondary/Unlimited)
- Base URL: `https://api.frankfurter.app/`
- No API key required, no rate limits
- ECB (European Central Bank) data
- Endpoints: `latest`, `{date}`, `{start_date}..{end_date}`
- ~30 major currencies
- Historical data for sparklines

#### Commodity Prices
- Use free APIs or static daily-updated data for gold/silver/oil
- Options: Metals API free tier, or scrape/cache from public sources
- Fallback: static JSON with manual periodic updates

### Infrastructure Cost
**$0 total** - Free API tiers + Vercel hosting.

### File Structure
```
GlobalMacroDash/
├── index.html                 # Main dashboard
├── css/
│   └── styles.css             # Custom styles, financial theme
├── js/
│   ├── app.js                 # Core rendering, state management
│   ├── api.js                 # API clients (ExchangeRate, Frankfurter)
│   ├── charts.js              # Chart.js sparkline configuration
│   ├── converter.js           # Currency converter logic
│   ├── i18n.js                # Internationalization
│   ├── analytics.js           # Visitor counter, webhook
│   └── ads.js                 # Ad injection
├── data/
│   └── macro-indicators.json  # Static macro data (GDP, inflation, rates)
├── pages/
│   ├── about.html
│   ├── faq.html
│   ├── privacy.html
│   └── terms.html
├── images/
│   ├── og-image.png
│   ├── favicon.ico
│   └── flags/                 # Country flag icons (SVG)
├── sitemap.xml
├── robots.txt
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── vercel.json
└── README.md
```

---

## 4. Design System

### Color Palette (Soft Background - Financial Theme)
| Role | Color | Hex |
|------|-------|-----|
| Background | Soft blue-gray | #F0F4F8 |
| Background Alt | Slightly darker | #E2E8F0 |
| Surface/Card | Soft white | #FFFFFF with subtle shadow |
| Primary | Financial blue | #2563EB |
| Primary Hover | Darker blue | #1D4ED8 |
| Secondary | Muted gold | #D97706 |
| Positive/Up | Soft green | #16A34A |
| Negative/Down | Soft red | #DC2626 |
| Neutral | Warm gray | #6B7280 |
| Text Primary | Dark slate | #1E293B |
| Text Secondary | Slate gray | #64748B |
| Border | Light slate | #CBD5E1 |
| Sparkline Up | Green | #22C55E |
| Sparkline Down | Red | #EF4444 |

### Typography
- **Headings**: Inter, weight 600-700
- **Body**: Inter, weight 400
- **Numbers/Rates**: Tabular nums, JetBrains Mono, weight 500
- **Base size**: 16px
- **Large rate display**: 2rem+

### Component Patterns
- **Currency Pair Card**: Flag icons, pair label, rate (large), change (green/red), mini sparkline
- **Indicator Table**: Striped rows, sortable columns, country flags
- **Converter Widget**: Two dropdowns + input + result, swap button
- **Sparkline**: Chart.js line chart, no axes, just the trend line with gradient fill

---

## 5. Feature Specifications

### F01: Project Scaffold & Tailwind + Chart.js Setup
- Directory structure per spec
- Tailwind CSS via CDN
- Chart.js via CDN (`<script src="https://cdn.jsdelivr.net/npm/chart.js">`)
- Base HTML with financial dashboard layout
- Soft blue-gray background
- Responsive grid system

### F02: Exchange Rate API Integration
- Module `api.js`:
  - `fetchLatestRates(base)` - get latest rates from ExchangeRate-API or Frankfurter
  - `fetchHistoricalRates(base, startDate, endDate)` - for sparkline data (Frankfurter)
  - `fetchPairRate(from, to, amount)` - for converter
- API key management (environment variable or config constant)
- Caching in sessionStorage (5-minute TTL for latest, 1-hour for historical)
- Error handling with fallback between APIs
- Loading states while fetching

### F03: Major Currency Pair Cards with Live Rates
- Display cards for key pairs:
  - USD/EUR, USD/JPY, USD/GBP, USD/CHF, USD/CAD, USD/AUD
  - EUR/GBP, EUR/JPY, GBP/JPY
- Each card shows:
  - Country flags (from/to)
  - Currency pair label (e.g., "USD / EUR")
  - Current rate (large, formatted to 4-6 decimal places)
  - Daily change amount and percentage
  - Change direction arrow (up green / down red)
  - Mini sparkline (7-day)
- Grid layout: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Last updated timestamp

### F04: 7-Day Sparkline Charts
- Chart.js line charts rendered inline on each currency card
- Data from Frankfurter API historical endpoint (last 7 days)
- Minimal chart: no axes, no labels, just the line
- Line color: green if rate increased over 7 days, red if decreased
- Gradient fill below the line (subtle)
- Tooltip on hover showing date and rate
- Canvas size: approximately 120x40px per card

### F05: Gold/Silver/Oil Price Display
- Dedicated section: "Commodities"
- Cards for:
  - Gold (XAU/USD) per troy ounce
  - Silver (XAG/USD) per troy ounce
  - Crude Oil (WTI) per barrel
- Data source: free metals API or static JSON with periodic updates
- Same card design: price, change, sparkline
- Fallback to static data if API unavailable
- "Last updated" note if data is static

### F06: Country Macro Indicators Table
- Sortable table with columns:
  - Country (flag + name)
  - GDP Growth (%)
  - Inflation Rate (%)
  - Interest Rate (%)
  - Unemployment Rate (%)
  - Currency
- Major economies: US, EU, UK, Japan, China, Canada, Australia, South Korea, Germany, France, Brazil, India
- Data from static JSON (updated periodically from public sources like World Bank, IMF)
- Click column header to sort ascending/descending
- Responsive: horizontal scroll on mobile, or card layout
- Source attribution and "last updated" date

### F07: Auto-Refresh Mechanism
- Exchange rates refresh every 5 minutes automatically
- Visual countdown timer: "Refreshing in 4:32"
- Manual refresh button (circular arrow icon)
- Smooth data update (no full page reload)
- Pause auto-refresh when tab is not visible (Page Visibility API)
- Resume on tab focus
- Flash animation on updated values

### F08: Currency Converter Widget
- Sticky or prominent converter section
- Input fields:
  - Amount (numeric input)
  - From currency (dropdown with flag + code)
  - To currency (dropdown with flag + code)
  - Swap button (reverse from/to)
- Real-time calculation as user types
- Display result: formatted with proper decimal places
- Show rate used and inverse rate
- Popular conversion shortcuts below (USD->EUR, EUR->GBP, etc.)
- Support 30+ currencies

### F09: Auto i18n (8+ Languages)
- Detect via `navigator.language`
- Supported: EN, KO, JA, ZH, ES, DE, FR, PT
- Translate all UI strings
- Number formatting per locale (`Intl.NumberFormat`)
- Currency formatting per locale
- Language switcher in header
- localStorage persistence
- Fallback to EN

### F10: SEO Optimization
- Semantic HTML5
- Meta title: "Global Macro Dash - Live Exchange Rates & Macro Economy Tracker"
- Meta description with target keywords
- Open Graph tags with financial dashboard OG image
- Twitter Card tags
- JSON-LD structured data (WebApplication, FinancialProduct concepts)
- sitemap.xml, robots.txt
- Canonical URLs
- Heading hierarchy (h1: dashboard title, h2: sections)

### F11: Ad Integration
- **Adsterra (Primary)**:
  - Leaderboard banner (728x90) below header
  - Rectangle ad (300x250) in sidebar or between sections
  - Native ad between currency cards and macro table
  - Placeholder divs with `data-adsterra-key`
- **Google AdSense (Secondary)**:
  - Publisher ID: `ca-pub-7098271335538021`
  - Auto-ads script
  - Manual slot below converter widget

### F12: Google Sheets Webhook
- Auto POST on:
  - Page load (referrer tracking)
  - Currency converter used (from/to pair)
  - Table sort (column name)
- Payload: `{ timestamp, action, detail, language, referrer }`
- Non-blocking, silent

### F13: Visitor Counter
- Footer: "Today: X | Total: Y"
- localStorage + external counter
- Non-intrusive

### F14: Feedback & Social Sharing
- Feedback mailto: `taeshinkim11@gmail.com` with subject "Global Macro Dash Feedback"
- Social sharing: Twitter/X, Facebook, LinkedIn, Copy Link
- "Share today's rates" feature

### F15: Static Pages
- About: Data sources (ECB, public APIs), purpose, disclaimers
- FAQ: How rates are updated, data accuracy, converter usage
- Privacy Policy, Terms of Service
- Disclaimer: Not financial advice

---

## 6. Milestones & Git Strategy

### Milestone Plan

| Milestone | Features | Git Tag | Description |
|-----------|----------|---------|-------------|
| M1 | F01, F02 | v0.1.0 | Foundation + API integration |
| M2 | F03, F04 | v0.2.0 | Currency cards + sparklines |
| M3 | F05, F06 | v0.3.0 | Commodities + macro table |
| M4 | F07, F08 | v0.4.0 | Auto-refresh + converter |
| M5 | F09, F10 | v0.5.0 | SEO + i18n |
| M6 | F11, F12, F13 | v0.6.0 | Monetization + analytics |
| M7 | F14, F15 | v0.7.0 | Content + social |
| M8 | F16 | v1.0.0 | Deployment |

### Git Strategy
```bash
gh repo create GlobalMacroDash --private --source=. --remote=origin
git init && git add . && git commit -m "feat(F01): initial scaffold"
git push -u origin main
git tag v0.1.0 && git push origin v0.1.0
```

---

## 7. Deployment Checklist

### Pre-Deployment
- [ ] All features implemented and tested
- [ ] API keys configured (not exposed in client code if possible)
- [ ] Responsive design verified
- [ ] SEO tags validated
- [ ] Ad slots configured
- [ ] Webhook tested
- [ ] Visitor counter working
- [ ] i18n verified for all 8 languages
- [ ] Static pages complete (including financial disclaimer)
- [ ] Chart.js rendering correctly on all devices
- [ ] Auto-refresh working
- [ ] No console errors
- [ ] Lighthouse > 90

### Vercel Deployment
```bash
vercel --prod
```

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 8. Google Sheets Webhook Setup

### Apps Script
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.action,
    data.detail,
    data.language,
    data.referrer,
    data.userAgent
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 9. Ad Monetization Strategy

### Adsterra Placements
- Top banner (728x90 / 320x50)
- Between sections (native ad)
- Sidebar rectangle (300x250) on desktop
- Footer banner

### Google AdSense
- Publisher ID: `ca-pub-7098271335538021`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossorigin="anonymous"></script>
```

---

## 10. i18n Implementation

### Supported Languages
| Code | Language |
|------|----------|
| EN | English |
| KO | Korean |
| JA | Japanese |
| ZH | Chinese (Simplified) |
| ES | Spanish |
| DE | German |
| FR | French |
| PT | Portuguese |

### Translation Keys (Sample)
```json
{
  "EN": {
    "title": "Global Macro Dash",
    "subtitle": "Live Exchange Rates & Macro Economy Tracker",
    "currency_pairs": "Major Currency Pairs",
    "commodities": "Commodities",
    "macro_indicators": "Macro Economic Indicators",
    "converter": "Currency Converter",
    "amount": "Amount",
    "from": "From",
    "to": "To",
    "swap": "Swap",
    "convert": "Convert",
    "refreshing_in": "Refreshing in",
    "refresh_now": "Refresh Now",
    "last_updated": "Last Updated",
    "daily_change": "Daily Change",
    "country": "Country",
    "gdp_growth": "GDP Growth",
    "inflation": "Inflation",
    "interest_rate": "Interest Rate",
    "unemployment": "Unemployment",
    "source": "Source",
    "disclaimer": "Not financial advice"
  }
}
```

### Number & Currency Formatting
```javascript
// Locale-aware formatting
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currencyCode,
  minimumFractionDigits: 2,
  maximumFractionDigits: 4
});
```

---

## 11. Performance & Accessibility

### Performance
- Chart.js loaded via CDN with defer
- API response caching (sessionStorage)
- Lazy rendering of sparklines (Intersection Observer)
- Debounced converter input
- Page Visibility API for auto-refresh management
- Total page size target: < 500KB (excluding Chart.js CDN)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for converter, table sorting, language switcher
- ARIA labels on rate change indicators (screen reader: "USD/EUR up 0.3%")
- Table headers with scope attributes
- Color + icon for up/down (not color alone)
- Alt text: "7-day trend chart for USD/EUR showing upward trend"

---

## 12. API Rate Limiting Strategy

| API | Free Limit | Strategy |
|-----|-----------|----------|
| ExchangeRate-API | 1,500/month | Use for latest rates, cache aggressively |
| Frankfurter API | Unlimited | Use for historical data (sparklines), primary fallback |
| Open Exchange Rates | 1,000/month | Backup only |

### Caching Strategy
- Latest rates: sessionStorage, 5-min TTL
- Historical rates (7d): sessionStorage, 1-hour TTL
- Macro indicators: static JSON, manual monthly updates
- Commodity prices: static or cached, 30-min TTL

---

## 13. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ExchangeRate-API limit reached | Medium | Medium | Frankfurter as primary fallback |
| Commodity API unavailable | Medium | Low | Static fallback data with "as of" date |
| Stale macro data | Medium | Low | Clear "last updated" labels, periodic manual update |
| Chart.js CDN outage | Very Low | Medium | Fallback to text-only change display |
| Currency API data inconsistency | Low | Medium | Cross-validate between APIs |

---

## 14. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Daily Visitors | 80 | 800 |
| Page Views | 2,500 | 25,000 |
| Converter Uses/Day | 30 | 300 |
| Avg Session Duration | > 2 min | > 3 min |
| Ad Revenue | $2-15 | $30-150 |
| Google Indexation | Top 50 for "exchange rate today" | Top 20 |

---

## 15. Future Enhancements (Post-MVP)

- Historical rate charts (30d, 90d, 1y, 5y)
- Rate alerts (email notification when rate hits target)
- Portfolio tracker (input holdings, see total value)
- Economic calendar (central bank meetings, GDP releases)
- Multi-base view (see all rates from EUR, GBP, JPY base)
- Crypto rates section (BTC, ETH)
- Export data to CSV/Excel
- PWA for mobile

---

*Document Version: 1.0*
*Created: 2026-04-01*
*Methodology: Harness Design*
