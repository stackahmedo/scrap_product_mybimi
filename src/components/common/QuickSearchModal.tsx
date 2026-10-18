import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Eye, Tag } from 'lucide-react';
import { Product } from '../../types/product';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.product_code.toLowerCase().includes(q) ||
            (p.details?.selections?.category_id || '').toLowerCase().includes(q) ||
            (p.details?.selections?.brand_id || '').toLowerCase().includes(q) ||
            (p.details?.fields?.product_tags || '').toLowerCase().includes(q)
          );
        })
        .slice(0, 8)
    : products.slice(0, 6);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onSelectProduct(results[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectProduct]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', overflow: 'hidden' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '12px',
          }}
        >
          <Search size={20} color="var(--bimi-green)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search all 948 products, SKUs, categories... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              width: '100%',
              border: 'none',
              fontSize: '15px',
              padding: '4px',
              boxShadow: 'none',
            }}
          />
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px' }}>
          {results.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No products found matching "{query}"
            </div>
          ) : (
            results.map((p, idx) => {
              const isSelected = selectedIndex === idx;
              const thumb = p.image_files?.[0] || p.image_url;

              return (
                <div
                  key={p.product_code}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-subtle)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <img src={thumb} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        #{p.product_code} · {p.details?.selections?.category_id || 'General'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--bimi-red)', fontSize: '14px' }}>
                      ¥{parseFloat(p.price || '0').toLocaleString()}
                    </span>
                    <ArrowRight size={14} color={isSelected ? 'var(--bimi-green)' : 'var(--text-muted)'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            padding: '10px 16px',
            background: 'var(--bg-subtle)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use ↑ ↓ to navigate · Enter to select</span>
          <span>948 Products indexed</span>
        </div>
      </div>
    </div>
  );
};
