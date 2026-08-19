---
name: yoy-cvr-comparison-requirement
description: 周会/月会同比分析必须增加CVR同比对比
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 48ce1c6f-b762-4d9b-8ce0-fd64531cb910
  modified: 2026-07-22T10:39:20.034Z
---

周会/月会一页摘要的同比对比，除了销量、Sessions 之外，必须增加 **Total CVR 的同比对比**。

**Why:** 用户要求。CVR 同比变化是判断 Listing 质量、流量精准度和转化效率的重要指标，仅看销量和 Sessions 同比不足以评估经营质量变化。

**How to apply:**
- 整体摘要和每个重点型号组都要输出：本期 CVR、同比期 CVR、CVR 同比变化率
- CVR 同比变化率 =（本期 CVR - 同比期 CVR）÷ 同比期 CVR × 100%
- 如果领星返回的 total_cvr 字段为空，使用 `cvr` 字段或 `order_items ÷ sessions` 计算
- 关联：[[lingsxing-mcp-meeting-templates]]
