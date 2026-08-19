---
name: lingsxing-mcp-meeting-templates
description: 领星MCP月会/周会数据模板 — 固定数据范围、ASIN列表、重点型号分组、输出规格、计算口径、可复用指令模板
metadata: 
  node_type: memory
  type: project
  originSessionId: 6aaee27e-c974-4697-8dfc-a67e3547b1eb
  modified: 2026-07-21T00:55:13.449Z
---

# 领星 MCP 月会与周会数据模板

## ⚠️ 优先级规则
- **文件夹路径优先**：当用户在消息中给出了明确的文件夹路径（如 `D:\CodexProjects\xxx`），必须优先按该文件夹内的项目代码、配置文件、asins.txt 等指示操作，**不得**因为 ASIN 列表与本文档的"默认 ASIN 范围"重合就自动触发领星 MCP 工作流。
- 本文档仅在用户明确要求"月会""周会""领星数据""会议摘要"且**未指定其他文件夹路径**时才适用。

## 数据来源
- 领星 MCP → 产品表现 → SKU
- 指标：销量、Sessions、Total CVR
- Listing 负责人：余曼妮
- 店铺：Amazon 美国站哥贝尔店 (sid=101, ad_profile_id=984347342660317)、Amazon 美国站 DeePaint 店 (sid=286, ad_profile_id=3966969369877399)
- 仅查询以上两个店铺，无需其他店铺数据
- 展示维度：ASIN；查询后按重点型号 SKU 分组输出

## 默认 ASIN 范围（29个）
B01FTE9HS2, B07W7J15BR, B07RXZC12J, B09F71NCBM, B08BZ897B4, B0G3P54PCM, B0BMKVFDVV, B0BMLC3YMZ, B0BNQ6QM64, B0BNQ9DVD3, B0B1V1JBNX, B00VTHAS00, B0147WCE0A, B07HK6HZZC, B0BV2BKFLC, B08CHHYJRQ, B099RV4JSM, B0B7RPR2C6, B0C84KBCYB, B0CWR9DFTH, B0B8RXCQ6R, B0D813G71Q, B0D93CG2JT, B0FHN8GB51, B0DQY6PF28, B0DR27QBBX, B0DR2DQYPX, B0DR2GXZ6W, B08CHGRL44

## 重点型号分组
| 组别 | 系列/型号 | SKU |
|------|-----------|-----|
| 第一组 | Kamvas 13 (Gen 3) | GS1333-Black-Stand, GS1333-Pink-Stand |
| 第二组 | Kamvas Pro 16/13/16V2 | GT-156-Stand-US, GT1302, GT-156-V2-US |
| 第三组 | H1060P/H1161/Q630M | H1060P-OTG, H1161, Q630M |
| 第四组 | Kamvas 22 Plus/22 Gen3 | GS2202-US, GS2203-US |
| 第五组 | H951P/H641P | H951P-Black, H641P-Pink, H641P-Black, H951P-Green |

其他型号合并为"其他型号"汇总展示。

## 输出要求
### 会议一页摘要
1. 本期整体：销量、Sessions、Total CVR、销量目标达成率
2. 环比与同比：销量、Sessions、Total CVR（以用户给出的对比周期为准）
3. 重点型号：五个组分别独立成图/卡片
4. 每个重点型号组：
   - 销量、本期目标、目标达成率
   - Sessions、Total CVR 本期值
   - 销量、Sessions、Total CVR 的同比与环比
   - 本品价格与竞品价格
   - 简洁的经营原因与行动建议
5. 月会额外内容：广告花费占比、利润情况及分析结论

## 计算口径
- 目标达成率 = 本期销量 ÷ 目标销量 × 100%
- 环比、同比的时间范围不预设，由每次任务明确指定
- 竞品价格、广告占比、利润若无法从已授权数据获得，需提示用户提供
- 竞品价格由用户在每次任务中提供，不通过领星 MCP 自动拉取

## 指令模板
见 D:\CodexProjects\领星MCP\月会&周会数据模板\指令模板.md

**Why:** 用户希望通过领星 MCP 自动化生成月会/周会数据摘要
**How to apply:** 当用户提到"月会""周会""会议摘要""领星数据"时，按此模板的参数和分组规则查询并输出；如用户未指定周期和目标，主动询问
