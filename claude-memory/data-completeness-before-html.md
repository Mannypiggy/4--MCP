---
name: data-completeness-before-html
description: 生成HTML报告前必须确保所有数据已查询完毕，不得留占位文字
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 48ce1c6f-b762-4d9b-8ce0-fd64531cb910
  modified: 2026-07-22T14:24:37.703Z
---

生成周会/月会 HTML 报告前，必须确保：

1. 所有指定竞品的 SIF 关键词/排名/流量数据已查询完毕
2. 本品所有型号的核心关键词排名与竞品对应列出
3. 不得出现"未单独返回该词份额""SIF数据待补充""SIF竞品详细数据待后续补充查询"等占位文字
4. 无法获取的数据标注具体原因（如"当前授权范围不支持""映射关系待确认""ASIN已下架"），不得笼统写"待补充"

**Why:** 用户要求。占位文字在会议中无法使用，必须确保数据完整。

**How to apply:** 查询完所有数据后，用 `(h.match(/待补充/g)||[]).length` 检查残留，必须为 0 才能交付。
关联：[[lingsxing-mcp-meeting-templates]]
