// Single source of truth for GEK | X pricing tiers.
// Update prices here -> /pricing endpoint + /quote endpoint + Roll Studio frontend (when fetched dynamically) all stay in sync.

const VAT_RATE = 0.21;

const PRICING = {
  dtf: {
    label: 'DTF Roll Studio',
    rollWidthCm: 35,
    printableWidthCm: 32,
    currency: 'EUR',
    tiers: [
      { id: 'bulk',    minMeters: 5,    maxMeters: Infinity, pricePerMeter: 14.90, etaDays: 3, label: 'Bulk' },
      { id: 'pro',     minMeters: 0.01, maxMeters: 5,        pricePerMeter: 22.90, etaDays: 2, label: 'Pro' },
      { id: 'express', minMeters: 0.01, maxMeters: Infinity, pricePerMeter: 32.90, etaDays: 1, label: 'Express 24h', expressOnly: true }
    ],
    samplePack: { priceEur: 4.95, sizeCm: '30x30' }
  },
  uvdtf: {
    label: 'UV-DTF Roll Studio',
    rollWidthCm: 31,
    printableWidthCm: 29,
    currency: 'EUR',
    tiers: [
      { id: 'bulk',    minMeters: 3,    maxMeters: Infinity, pricePerMeter: 28.90, etaDays: 3, label: 'Bulk' },
      { id: 'pro',     minMeters: 0.01, maxMeters: 3,        pricePerMeter: 44.90, etaDays: 2, label: 'Pro' },
      { id: 'express', minMeters: 0.01, maxMeters: Infinity, pricePerMeter: 59.90, etaDays: 1, label: 'Express 3D-relief 24h', expressOnly: true }
    ]
  },
  tiffLab: {
    label: 'GEK | TIFF Lab',
    plans: [
      { id: 'starter', monthlyEur: 0,   quota: 5,        watermark: true,  apiAccess: false },
      { id: 'studio',  monthlyEur: 29,  quota: 200,      watermark: false, apiAccess: true  },
      { id: 'pro',     monthlyEur: 89,  quota: 1000,     watermark: false, apiAccess: true,  priorityQueue: true },
      { id: 'agency',  monthlyEur: 249, quota: Infinity, watermark: false, apiAccess: true,  whiteLabel: true }
    ]
  },
  rollStudioLicense: {
    label: 'GEK | Roll Studio License (White-Label)',
    plans: [
      { id: 'solo',       setupEur: 499,  monthlyEur: 149, ordersPerMonth: 100,      customDomain: false },
      { id: 'plus',       setupEur: 499,  monthlyEur: 299, ordersPerMonth: 500,      customDomain: true  },
      { id: 'enterprise', setupEur: 1499, monthlyEur: 499, ordersPerMonth: Infinity, customDomain: true, sla: true }
    ]
  }
};

function findTier(productKey, meters, wantExpress = false) {
  const product = PRICING[productKey];
  if (!product || !product.tiers) return null;

  if (wantExpress) {
    const express = product.tiers.find(t => t.id === 'express');
    if (express) return express;
  }
  // Pick first non-express tier whose [minMeters, maxMeters) range contains the request.
  const m = Number(meters);
  return product.tiers.find(t => !t.expressOnly && m >= t.minMeters && m < t.maxMeters) || null;
}

function quote(productKey, meters, wantExpress = false) {
  const tier = findTier(productKey, meters, wantExpress);
  if (!tier) return { error: 'No matching tier' };

  const m = Number(meters);
  const subtotal = +(tier.pricePerMeter * m).toFixed(2);
  const vat = +(subtotal * VAT_RATE).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  return {
    product: PRICING[productKey].label,
    tier: tier.id,
    tierLabel: tier.label,
    meters: m,
    pricePerMeter: tier.pricePerMeter,
    subtotal,
    vat,
    vatRate: VAT_RATE,
    total,
    currency: PRICING[productKey].currency,
    etaDays: tier.etaDays
  };
}

module.exports = { PRICING, VAT_RATE, findTier, quote };
