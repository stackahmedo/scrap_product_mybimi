# BIMI Product Catalog Data

This repository contains the catalog export and scraped product data for **My BIMI**.

## Overview

- **Total Products:** 948 products
- **Total Images:** 993 images (main and gallery images)
- **Export Date:** October 2026

## Repository Structure

```
├── README.md               # Repository documentation
├── README.txt              # Original export notes
├── catalog.html            # Standalone offline searchable product catalog
├── products.json           # Complete dataset of all 948 captured products
├── image_manifest.json     # Map of original remote image URLs to local files in images/
└── images/                 # All product images (JPEG / PNG)
```

## Files Description

### 1. `catalog.html`
An interactive, standalone offline catalog. Open this file directly in any web browser to browse, filter, and search across all 948 products, complete with photos, prices, codes, categories, and descriptions.

### 2. `products.json`
Full product database export in JSON format containing:
- Product code, SKU, title, descriptions (plain text & HTML)
- Category, subcategory, brand, country of origin, vendor
- Pricing, discount pricing, stock level, status
- Source URLs & image mapping links

### 3. `image_manifest.json`
Mapping manifest associating original remote image URLs with their saved local file paths inside the `images/` directory.

### 4. `images/`
Contains 993 saved high-resolution product and gallery images.

## Data Notes
- Values are preserved as captured from the source site.
- Listing names reflect full product names from the product forms.
- Original description HTML is preserved in `products.json`.
