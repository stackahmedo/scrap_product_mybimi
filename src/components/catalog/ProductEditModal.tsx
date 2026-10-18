import React, { useState } from 'react';
import { X, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Product } from '../../types/product';
import { DataService } from '../../services/dataService';

interface ProductEditModalProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSaved,
}) => {
  if (!product) return null;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [status, setStatus] = useState(product.status);
  const [notes, setNotes] = useState(product.userNotes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    const numQty = parseInt(quantity, 10);

    DataService.saveProductOverride(product.product_code, {
      name,
      customPrice: isNaN(numPrice) ? undefined : numPrice,
      customQuantity: isNaN(numQty) ? undefined : numQty,
      customStatus: status,
      userNotes: notes,
    });

    onSaved();
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset this product back to original scraped site data?')) {
      const overrides = DataService.getOverrides();
      delete overrides[product.product_code];
      try {
        localStorage.setItem('bimi_product_overrides_v1', JSON.stringify(overrides));
      } catch (e) {
        console.error(e);
      }
      onSaved();
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Edit Product Details</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.product_code})</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Note alert */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(242, 92, 5, 0.1)',
                border: '1px solid rgba(242, 92, 5, 0.25)',
                fontSize: '12px',
                color: 'var(--bimi-orange)',
              }}
            >
              <AlertTriangle size={16} />
              <span>Edits are saved to your browser session and immediately update catalog calculations.</span>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Product Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
              />
            </div>

            {/* Price & Quantity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Base Price (¥ JPY):
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Floor Stock (Units):
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Listing Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
              >
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>

            {/* Internal Manager Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Custom Manager Notes:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Supplier contacts, replenishment alerts, or seasonal promo notes..."
                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              style={{ marginRight: 'auto', color: 'var(--bimi-red)' }}
            >
              <RotateCcw size={14} />
              <span>Reset to Baseline</span>
            </button>

            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
