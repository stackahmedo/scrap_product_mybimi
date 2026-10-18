import { Product, ProductsDataset, InquiryItem } from '../types/product';
import rawDataset from '../../products.json';

const STORAGE_KEY_OVERRIDES = 'bimi_product_overrides_v1';
const STORAGE_KEY_INQUIRY = 'bimi_inquiry_basket_v1';

// Base dataset loaded from scraped products.json
const baseDataset: ProductsDataset = rawDataset as unknown as ProductsDataset;

export class DataService {
  private static cachedProducts: Product[] | null = null;

  public static getDataset(): ProductsDataset {
    return baseDataset;
  }

  public static getMetadata() {
    return baseDataset.metadata;
  }

  public static getProducts(): Product[] {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }

    const overrides = this.getOverrides();
    const products = baseDataset.products.map((p) => {
      const override = overrides[p.product_code];
      if (!override) return { ...p };

      return {
        ...p,
        ...override,
        price: override.customPrice !== undefined ? String(override.customPrice) : p.price,
        quantity: override.customQuantity !== undefined ? String(override.customQuantity) : p.quantity,
        status: override.customStatus || p.status,
      };
    });

    this.cachedProducts = products;
    return products;
  }

  public static getProductByCode(code: string): Product | undefined {
    return this.getProducts().find((p) => p.product_code === code);
  }

  // Overrides management
  public static getOverrides(): Record<string, Partial<Product>> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_OVERRIDES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public static saveProductOverride(code: string, updates: Partial<Product>) {
    const current = this.getOverrides();
    current[code] = {
      ...(current[code] || {}),
      ...updates,
    };
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    this.cachedProducts = null; // Invalidate cache
  }

  public static resetOverrides() {
    localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    this.cachedProducts = null;
  }

  // Inquiry Basket Management
  public static getInquiries(): InquiryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_INQUIRY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveInquiries(items: InquiryItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save inquiries', e);
    }
  }

  public static addToInquiry(product: Product, quantity = 1): InquiryItem[] {
    const list = this.getInquiries();
    const existingIndex = list.findIndex((item) => item.product.product_code === product.product_code);

    if (existingIndex >= 0) {
      list[existingIndex].orderQuantity += quantity;
    } else {
      list.push({
        product,
        orderQuantity: quantity,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveInquiries(list);
    return list;
  }

  public static removeFromInquiry(productCode: string): InquiryItem[] {
    const list = this.getInquiries().filter((item) => item.product.product_code !== productCode);
    this.saveInquiries(list);
    return list;
  }

  public static updateInquiryQuantity(productCode: string, quantity: number): InquiryItem[] {
    const list = this.getInquiries();
    const item = list.find((it) => it.product.product_code === productCode);
    if (item) {
      if (quantity <= 0) {
        return this.removeFromInquiry(productCode);
      }
      item.orderQuantity = quantity;
      this.saveInquiries(list);
    }
    return list;
  }

  public static clearInquiries() {
    localStorage.removeItem(STORAGE_KEY_INQUIRY);
  }

  // Helper stats calculation
  public static calculateStats(products: Product[]) {
    let inStockCount = 0;
    let outOfStockCount = 0;
    let totalValuation = 0;
    let totalStockUnits = 0;
    const categoryCounts: Record<string, { total: number; inStock: number; value: number }> = {};
    const countryCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};

    const priceTiers = {
      under500: 0,
      tier500to1000: 0,
      tier1000to2500: 0,
      above2500: 0,
    };

    products.forEach((p) => {
      const qty = parseInt(p.quantity || '0', 10) || 0;
      const price = parseFloat(p.price || '0') || 0;
      const cat = p.details?.selections?.category_id || 'Uncategorized';
      const country = p.details?.selections?.country_id || 'Other';
      const brand = p.details?.selections?.brand_id || 'Generic';

      if (qty > 0) {
        inStockCount++;
        totalStockUnits += qty;
        totalValuation += qty * price;
      } else {
        outOfStockCount++;
      }

      // Categories
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { total: 0, inStock: 0, value: 0 };
      }
      categoryCounts[cat].total++;
      if (qty > 0) {
        categoryCounts[cat].inStock++;
        categoryCounts[cat].value += qty * price;
      }

      // Countries
      countryCounts[country] = (countryCounts[country] || 0) + 1;

      // Brands
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;

      // Price Tiers
      if (price < 500) priceTiers.under500++;
      else if (price < 1000) priceTiers.tier500to1000++;
      else if (price < 2500) priceTiers.tier1000to2500++;
      else priceTiers.above2500++;
    });

    return {
      totalProducts: products.length,
      inStockCount,
      outOfStockCount,
      totalStockUnits,
      totalValuation,
      averagePrice: products.length ? Math.round(products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) / products.length) : 0,
      categoryCounts,
      countryCounts,
      brandCounts,
      priceTiers,
    };
  }

  // Export to CSV helper
  public static exportProductsToCsv(products: Product[], filename = 'bimi_products_export.csv') {
    const headers = [
      'Product Code',
      'Name',
      'Price (JPY)',
      'Tax Included (8%)',
      'Stock Quantity',
      'Status',
      'Category',
      'Subcategory',
      'Brand',
      'Country of Origin',
      'Vendor',
      'Source URL',
    ];

    const rows = products.map((p) => {
      const price = parseFloat(p.price) || 0;
      const taxPrice = Math.round(price * 1.08);
      const cat = p.details?.selections?.category_id || '';
      const subcat = p.details?.selections?.subcategory_id || '';
      const brand = p.details?.selections?.brand_id || '';
      const country = p.details?.selections?.country_id || '';
      const vendor = p.details?.selections?.vendor_id || '';

      return [
        `"${p.product_code}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        price,
        taxPrice,
        p.quantity || 0,
        `"${p.status}"`,
        `"${cat}"`,
        `"${subcat}"`,
        `"${brand}"`,
        `"${country}"`,
        `"${vendor}"`,
        `"${p.detail_url || ''}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
