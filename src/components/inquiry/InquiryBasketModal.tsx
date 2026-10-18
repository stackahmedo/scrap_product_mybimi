import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Printer,
  Download,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { InquiryItem } from '../../types/product';
import { DataService } from '../../services/dataService';

interface InquiryBasketModalProps {
  items: InquiryItem[];
  onUpdateQuantity: (code: string, qty: number) => void;
  onRemoveItem: (code: string) => void;
  onClearAll: () => void;
  onNavigateToCatalog: () => void;
}

export const InquiryBasketModal: React.FC<InquiryBasketModalProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
  onNavigateToCatalog,
}) => {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + price * item.orderQuantity;
  }, 0);

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  const totalUnits = items.reduce((sum, it) => sum + it.orderQuantity, 0);

  const handleExportInquiryCsv = () => {
    const headers = [
      'Item No',
      'Product Code',
      'Product Name',
      'Unit Price (Excl Tax)',
      'Order Qty',
      'Total Excl Tax',
      'Tax Included (8%)',
      'Category',
      'Brand',
      'Country',
    ];

    const rows = items.map((it, idx) => {
      const p = it.product;
      const unitP = parseFloat(p.price) || 0;
      const itemSub = unitP * it.orderQuantity;
      const itemTot = Math.round(itemSub * 1.08);
      return [
        idx + 1,
        `"${p.product_code}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        unitP,
        it.orderQuantity,
        itemSub,
        itemTot,
        `"${p.details?.selections?.category_id || ''}"`,
        `"${p.details?.selections?.brand_id || ''}"`,
        `"${p.details?.selections?.country_id || ''}"`,
      ].join(',');
    });

    // Add summary row
    rows.push(['', '', '"SUBTOTAL"', '', '', subtotal, '', '', '', ''].join(','));
    rows.push(['', '', '"TAX (8%)"', '', '', tax, '', '', '', ''].join(','));
    rows.push(['', '', '"TOTAL (INC TAX)"', '', '', total, '', '', '', ''].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bimi_inquiry_order_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintQuotation = () => {
    window.print();
  };

  if (items.length === 0) {
    return (
      <div
        className="dashboard-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            marginBottom: '16px',
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
          Your Inquiry Basket is Empty
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '24px' }}>
          Browse our 948 catalog products and add items to generate official supplier procurement quotes, wholesale orders, or export CSV manifests.
        </p>
        <button className="btn-primary" onClick={onNavigateToCatalog}>
          <span>Explore Product Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Actions */}
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
            Supplier Inquiry & Procurement Order Basket
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {items.length} line items ({totalUnits} total units) ready for procurement quotation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={onClearAll} style={{ color: 'var(--bimi-red)' }}>
            <Trash2 size={16} />
            <span>Clear Basket</span>
          </button>

          <button className="btn-secondary" onClick={handleExportInquiryCsv}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button className="btn-primary" onClick={handlePrintQuotation}>
            <Printer size={16} />
            <span>Print Official Order Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Item List & Financial Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Items Table */}
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Item</th>
                <th>Product Description</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Quantity</th>
                <th style={{ textAlign: 'right' }}>Line Total</th>
                <th className="no-print" style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const p = it.product;
                const unitPrice = parseFloat(p.price) || 0;
                const lineTotal = unitPrice * it.orderQuantity;
                const thumb = p.image_files?.[0] || p.image_url;

                return (
                  <tr key={p.product_code}>
                    <td>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <img src={thumb} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Code: {p.product_code} · {p.details?.selections?.category_id || 'General'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ¥{unitPrice.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '2px 6px',
                        }}
                      >
                        <button
                          className="no-print"
                          onClick={() => onUpdateQuantity(p.product_code, it.orderQuantity - 1)}
                          style={{ padding: '4px', color: 'var(--text-secondary)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>
                          {it.orderQuantity}
                        </span>
                        <button
                          className="no-print"
                          onClick={() => onUpdateQuantity(p.product_code, it.orderQuantity + 1)}
                          style={{ padding: '4px', color: 'var(--text-secondary)' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
                      ¥{lineTotal.toLocaleString()}
                    </td>
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => onRemoveItem(p.product_code)}
                        style={{ color: 'var(--text-muted)', padding: '6px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Strip */}
        <div className="dashboard-panel" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            Quotation Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal (Excl. Tax):</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>¥{subtotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Consumption Tax (8%):</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>¥{tax.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Total Units Ordered:</span>
              <span style={{ fontWeight: 700 }}>{totalUnits} units</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: '14px',
                borderTop: '2px solid var(--border-subtle)',
                marginTop: '6px',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                Total (税込):
              </span>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--bimi-green-light)',
                  }}
                >
                  ¥{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            Prices reflect official catalog rates. Formal tax invoice and wholesale purchase order documents can be exported for accounting and customs clearance.
          </div>
        </div>
      </div>
    </div>
  );
};
