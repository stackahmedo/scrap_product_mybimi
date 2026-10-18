# My BIMI · Enterprise Catalog & Analytics Studio

A modern, high-performance web application built with **React, Vite, and TypeScript** for exploring, analyzing, managing, and printing official retail shelf talkers for the 948 BIMI products portfolio.

## 🚀 Key Features

- **📊 Intelligence Dashboard**: Real-time KPI metrics, stock health distribution (393 in-stock vs 555 out-of-stock), total inventory valuation (¥9,061,851), average prices, department breakdowns, and global sourcing origins across 9 countries.
- **📦 Interactive Product Explorer**: Instant search across 948 products with filters for category, origin, brand, stock level, and price range. Supports responsive Card Grid and compact Table views with `content-visibility: auto` for buttery-smooth 60fps scrolling.
- **🔍 360° Product Detail Modal**: High-res image gallery with thumbnail carousel, JAN barcode rendering, full metadata breakdown, short/long description tabs, and link to live source records.
- **🏷️ Official Japanese Price Tag Studio**: Authentic BIMI Japanese supermarket shelf talker generator (with official emerald & saffron headers, tax-included calculation at 8% food / 10% standard, bold price typography, cutting crop lines, and batch printing).
- **🛒 Procurement Inquiry Basket**: Build order lists and supplier quote sheets, calculate subtotal and consumption tax, and export formatted CSV quotation sheets or printable purchase orders.
- **✏️ In-Browser Product Editing**: Edit titles, prices, stock quantities, and custom manager notes with immediate local persistence.
- **🌓 Dark & Light Modes**: Tailored enterprise theme switching with smooth transitions and persistent settings.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/stackahmedo/scrap_product_mybimi.git
cd scrap_product_mybimi

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Builds the optimized production bundle to `dist/` with all 993 images ready for deployment.

---

## 🌐 Deploy to GitHub Pages

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable GitHub Pages:
1. Go to your repository on GitHub: **Settings > Pages**
2. Under **Build and deployment > Source**, choose **GitHub Actions**
3. Push commits to `main` — GitHub Actions will automatically build and publish your web app!

---

## 📁 Repository Structure

```
├── .github/workflows/deploy.yml # Automated GitHub Pages CI/CD workflow
├── images/                      # 993 product and gallery images
├── src/
│   ├── components/
│   │   ├── catalog/             # Catalog view, product detail modal, product editor
│   │   ├── dashboard/           # Analytics dashboard, KPI metrics, charts
│   │   ├── pricetag/            # Official BIMI Japanese shelf talker studio
│   │   ├── inquiry/             # Procurement inquiry & quote basket
│   │   ├── layout/              # Navbar, theme toggle, brand header
│   │   └── common/              # SVG barcode generator, quick search command palette
│   ├── services/                # Data service, statistics engine, CSV export, persistence
│   ├── styles/                  # Enterprise design system CSS
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root application component
│   └── main.tsx                 # Entrypoint
├── catalog.html                 # Offline standalone catalog
├── products.json                # Complete 948-product dataset
├── image_manifest.json          # URL to local image mapping manifest
├── package.json                 # Project dependencies and scripts
└── vite.config.ts               # Vite configuration with relative base
```
