/**
 * B2B 订单数量分析处理逻辑
 * 输入：领星 MCP 返回的原始数据
 * 输出：结构化分析结果，用于填充 HTML 报告
 */

// ===== CONSTANTS =====
const INTERVALS = [
  { label: '1件', min: 1, max: 1 },
  { label: '2件', min: 2, max: 2 },
  { label: '3件', min: 3, max: 3 },
  { label: '4件', min: 4, max: 4 },
  { label: '5件', min: 5, max: 5 },
  { label: '6-9件', min: 6, max: 9 },
  { label: '10-19件', min: 10, max: 19 },
  { label: '20-29件', min: 20, max: 29 },
  { label: '30-49件', min: 30, max: 49 },
  { label: '50-99件', min: 50, max: 99 },
  { label: '100件及以上', min: 100, max: Infinity }
];

const HIGH_FREQ_CHECKPOINTS = [2, 3, 5, 10, 20, 30, 50];

// ===== HELPER FUNCTIONS =====
function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.ceil(p / 100 * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

function mode(arr) {
  if (!arr.length) return null;
  const freq = {};
  arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
  let maxCount = 0, maxVal = null;
  Object.entries(freq).forEach(([val, count]) => {
    if (count > maxCount) { maxCount = count; maxVal = parseInt(val); }
  });
  return { value: maxVal, count: maxCount };
}

function detectAbnormalMax(quantities) {
  // Detect outlier: if max is > 3x P90, consider it abnormal
  const sorted = [...quantities].sort((a, b) => a - b);
  const p90 = percentile(sorted, 90);
  const max = sorted[sorted.length - 1];
  if (max > p90 * 3 && sorted.length > 10) {
    // Find the "normal max"
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] <= p90 * 2) return sorted[i];
    }
  }
  return max;
}

// ===== MAIN ANALYSIS FUNCTIONS =====

/**
 * Process raw B2B order line items into distribution analysis
 * @param {Array} lineItems - [{sku, asin, quantity, revenue, orderDate, productName, category, price}]
 */
function analyzeDistribution(lineItems, label = '12 months') {
  const quantities = lineItems.map(l => l.quantity);
  const sorted = [...quantities].sort((a, b) => a - b);

  // Basic stats
  const total = quantities.length;
  const sum = quantities.reduce((a, b) => a + b, 0);
  const mean = total ? sum / total : 0;
  const med = percentile(sorted, 50);
  const p75 = percentile(sorted, 75);
  const p90 = percentile(sorted, 90);
  const modeResult = mode(quantities);
  const normalMax = detectAbnormalMax(quantities);

  // Interval distribution
  const intervals = INTERVALS.map(iv => {
    const matches = lineItems.filter(l => l.quantity >= iv.min && l.quantity <= iv.max);
    const orderCount = matches.length;
    const unitCount = matches.reduce((s, l) => s + l.quantity, 0);
    const revenue = matches.reduce((s, l) => s + (l.revenue || 0), 0);
    return {
      ...iv,
      orderCount,
      orderPct: total ? (orderCount / total * 100) : 0,
      unitCount,
      unitPct: sum ? (unitCount / sum * 100) : 0,
      revenue,
      revenuePct: 0
    };
  });
  // Revenue pct after total revenue known
  const totalRev = intervals.reduce((s, iv) => s + iv.revenue, 0);
  intervals.forEach(iv => iv.revenuePct = totalRev ? (iv.revenue / totalRev * 100) : 0);

  // Top 15 exact quantities
  const qtyFreq = {};
  lineItems.forEach(l => {
    const q = l.quantity;
    if (!qtyFreq[q]) qtyFreq[q] = { count: 0, revenue: 0, models: new Set() };
    qtyFreq[q].count++;
    qtyFreq[q].revenue += l.revenue || 0;
    qtyFreq[q].models.add(l.sku || l.asin);
  });
  const top15 = Object.entries(qtyFreq)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([qty, data], i) => ({
      rank: i + 1,
      quantity: parseInt(qty),
      orderCount: data.count,
      orderPct: total ? (data.count / total * 100) : 0,
      modelCount: data.models.size,
      revenue: data.revenue
    }));

  // Check high-frequency checkpoints
  const checkpoints = HIGH_FREQ_CHECKPOINTS.map(cp => {
    const data = qtyFreq[cp] || { count: 0, revenue: 0, models: new Set() };
    return {
      quantity: cp,
      orderCount: data.count,
      orderPct: total ? (data.count / total * 100) : 0,
      isHighFreq: data.count > total * 0.03 // > 3% = high frequency
    };
  });

  return {
    label,
    total,
    sum,
    mean,
    median: med,
    mode: modeResult,
    p50: med,
    p75,
    p90,
    normalMax,
    intervals,
    top15,
    checkpoints,
    pctUnder10: intervals.filter(i => i.max <= 10).reduce((s, i) => s + i.orderPct, 0),
    pctUnder20: intervals.filter(i => i.max <= 20).reduce((s, i) => s + i.orderPct, 0)
  };
}

