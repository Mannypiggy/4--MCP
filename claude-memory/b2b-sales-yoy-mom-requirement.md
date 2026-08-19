---
name: b2b-sales-yoy-mom-requirement
description: 周会/月会必须增加B2B销量和B2B销售额的同比环比对比
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 48ce1c6f-b762-4d9b-8ce0-fd64531cb910
  modified: 2026-07-22T14:24:14.842Z
---

周会/月会一页摘要必须增加 B2B 销量（b2b_volume / b2b_order_items）和 B2B 销售额（b2b_amount）的同比和环比对比。

**Why:** 用户要求。B2B 订单是企业批量采购的重要指标，单独跟踪有助于区分 B2C 和 B2B 业务表现。

**How to apply:**
- 整体摘要和每个重点型号组输出：B2B 销量、B2B 销售额、同比变化率
- 领星字段：`b2b_order_items`（B2B销量）、`b2b_amount`（B2B销售额）
- B2B 同比 =（本期 B2B 值 - 同比期 B2B 值）÷ 同比期 B2B 值 × 100%
- 关联：[[lingsxing-mcp-meeting-templates]] [[yoy-cvr-comparison-requirement]]
