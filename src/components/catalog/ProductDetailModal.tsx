import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  ShoppingBag,
  Tag,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe,
  Layers,
  Building2,
  Barcode,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types/product';
import { BarcodeSvg } from '../common/BarcodeSvg';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToInquiry: (product: Product, quantity: number) => void;
  onOpenPriceTag: (product: Product) => void;
  onOpenEdit: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToInquiry,
  onOpenPriceTag,
  onOpenEdit,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryQty, setInquiryQty] = useState(1);
  const [descTab, setDescTab] = useState<'text' | 'html'>('text');

  const priceNum = parseFloat(product.price) || 0;
  const taxPrice = Math.round(priceNum * 1.08);
  const qtyNum = parseInt(product.quantity, 10) || 0;
  const inStock = qtyNum > 0;

  // Images list
  const images = product.image_files && product.image_files.length > 0
    ? product.image_files
    : [product.image_url];

  const currentImage = images[activeImageIndex] || images[0];

  const tags = product.details?.fields?.product_tags
    ? product.details.fields.product_tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                background: 'var(--bg-subtle)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              #{product.product_code}
            </span>
            <span className={`badge ${inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
              {inStock ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
              {inStock ? `In Stock (${qtyNum} units)` : 'Out of Stock'}
            </span>
          </div>

          <button className="btn-icon" onClick={onClose} title="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '28px' }}>
          {/* Left Column: Photos Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                width: '100%',
                height: '360px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={currentImage}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transition: 'transform 300ms ease',
                }}
              />
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${activeImageIndex === idx ? 'var(--bimi-green)' : 'var(--border-subtle)'}`,
                      padding: '4px',
                      background: 'var(--bg-subtle)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Barcode Widget */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                <Barcode size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <span>JAN / SKU Code:</span>
              </div>
              <BarcodeSvg value={product.product_code} width={140} height={38} />
            </div>
          </div>

          {/* Right Column: Full Specifications & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {product.name}
              </h2>
              {product.details?.fields?.short_descp && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {product.details.fields.short_descp}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Base Selling Price (本体価格)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--bimi-red)' }}>¥</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--bimi-red)' }}>
                    {priceNum.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Tax Included (税込 8%)
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ¥{taxPrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Metadata Attribute Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                fontSize: '12px',
              }}
            >
              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} /> Category
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {product.details?.selections?.category_id || '—'}
                  {product.details?.selections?.subcategory_id && ` / ${product.details.selections.subcategory_id}`}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={13} /> Country of Origin
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {product.details?.selections?.country_id || 'Not specified'}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={13} /> Brand
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {product.details?.selections?.brand_id || 'Generic'}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} /> Vendor
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {product.details?.selections?.vendor_id || 'Bimi Store'}
                </div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Keywords & Tags:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        background: 'var(--bg-muted)',
                        color: 'var(--text-secondary)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <button
                  onClick={() => setDescTab('text')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: descTab === 'text' ? 'var(--bimi-green)' : 'var(--text-muted)',
                    borderBottom: descTab === 'text' ? '2px solid var(--bimi-green)' : 'none',
                    paddingBottom: '4px',
                  }}
                >
                  Text Description
                </button>
                <button
                  onClick={() => setDescTab('html')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: descTab === 'html' ? 'var(--bimi-green)' : 'var(--text-muted)',
                    borderBottom: descTab === 'html' ? '2px solid var(--bimi-green)' : 'none',
                    paddingBottom: '4px',
                  }}
                >
                  Original Source HTML
                </button>
              </div>

              <div
                style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-subtle)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  whiteSpace: descTab === 'text' ? 'pre-line' : 'normal',
                }}
              >
                {descTab === 'text' ? (
                  product.details?.description_text || 'No description available.'
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.details?.fields?.long_descp || '<p>No HTML description</p>',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {product.detail_url && (
            <a
              href={product.detail_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ marginRight: 'auto' }}
            >
              <ExternalLink size={14} />
              <span>Open on mybimi.jp</span>
            </a>
          )}

          <button className="btn-secondary" onClick={() => onOpenEdit(product)}>
            <Edit3 size={14} />
            <span>Edit Product</span>
          </button>

          <button className="btn-secondary" onClick={() => onOpenPriceTag(product)}>
            <Tag size={14} />
            <span>Generate Price Tag</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              min={1}
              max={999}
              value={inquiryQty}
              onChange={(e) => setInquiryQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              style={{ width: '56px', padding: '8px', textAlign: 'center', fontSize: '13px' }}
              title="Quantity to add"
            />
            <button
              className="btn-primary"
              onClick={() => {
                onAddToInquiry(product, inquiryQty);
                onClose();
              }}
            >
              <ShoppingBag size={15} />
              <span>Add to Inquiry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
