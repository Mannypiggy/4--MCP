---
name: ad-data-aggregation-rules
description: 特定型号组的广告数据必须汇总后同环比，不能分开展示
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 48ce1c6f-b762-4d9b-8ce0-fd64531cb910
  modified: 2026-07-22T14:24:26.341Z
---

以下型号组广告数据必须汇总为一个整体进行同环比，不得分开：

**Kamvas 13 (Gen 3) 系列：**
- 包含：GS1333-Black-Stand（星空黑）+ GS1333-Pink-Stand（灰樱粉）
- 广告只打黑色款，粉色款不用广告
- 广告数据汇总 = 黑色款广告花费/曝光/点击/广告销售额/ACOS/ROAS + 粉色款（通常为0）
- 汇总后与同比期汇总广告数据做同环比

**H951P / H641P 系列：**
- 包含：H951P-黑色、H641P-灰樱粉、H641P-黑色、H951P-雾松绿
- 只打广告 H951P-黑色 和 H641P-灰樱粉
- 广告数据汇总 = H951P-黑色 + H641P-灰樱粉的广告指标
- 汇总后与同比期汇总广告数据做同环比

**Why:** 用户要求。广告预算是按系列分配的，分开看不出整体广告效率。

**How to apply:** 先在领星查询各 ASIN 广告数据，然后按系列汇总 spend/impressions/clicks/ad_order_quantity/ad_sales_amount，计算汇总后的 ACOS、ROAS、CPC、CTR，再做同环比。
关联：[[lingsxing-mcp-meeting-templates]]
