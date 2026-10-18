import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShoppingBag,
  Tag,
  Edit3,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, FilterState } from '../../types/product';
import { DataService } from '../../services/dataService';

interface CatalogViewProps {
  products: Product[];
  initialFilter?: Partial<FilterState>;
  onSelectProduct: (product: Product) => void;
  onAddToInquiry: (product: Product, quantity?: number) => void;
  onOpenPriceTag: (product: Product) => void;
  onOpenEdit: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  initialFilter,
  onSelectProduct,
  onAddToInquiry,
  onOpenPriceTag,
  onOpenEdit,
}) => {
  // Filter state
  const [search, setSearch] = useState(initialFilter?.searchQuery || '');
  const [category, setCategory] = useState(initialFilter?.category || 'all');
  const [country, setCountry] = useState(initialFilter?.country || 'all');
  const [brand, setBrand] = useState(initialFilter?.brand || 'all');
  const [stockStatus, setStockStatus] = useState<FilterState['stockStatus']>(
    initialFilter?.stockStatus || 'all'
  );
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Selected items for bulk operations
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  // Derive unique categories, brands, countries
  const { categories, brands, countries } = useMemo(() => {
    const cats = new Set<string>();
    const brs = new Set<string>();
    const cnts = new Set<string>();

    products.forEach((p) => {
      const s = p.details?.selections;
      if (s?.category_id) cats.add(s.category_id);
      if (s?.brand_id) brs.add(s.brand_id);
      if (s?.country_id) cnts.add(s.country_id);
    });

    return {
      categories: Array.from(cats).sort(),
      brands: Array.from(brs).sort(),
      countries: Array.from(cnts).sort(),
    };
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((p) => {
      // Search
      if (query) {
        const matchesQuery =
          p.name.toLowerCase().includes(query) ||
          p.product_code.toLowerCase().includes(query) ||
          (p.details?.fields?.product_tags || '').toLowerCase().includes(query) ||
          (p.details?.selections?.category_id || '').toLowerCase().includes(query) ||
          (p.details?.selections?.brand_id || '').toLowerCase().includes(query);

        if (!matchesQuery) return false;
      }

      // Category
      if (category !== 'all') {
        if (p.details?.selections?.category_id !== category) return false;
      }

      // Country
      if (country !== 'all') {
        if (p.details?.selections?.country_id !== country) return false;
      }

      // Brand
      if (brand !== 'all') {
        if (p.details?.selections?.brand_id !== brand) return false;
      }

      // Stock
      const qty = parseInt(p.quantity, 10) || 0;
      if (stockStatus === 'in_stock' && qty <= 0) return false;
      if (stockStatus === 'out_of_stock' && qty > 0) return false;
      if (stockStatus === 'low_stock' && (qty <= 0 || qty > 10)) return false;

      return true;
    });
  }, [products, search, category, country, brand, stockStatus]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
      case 'price_desc':
        return list.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
      case 'stock_desc':
        return list.sort((a, b) => (parseInt(b.quantity, 10) || 0) - (parseInt(a.quantity, 10) || 0));
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'code_asc':
        return list.sort((a, b) => a.product_code.localeCompare(b.product_code));
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setCountry('all');
    setBrand('all');
    setStockStatus('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleSelectAllOnPage = () => {
    const next = new Set(selectedCodes);
    paginatedProducts.forEach((p) => next.add(p.product_code));
    setSelectedCodes(next);
  };

  const handleClearSelection = () => {
    setSelectedCodes(new Set());
  };

  const toggleSelect = (code: string) => {
    const next = new Set(selectedCodes);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSelectedCodes(next);
  };

  const handleBulkExport = () => {
    const selected = products.filter((p) => selectedCodes.has(p.product_code));
    DataService.exportProductsToCsv(
      selected.length > 0 ? selected : sortedProducts,
      `bimi_selected_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleBulkAddToInquiry = () => {
    const selected = products.filter((p) => selectedCodes.has(p.product_code));
    selected.forEach((p) => DataService.addToInquiry(p, 1));
    alert(`Added ${selected.length} products to Inquiry Basket!`);
    handleClearSelection();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Row 1: Search & Core Selectors */}
        <div className="filter-row-top">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search across 948 products by code, title, category, tags..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              id="catalog-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '12px', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Country Selector */}
          <select
            className="filter-select"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Origins ({countries.length})</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Brand Selector */}
          <select
            className="filter-select"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            className="filter-select"
            value={stockStatus}
            onChange={(e) => {
              setStockStatus(e.target.value as any);
              setCurrentPage(1);
            }}
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock Only</option>
            <option value="low_stock">Low Stock (≤ 10)</option>
          </select>

          {/* Sort By */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="featured">Sort: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_desc">Highest Stock First</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="code_asc">Code: Numeric</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: Category Chips */}
        <div className="category-pills-row">
          <button
            className={`cat-pill ${category === 'all' ? 'active' : ''}`}
            onClick={() => {
              setCategory('all');
              setCurrentPage(1);
            }}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.details?.selections?.category_id === cat).length;
            return (
              <button
                key={cat}
                className={`cat-pill ${category === cat ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          Showing <strong>{sortedProducts.length}</strong> matching products
          {selectedCodes.size > 0 && (
            <span style={{ marginLeft: '12px', color: 'var(--bimi-orange)', fontWeight: 700 }}>
              ({selectedCodes.size} selected)
            </span>
          )}
        </div>

        {/* Bulk Actions if Selected */}
        {selectedCodes.size > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleBulkAddToInquiry} style={{ fontSize: '12px', padding: '6px 12px' }}>
              <ShoppingBag size={14} />
              <span>Add Selected ({selectedCodes.size}) to Inquiry</span>
            </button>
            <button className="btn-secondary" onClick={handleBulkExport} style={{ fontSize: '12px', padding: '6px 12px' }}>
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button className="btn-secondary" onClick={handleClearSelection} style={{ fontSize: '12px', padding: '6px 12px' }}>
              Clear Selection
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleSelectAllOnPage}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Select Page ({paginatedProducts.length})
            </button>
            <button
              onClick={handleBulkExport}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              title="Export Current Filtered Results"
            >
              <Download size={14} />
              <span>Export Results</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Products Display (Grid vs Table) */}
      {sortedProducts.length === 0 ? (
        <div
          className="dashboard-panel"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Filter size={36} color="var(--text-muted)" />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Products Match Your Filter</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px' }}>
            Try adjusting your search terms, clearing brand/country constraints, or resetting filters.
          </p>
          <button className="btn-primary" onClick={handleResetFilters} style={{ marginTop: '8px' }}>
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="product-grid">
          {paginatedProducts.map((p) => {
            const priceNum = parseFloat(p.price) || 0;
            const taxPrice = Math.round(priceNum * 1.08);
            const qtyNum = parseInt(p.quantity, 10) || 0;
            const inStock = qtyNum > 0;
            const thumb = p.image_files?.[0] || p.image_url;
            const isSelected = selectedCodes.has(p.product_code);

            return (
              <div
                key={p.product_code}
                className="product-card"
                style={{
                  borderColor: isSelected ? 'var(--bimi-green)' : undefined,
                  boxShadow: isSelected ? '0 0 0 2px var(--bimi-green)' : undefined,
                }}
              >
                {/* Image & Badges */}
                <div
                  className="product-card-image-wrap"
                  onClick={() => onSelectProduct(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-card-badges">
                    <span className={`badge ${inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                      {inStock ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                      {inStock ? `In Stock (${qtyNum})` : 'Out of Stock'}
                    </span>
                    {p.details?.selections?.category_id && (
                      <span className="badge badge-category">{p.details.selections.category_id}</span>
                    )}
                    {p.details?.selections?.country_id && (
                      <span className="badge badge-country">{p.details.selections.country_id}</span>
                    )}
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 3,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(p.product_code)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <img
                    src={thumb}
                    alt={p.name}
                    className="product-card-img"
                    loading="lazy"
                  />
                </div>

                {/* Details Content */}
                <div className="product-card-content">
                  <div>
                    <div className="product-code-meta">
                      <span>#{p.product_code}</span>
                      <span>{p.details?.selections?.brand_id || 'Generic'}</span>
                    </div>

                    <h3
                      className="product-title"
                      onClick={() => onSelectProduct(p)}
                      style={{ cursor: 'pointer' }}
                      title={p.name}
                    >
                      {p.name}
                    </h3>

                    {p.details?.fields?.short_descp && (
                      <p className="product-desc-snippet">{p.details.fields.short_descp}</p>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div>
                    <div className="product-price-section">
                      <div>
                        <span className="price-main">
                          <span className="price-currency">¥</span>
                          {priceNum.toLocaleString()}
                        </span>
                      </div>
                      <span className="price-tax-inc">税込 ¥{taxPrice.toLocaleString()}</span>
                    </div>

                    <div className="product-actions-bar">
                      <button
                        className="btn-primary"
                        onClick={() => onSelectProduct(p)}
                        title="View Full Specifications"
                      >
                        <Eye size={14} />
                        <span>360° View</span>
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => onAddToInquiry(p, 1)}
                        title="Add to Inquiry Basket"
                      >
                        <ShoppingBag size={15} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => onOpenPriceTag(p)}
                        title="Generate Price Tag"
                      >
                        <Tag size={15} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => onOpenEdit(p)}
                        title="Quick Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={paginatedProducts.every((p) => selectedCodes.has(p.product_code))}
                    onChange={() => {
                      if (paginatedProducts.every((p) => selectedCodes.has(p.product_code))) {
                        handleClearSelection();
                      } else {
                        handleSelectAllOnPage();
                      }
                    }}
                  />
                </th>
                <th style={{ width: '60px' }}>Photo</th>
                <th>SKU</th>
                <th>Product Title</th>
                <th>Category</th>
                <th>Origin</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Base (¥)</th>
                <th style={{ textAlign: 'right' }}>Tax-Inc (8%)</th>
                <th style={{ textAlign: 'right', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
                const priceNum = parseFloat(p.price) || 0;
                const taxPrice = Math.round(priceNum * 1.08);
                const qtyNum = parseInt(p.quantity, 10) || 0;
                const inStock = qtyNum > 0;
                const thumb = p.image_files?.[0] || p.image_url;
                const isSelected = selectedCodes.has(p.product_code);

                return (
                  <tr key={p.product_code} style={{ background: isSelected ? 'var(--bimi-green-glow)' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.product_code)}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                        onClick={() => onSelectProduct(p)}
                      >
                        <img src={thumb} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {p.product_code}
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
                        onClick={() => onSelectProduct(p)}
                      >
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {p.details?.selections?.brand_id || 'Generic'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-category">{p.details?.selections?.category_id || '—'}</span>
                    </td>
                    <td>{p.details?.selections?.country_id || '—'}</td>
                    <td>
                      <span className={`badge ${inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                        {inStock ? `${qtyNum} in stock` : '0 (out)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ¥{priceNum.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                      ¥{taxPrice.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn-icon" onClick={() => onSelectProduct(p)} title="View Detail">
                          <Eye size={14} />
                        </button>
                        <button className="btn-icon" onClick={() => onAddToInquiry(p, 1)} title="Add to Inquiry">
                          <ShoppingBag size={14} />
                        </button>
                        <button className="btn-icon" onClick={() => onOpenPriceTag(p)} title="Price Tag">
                          <Tag size={14} />
                        </button>
                        <button className="btn-icon" onClick={() => onOpenEdit(p)} title="Edit">
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
            {sortedProducts.length} total products)
          </div>

          <div className="pagination-pages">
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, idx) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = idx + 1;
              } else if (currentPage <= 4) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + idx;
              } else {
                pageNum = currentPage - 3 + idx;
              }

              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
