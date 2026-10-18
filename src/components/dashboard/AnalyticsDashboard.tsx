import React from 'react';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Coins,
  TrendingUp,
  Globe2,
  FolderTree,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types/product';
import { DataService } from '../../services/dataService';

interface AnalyticsDashboardProps {
  products: Product[];
  onNavigateToCatalog: (filter: { category?: string; stockStatus?: 'in_stock' | 'out_of_stock' | 'all'; country?: string }) => void;
  onNavigateToPriceTags: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  products,
  onNavigateToCatalog,
  onNavigateToPriceTags,
}) => {
  const stats = DataService.calculateStats(products);

  const inStockPct = Math.round((stats.inStockCount / stats.totalProducts) * 100);
  const outOfStockPct = 100 - inStockPct;

  // Sorted categories by item count
  const sortedCategories = Object.entries(stats.categoryCounts).sort(
    (a, b) => b[1].total - a[1].total
  );

  // Sorted countries by item count
  const sortedCountries = Object.entries(stats.countryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="analytics-view" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bimi-green) 0%, #013822 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 36px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 90, 54, 0.25)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} color="var(--bimi-orange)" />
            Enterprise Catalog Intelligence
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
            My BIMI Catalog & Inventory Command Center
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: '24px' }}>
            Comprehensive overview of <strong>{stats.totalProducts} products</strong>, valuation insights, sourcing geographies,
            and stock availability. Generate official Japanese shelf talkers or export full inventory records with one click.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToCatalog({ stockStatus: 'all' })}
              className="btn-primary"
              style={{
                background: 'var(--bimi-orange)',
                boxShadow: '0 4px 14px rgba(242, 92, 5, 0.4)',
                padding: '10px 20px',
                fontSize: '14px',
              }}
            >
              <span>Explore All Products</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onNavigateToPriceTags}
              className="btn-secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '10px 20px',
                fontSize: '14px',
              }}
            >
              <span>Official Shelf Talker Studio</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242, 92, 5, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="metrics-grid">
        {/* Total Products */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Catalog</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(0, 90, 54, 0.12)', color: 'var(--bimi-green)' }}>
              <Package size={22} />
            </div>
          </div>
          <div>
            <div className="metric-value">{stats.totalProducts}</div>
            <div className="metric-sub">
              <span>993 high-res images attached</span>
            </div>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Stock Valuation</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(242, 92, 5, 0.12)', color: 'var(--bimi-orange)' }}>
              <Coins size={22} />
            </div>
          </div>
          <div>
            <div className="metric-value">¥{stats.totalValuation.toLocaleString()}</div>
            <div className="metric-sub">
              <span>{stats.totalStockUnits.toLocaleString()} total units on floor</span>
            </div>
          </div>
        </div>

        {/* In-Stock Rate */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">In-Stock Health</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--bimi-emerald)' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div>
            <div className="metric-value" style={{ color: 'var(--bimi-emerald)' }}>
              {stats.inStockCount} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>({inStockPct}%)</span>
            </div>
            <div className="metric-sub">
              <span>{stats.outOfStockCount} items need restock</span>
            </div>
          </div>
        </div>

        {/* Average Item Price */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Avg Selling Price</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.12)', color: 'var(--bimi-sky)' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div>
            <div className="metric-value">¥{stats.averagePrice.toLocaleString()}</div>
            <div className="metric-sub">
              <span>Tax-included avg: ¥{Math.round(stats.averagePrice * 1.08).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Health Bar Strip */}
      <div className="dashboard-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text-muted)' }}>
            Inventory Availability Breakdown
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ color: 'var(--bimi-emerald)', cursor: 'pointer' }} onClick={() => onNavigateToCatalog({ stockStatus: 'in_stock' })}>
              ● In Stock: {stats.inStockCount} ({inStockPct}%)
            </span>
            <span style={{ color: 'var(--bimi-red)', cursor: 'pointer' }} onClick={() => onNavigateToCatalog({ stockStatus: 'out_of_stock' })}>
              ● Out of Stock: {stats.outOfStockCount} ({outOfStockPct}%)
            </span>
          </div>
        </div>
        <div style={{ width: '100%', height: '14px', borderRadius: 'var(--radius-full)', background: 'var(--bg-muted)', overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              width: `${inStockPct}%`,
              background: 'linear-gradient(90deg, var(--bimi-green) 0%, var(--bimi-emerald) 100%)',
              transition: 'width 600ms ease',
            }}
            title={`In Stock: ${stats.inStockCount}`}
          />
          <div
            style={{
              width: `${outOfStockPct}%`,
              background: 'linear-gradient(90deg, #f87171 0%, var(--bimi-red) 100%)',
              transition: 'width 600ms ease',
            }}
            title={`Out of Stock: ${stats.outOfStockCount}`}
          />
        </div>
      </div>

      {/* Two Column Layout: Categories & Price Tiers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Category Breakdown Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FolderTree size={20} color="var(--bimi-green)" />
              <span>Category Distribution</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {sortedCategories.length} Departments
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedCategories.map(([catName, catData]) => {
              const catPct = Math.round((catData.total / stats.totalProducts) * 100);
              return (
                <div
                  key={catName}
                  onClick={() => onNavigateToCatalog({ category: catName })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--bimi-green)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {catName}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {catData.total} products ({catPct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '6px' }}>
                    <div
                      style={{
                        width: `${catPct}%`,
                        height: '100%',
                        background: 'var(--bimi-green)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>In Stock: {catData.inStock} items</span>
                    <span>Floor Value: ¥{catData.value.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Sourcing & Price Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sourcing Countries */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Globe2 size={20} color="var(--bimi-orange)" />
                <span>Country of Origin Sourcing</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {sortedCountries.length} Origins
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sortedCountries.map(([countryName, count]) => (
                <div
                  key={countryName}
                  onClick={() => onNavigateToCatalog({ country: countryName })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--bimi-orange)';
                    e.currentTarget.style.background = 'var(--bg-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                >
                  <span>{countryName}</span>
                  <span
                    style={{
                      background: 'var(--badge-orange-bg)',
                      color: 'var(--badge-orange-text)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Tiers */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Coins size={20} color="var(--bimi-sky)" />
                <span>Price Bracket Analysis</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Economy (&lt; ¥500)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{stats.priceTiers.under500} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>items</span></div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mid Tier (¥500 - ¥1,000)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{stats.priceTiers.tier500to1000} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>items</span></div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Premium (¥1,000 - ¥2,500)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{stats.priceTiers.tier1000to2500} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>items</span></div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>High Value (&gt; ¥2,500)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{stats.priceTiers.above2500} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>items</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
