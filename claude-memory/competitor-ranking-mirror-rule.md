---
name: competitor-ranking-mirror-rule
description: 竞品给出关键词排名时本品也必须对应给出同词排名
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 48ce1c6f-b762-4d9b-8ce0-fd64531cb910
  modified: 2026-07-22T14:24:51.951Z
---

SIF 竞品分析中，如果竞品在某个关键词上给出了自然排名/SP排名，本品也必须对应查询并列出该关键词的排名。

**示例：**
- ❌ 错误：H1060P 竞品 UGEE M708 "drawing tablet" 自然排名 P3#15，但本品未列出排名
- ✅ 正确：H1060P "drawing tablet" 自然排名 P1#10，SP排名 P1#1；竞品 UGEE M708 自然排名 P3#15

**Why:** 用户要求。仅有竞品排名无法判断本品竞争位置，必须同词对比。

**How to apply:** 对每个重点型号组，先查本品 SIF `market_get_asin_keyword_signals`，再查竞品，确保核心关键词的排名成对出现。
关联：[[lingsxing-mcp-meeting-templates]]
