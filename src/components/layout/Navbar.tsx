import React from 'react';
import {
  BarChart3,
  Layers,
  Tag,
  ShoppingBag,
  Sun,
  Moon,
  Download,
  Search,
} from 'lucide-react';
import { DataService } from '../../services/dataService';

interface NavbarProps {
  currentTab: 'analytics' | 'catalog' | 'pricetags' | 'inquiry';
  onSelectTab: (tab: 'analytics' | 'catalog' | 'pricetags' | 'inquiry') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  inquiryCount: number;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onToggleTheme,
  inquiryCount,
  onOpenSearch,
}) => {
  const metadata = DataService.getMetadata();

  const handleExportAll = () => {
    const products = DataService.getProducts();
    DataService.exportProductsToCsv(products, `bimi_full_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <header className="header-nav">
      <div className="header-inner">
        {/* Brand section */}
        <div className="brand-section">
          <div className="brand-logo-badge" title="My BIMI Corporation">
            B
          </div>
          <div className="brand-info">
            <h1>
              My BIMI
              <span className="brand-tag">STUDIO</span>
            </h1>
            <p className="brand-subtext">
              948 Products · {metadata?.collected_at_utc ? new Date(metadata.collected_at_utc).toLocaleDateString() : 'Live'}
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn ${currentTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onSelectTab('analytics')}
            id="nav-tab-analytics"
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'catalog' ? 'active' : ''}`}
            onClick={() => onSelectTab('catalog')}
            id="nav-tab-catalog"
          >
            <Layers size={16} />
            <span>Catalog</span>
            <span className="tab-badge">948</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'pricetags' ? 'active' : ''}`}
            onClick={() => onSelectTab('pricetags')}
            id="nav-tab-pricetags"
          >
            <Tag size={16} />
            <span>Price Tags</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'inquiry' ? 'active' : ''}`}
            onClick={() => onSelectTab('inquiry')}
            id="nav-tab-inquiry"
          >
            <ShoppingBag size={16} />
            <span>Inquiries</span>
            {inquiryCount > 0 && (
              <span className="tab-badge" style={{ background: 'var(--bimi-orange)' }}>
                {inquiryCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <button
            className="action-btn-icon"
            onClick={onOpenSearch}
            title="Quick Search (Click or press /)"
            id="btn-quick-search"
          >
            <Search size={18} />
          </button>

          <button
            className="action-btn-icon"
            onClick={handleExportAll}
            title="Export Entire Catalog to CSV"
            id="btn-export-csv"
          >
            <Download size={18} />
          </button>

          <button
            className="action-btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="btn-theme-toggle"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
