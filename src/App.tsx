import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { CatalogView } from './components/catalog/CatalogView';
import { PriceTagStudio } from './components/pricetag/PriceTagStudio';
import { InquiryBasketModal } from './components/inquiry/InquiryBasketModal';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { ProductEditModal } from './components/catalog/ProductEditModal';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { Product, InquiryItem, FilterState } from './types/product';
import { DataService } from './services/dataService';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bimi_theme') as 'light' | 'dark') || 'light';
  });

  // Current tab
  const [currentTab, setCurrentTab] = useState<'analytics' | 'catalog' | 'pricetags' | 'inquiry'>('analytics');

  // Products state (can be refreshed on edit/override)
  const [products, setProducts] = useState<Product[]>(() => DataService.getProducts());

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => DataService.getInquiries());

  // Filter state for catalog navigation
  const [catalogFilter, setCatalogFilter] = useState<Partial<FilterState>>({});

  // Active Modals & Selected items
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [tagStudioProduct, setTagStudioProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bimi_theme', theme);
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K or / to open search (when not typing in an input)
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName))
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleRefreshProducts = () => {
    setProducts([...DataService.getProducts()]);
  };

  // Inquiry actions
  const handleAddToInquiry = (product: Product, quantity = 1) => {
    const updated = DataService.addToInquiry(product, quantity);
    setInquiries([...updated]);
  };

  const handleUpdateInquiryQty = (code: string, qty: number) => {
    const updated = DataService.updateInquiryQuantity(code, qty);
    setInquiries([...updated]);
  };

  const handleRemoveInquiry = (code: string) => {
    const updated = DataService.removeFromInquiry(code);
    setInquiries([...updated]);
  };

  const handleClearInquiries = () => {
    DataService.clearInquiries();
    setInquiries([]);
  };

  // Price tag navigation shortcut
  const handleOpenPriceTag = (product: Product) => {
    setTagStudioProduct(product);
    setCurrentTab('pricetags');
  };

  // Navigation from dashboard with pre-set filters
  const handleNavigateToCatalogWithFilter = (filter: Partial<FilterState>) => {
    setCatalogFilter(filter);
    setCurrentTab('catalog');
  };

  return (
    <div className="app-container">
      {/* Sticky Global Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        inquiryCount={inquiries.reduce((sum, it) => sum + it.orderQuantity, 0)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="main-content">
        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            products={products}
            onNavigateToCatalog={handleNavigateToCatalogWithFilter}
            onNavigateToPriceTags={() => setCurrentTab('pricetags')}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogView
            products={products}
            initialFilter={catalogFilter}
            onSelectProduct={setSelectedProductForDetail}
            onAddToInquiry={handleAddToInquiry}
            onOpenPriceTag={handleOpenPriceTag}
            onOpenEdit={setSelectedProductForEdit}
          />
        )}

        {currentTab === 'pricetags' && (
          <PriceTagStudio
            products={products}
            initialSelectedProduct={tagStudioProduct}
          />
        )}

        {currentTab === 'inquiry' && (
          <InquiryBasketModal
            items={inquiries}
            onUpdateQuantity={handleUpdateInquiryQty}
            onRemoveItem={handleRemoveInquiry}
            onClearAll={handleClearInquiries}
            onNavigateToCatalog={() => setCurrentTab('catalog')}
          />
        )}
      </main>

      {/* Product Detail 360 Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToInquiry={handleAddToInquiry}
        onOpenPriceTag={handleOpenPriceTag}
        onOpenEdit={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForEdit(p);
        }}
      />

      {/* Product Edit Modal */}
      <ProductEditModal
        product={selectedProductForEdit}
        onClose={() => setSelectedProductForEdit(null)}
        onSaved={handleRefreshProducts}
      />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProductForDetail(p)}
      />
    </div>
  );
};

export default App;