/**
 * Analyze per-product B2B patterns
 */
function analyzeProduct(lineItems, productInfo) {
  const quantities = lineItems.map(l => l.quantity);
  const sorted = [...quantities].sort((a, b) => a - b);
  const total = quantities.length;
  const sum = quantities.reduce((a, b) => a + b, 0);
  const revenue = lineItems.reduce((s, l) => s + (l.revenue || 0), 0);

  if (total === 0) return null;

  // Top 5 quantities for this product
  const qtyFreq = {};
  lineItems.forEach(l => {
    const q = l.quantity;
    if (!qtyFreq[q]) qtyFreq[q] = 0;
    qtyFreq[q]++;
  });
  const top5 = Object.entries(qtyFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([qty, count]) => ({ quantity: parseInt(qty), count, pct: total ? (count / total * 100) : 0 }));

  // Repeat customer detection (simplified - based on similar quantities)
  // In reality, this needs customer ID which may not be available

  return {
    ...productInfo,
    b2bOrders: total,
    b2bUnits: sum,
    b2bRevenue: revenue,
    mean: total ? sum / total : 0,
    median: percentile(sorted, 50),
    mode: mode(quantities),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    normalMax: detectAbnormalMax(quantities),
    top5,
    confidence: total >= 30 ? 'high' : total >= 10 ? 'medium' : total >= 3 ? 'low' : 'insufficient'
  };
}

/**
 * Recommend quantity tiers based on data
 */
function recommendTiers(productAnalysis, categoryPattern) {
  const pa = productAnalysis;
  if (!pa || pa.b2bOrders < 3) {
    return { tiers: [], confidence: 'insufficient', useTemplate: true };
  }

  const candidates = new Set();
  const modeVal = pa.mode?.value;
  const topQtys = pa.top5?.map(t => t.quantity) || [];

  // Add mode if significant
  if (modeVal && modeVal > 1 && pa.mode.count >= pa.b2bOrders * 0.1) {
    candidates.add(modeVal);
  }

  // Add top quantities
  topQtys.forEach(q => { if (q > 1) candidates.add(q); });

  // Add P50, P75, P90 round numbers
  [pa.median, pa.p75, pa.p90].forEach(v => {
    if (v > 1) {
      // Round to nice numbers
      const rounded = v <= 5 ? Math.round(v) :
                      v <= 20 ? Math.round(v / 5) * 5 :
                      Math.round(v / 10) * 10;
      if (rounded > 1) candidates.add(rounded);
    }
  });

  // Sort and filter to 3-5 tiers
  let tiers = [...candidates].sort((a, b) => a - b);

  // Remove tiers too close together (< 2x apart for small numbers)
  const filtered = [tiers[0]];
  for (let i = 1; i < tiers.length; i++) {
    const prev = filtered[filtered.length - 1];
    if (prev < 5 && tiers[i] >= prev + 2) filtered.push(tiers[i]);
    else if (prev >= 5 && prev < 20 && tiers[i] >= prev * 1.5) filtered.push(tiers[i]);
    else if (prev >= 20 && tiers[i] >= prev * 1.3) filtered.push(tiers[i]);
  }
  tiers = filtered.slice(0, 5);

  return {
    tiers,
    confidence: pa.confidence,
    useTemplate: tiers.length < 2,
    basis: {
      mode: modeVal,
      median: pa.median,
      p75: pa.p75,
      p90: pa.p90,
      topQtys
    }
  };
}

/**
 * Evaluate current tier utilization
 */
function evaluateCurrentTiers(currentTiers, lineItems) {
  if (!currentTiers || !currentTiers.length) return [];

  const quantities = lineItems.map(l => l.quantity);
  const total = quantities.length;

  return currentTiers.map(tier => {
    const reached = quantities.filter(q => q >= tier.minQty).length;
    const reached12m = reached;
    // For 6m and 3m, would need date filtering

    const coverage = total ? (reached / total * 100) : 0;
    const isEffective = coverage >= 5; // At least 5% of orders reach this tier
    const isEmpty = reached === 0;

    let action = '保留';
    if (isEmpty) action = '删除无效档位';
    else if (!isEffective && tier.minQty > 50) action = '下调数量门槛';
    else if (coverage < 2) action = '合并档位';

    return {
      minQty: tier.minQty,
      discount: tier.discount,
      reached12m,
      reached6m: null, // Need date-filtered data
      reached3m: null,
      coverage,
      isEffective,
      isEmpty,
      action
    };
  });
}

// ===== EXPORT =====
if (typeof module !== 'undefined') {
  module.exports = {
    analyzeDistribution,
    analyzeProduct,
    recommendTiers,
    evaluateCurrentTiers,
    INTERVALS,
    HIGH_FREQ_CHECKPOINTS
  };
}
