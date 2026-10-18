import React, { useState } from 'react';
import { Printer, Sliders, CheckSquare, Search, Copy, Download } from 'lucide-react';
import { Product } from '../../types/product';
import { BarcodeSvg } from '../common/BarcodeSvg';

interface PriceTagStudioProps {
  products: Product[];
  initialSelectedProduct?: Product | null;
}

export const PriceTagStudio: React.FC<PriceTagStudioProps> = ({
  products,
  initialSelectedProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialSelectedProduct || products[0]
  );
  const [search, setSearch] = useState('');
  const [taxRate, setTaxRate] = useState<0.08 | 0.1>(0.08);
  const [showCutLines, setShowCutLines] = useState(true);
  const [topRibbonJa, setTopRibbonJa] = useState('新鮮で美味しい');
  const [topRibbonEn, setTopRibbonEn] = useState('Fresh & Delicious');
  const [bottomLeftText, setBottomLeftText] = useState('Good Food  Better Life');
  const [bottomRightText, setBottomRightText] = useState('安心・ハラール | Halal & Quality');
  const [paperFormat, setPaperFormat] = useState<'single' | 'a4-4up' | 'a4-8up'>('single');

  // Filter products for quick selection
  const filteredProducts = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.product_code.toLowerCase().includes(q) ||
        (p.details?.selections?.category_id || '').toLowerCase().includes(q)
      );
    })
    .slice(0, 30);

  const priceNum = parseFloat(selectedProduct?.price || '0') || 0;
  // Tax price rounded to integer (no decimal) as established in previous conversation!
  const taxPriceNum = Math.round(priceNum * (1 + taxRate));

  const handlePrint = () => {
    window.print();
  };

  const renderOfficialBimiCard = (product: Product, index = 0) => {
    const cardPrice = parseFloat(product.price || '0') || 0;
    const cardTaxPrice = Math.round(cardPrice * (1 + taxRate));

    return (
      <div
        key={`${product.product_code}-${index}`}
        className="bimi-shelf-talker-card"
        style={{
          width: '340px',
          height: '240px',
          backgroundColor: '#ffffff',
          borderRadius: showCutLines ? '8px' : '0',
          border: showCutLines ? '1.5px dashed #94a3b8' : '1px solid #e2e8f0',
          boxShadow: showCutLines ? 'none' : '0 4px 14px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          color: '#000000',
          pageBreakInside: 'avoid',
          margin: '0 auto 16px',
        }}
      >
        {/* 1. TOP DUAL RIBBON */}
        <div
          style={{
            height: '36px',
            background: '#005A36', // BIMI Green
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          {/* Left Ribbon Text */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', zIndex: 2 }}>
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>
              {topRibbonJa}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>
              {topRibbonEn}
            </span>
          </div>

          {/* Right Saffron Diagonal Cut Wedge */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '80px',
              backgroundColor: '#F25C05',
              clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              zIndex: 2,
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.5px',
              color: '#ffffff',
            }}
          >
            My BIMI
          </div>
        </div>

        {/* 2. PRODUCT TITLE SECTION */}
        <div style={{ padding: '10px 14px 6px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.25,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </h3>

            {/* Country Badge */}
            {product.details?.selections?.country_id && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#fff7ed',
                  color: '#c2410c',
                  border: '1px solid #ffedd5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                産地: {product.details.selections.country_id}
              </span>
            )}
          </div>

          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', fontWeight: 600 }}>
            {product.details?.selections?.category_id || 'General'} · Code: {product.product_code}
          </div>

          {/* 3. BIG BOLD PRICE STRIP */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '6px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            {/* Main Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#D6001C' }}>¥</span>
              <span
                style={{
                  fontFamily: 'Impact, "Arial Black", sans-serif',
                  fontSize: '46px',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: '#D6001C',
                  letterSpacing: '-1px',
                }}
              >
                {cardPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#4b5563', marginLeft: '4px' }}>
                (本体価格)
              </span>
            </div>

            {/* Hairline & Tax-Included Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderLeft: '1.5px solid #cbd5e1',
                paddingLeft: '10px',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#374151', display: 'block' }}>
                  税込価格 ({Math.round(taxRate * 100)}%)
                </span>
                <span
                  style={{
                    fontFamily: 'Impact, "Arial Black", sans-serif',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#111827',
                  }}
                >
                  {cardTaxPrice.toLocaleString()}円
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. JAN BARCODE & SKU */}
        <div
          style={{
            padding: '2px 14px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'monospace' }}>
            MYBIMI-RTL-{product.product_code}
          </span>
          <BarcodeSvg value={product.product_code} width={130} height={28} showText={false} />
        </div>

        {/* 5. BOTTOM TWO-TONE FOOTER (Forward Diagonal Slash Cut /) */}
        <div
          style={{
            height: '24px',
            backgroundColor: '#F25C05', // Right Orange
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Left Green Block */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '52%',
              backgroundColor: '#005A36',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px' }}>
              {bottomLeftText}
            </span>
          </div>

          {/* Right Text */}
          <div style={{ marginLeft: 'auto', paddingRight: '12px' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#ffffff' }}>
              {bottomRightText}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Studio Header Bar */}
      <div
        className="no-print"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Official BIMI Shelf Talker & Price Tag Studio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Generate authentic Japanese retail shelf cards with standard tax calculations, crop lines, and JAN barcodes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handlePrint} id="btn-print-talkers">
            <Printer size={16} />
            <span>Print Shelf Talkers</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workbench */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Controls Panel */}
        <div
          className="dashboard-panel no-print"
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          <div className="panel-title">
            <Sliders size={18} color="var(--bimi-green)" />
            <span>Tag Specifications</span>
          </div>

          {/* Product Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Select Product:
            </label>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by code or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: '12px' }}
              />
            </div>

            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
              }}
            >
              {filteredProducts.map((p) => (
                <div
                  key={p.product_code}
                  onClick={() => setSelectedProduct(p)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: selectedProduct.product_code === p.product_code ? 'var(--bimi-green-glow)' : 'transparent',
                    color: selectedProduct.product_code === p.product_code ? 'var(--bimi-green-light)' : 'inherit',
                    fontWeight: selectedProduct.product_code === p.product_code ? 700 : 500,
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    ¥{p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Rate Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Applicable Consumption Tax Rate:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setTaxRate(0.08)}
                className={taxRate === 0.08 ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '12px', padding: '8px' }}
              >
                8% (Food & Groceries)
              </button>
              <button
                type="button"
                onClick={() => setTaxRate(0.1)}
                className={taxRate === 0.1 ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '12px', padding: '8px' }}
              >
                10% (Standard Goods)
              </button>
            </div>
          </div>

          {/* Print Layout Format */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Paper Layout Format:
            </label>
            <select
              value={paperFormat}
              onChange={(e) => setPaperFormat(e.target.value as any)}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13px' }}
            >
              <option value="single">Single Card Preview</option>
              <option value="a4-4up">A4 Sheet (4 Cards Batch)</option>
              <option value="a4-8up">A4 Sheet (8 Cards Compact Batch)</option>
            </select>
          </div>

          {/* Cut Guidelines Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
            <input
              type="checkbox"
              id="cutlines"
              checked={showCutLines}
              onChange={(e) => setShowCutLines(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="cutlines" style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              Show cutting crop dashed lines
            </label>
          </div>

          {/* Custom Ribbon Text */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Custom Top Ribbon (JA / EN):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <input
                type="text"
                value={topRibbonJa}
                onChange={(e) => setTopRibbonJa(e.target.value)}
                style={{ padding: '7px 10px', fontSize: '12px' }}
              />
              <input
                type="text"
                value={topRibbonEn}
                onChange={(e) => setTopRibbonEn(e.target.value)}
                style={{ padding: '7px 10px', fontSize: '12px' }}
              />
            </div>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div
          className="dashboard-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '520px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            padding: '36px 20px',
          }}
        >
          <div
            className="no-print"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: 'var(--text-muted)',
              marginBottom: '20px',
            }}
          >
            Live Print & Shelf Preview
          </div>

          {/* Render Cards according to Paper Format */}
          {paperFormat === 'single' ? (
            renderOfficialBimiCard(selectedProduct)
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 340px)',
                gap: '16px',
                justifyContent: 'center',
              }}
            >
              {products
                .filter((p) => p.details?.selections?.category_id === selectedProduct.details?.selections?.category_id || true)
                .slice(0, paperFormat === 'a4-4up' ? 4 : 8)
                .map((p, idx) => renderOfficialBimiCard(p, idx))}
            </div>
          )}

          <div
            className="no-print"
            style={{
              marginTop: '20px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            Dimensions: 340px × 240px (Standard Japanese Supermarket Shelf Talker).
          </div>
        </div>
      </div>
    </div>
  );
};
