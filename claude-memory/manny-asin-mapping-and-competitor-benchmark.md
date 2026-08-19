---
name: manny-asin-mapping-and-competitor-benchmark
description: manny型号/本店其他人型号/外部竞品XPPen的ASIN分组对照表及同尺寸组对比结论
metadata: 
  node_type: memory
  type: project
  originSessionId: 484bd007-5878-43cd-a95a-9c2afe7ef04a
  modified: 2026-08-13T07:16:26.397Z
---

# manny 型号 ASIN 对照表 + 同尺寸组竞品基准

统计于 2026-08-13，SIF 数据（US 站），用于 manny 广告/流量分析时的型号定位。

## 型号分组对照表

**manny 负责型号：**
- 13寸：B0D813G71Q（Kamvas 13 Gen3 星空黑带支架）、B0D93CG2JT（灰樱粉带支架）、B09F71NCBM（Kamvas Pro 13 2.5K）
- 16寸：B07RXZC12J（Kamvas Pro 16 带支架）、B0FHN8GB51（Kamvas Pro 16 V2）
- 20寸：B08BZ897B4（Kamvas 22 Plus）、B0G3P54PCM（Kamvas 22 Gen3）
- 其他小尺寸/数位板/手套：B01FTE9HS2、B07W7J15BR（Inspiroy H640P）、B0BMKVFDVV、B0BNQ9DVD3、B0B1V1JBNX、B0BMLC3YMZ、B0BNQ6QM64、B00VTHAS00/B0147WCE0A（手套）

**本店其他人负责型号（同尺寸组）：**
- 13寸：B0F13T9H31（星空黑**不带支架**）、B0FC2NZ3J2（灰樱粉不带支架）、B0FLDYS61F（SE 带支架）
- 16寸：B0DPMNL7WV（16 Gen3）、B08LYLJH66（16 2021）、B07S7BCTWW（Pro 16 不带支架）、B09FDZG55G（Pro 16 2.5K）、B08G8LYT4Z（Pro 16 Plus 4K）、B09CDJ9HDY（Pro 16 4K）
- 20寸：B08BZ729QJ（22）、B0CPF3KWS2（Pro 19 二手）、B0FMXCKRSJ（Pro 24 Gen3）、B098QLJFH2（24 Plus）、B0FWRHW3B6（Pro 27 144Hz）、B099555ZBZ（Pro 24 4K）、B0CP7TNB8T（Pro 27）

**外部竞品（XPPen）：**
- 13寸竞品：B07VPHR6GD（Artist 13.3 Pro，头号竞品）、B0DHGVXB59、B0F6Y18Y5P
- Pro 13 2.5K 竞品：B0C2C22BTD（Artist Pro 14 Gen2）
- Pro 16 竞品：B07M5X7MH1（Artist 15.6 Pro）、B0DJVQG5H8（15.6 Pro V2）、B0GHQB6LH6（16 3rd）
- 22寸竞品：B0CMC5DR5Z、B0DP6VPHQW

## 核心对比结论（2026-08 快照）

1. **13寸最大短板**：核心型号词「huion kamvas 13 gen 3」「huion kamvas 13」被**不带支架版**（其他人 B0F13T9H31）自然排名第1霸占，manny 带支架版排名第3-8。同尺寸、同系列，仅"带支架 vs 不带支架"差异导致丢第1名。
2. **16寸基本盘稳**：「huion kamvas pro 16」manny B0FHN8GB51 排名第2领先；但「huion kamvas 16 gen 3」被其他人 B0DPMNL7WV 第1（manny 未投，产品错位 Pro vs Gen3）。
3. **竞品 B07VPHR6GD（XPPen Artist 13.3 Pro）是13寸头号追赶目标**：通用大词「drawing tablet」第5 vs manny 第10-13、「drawing tablet with screen」第3 vs manny 第6。
4. **追赶差距根因**：评论数 3426 vs manny 796（4.3倍）、自然流量占比 74.2% vs 55.9%、广告结构 manny 偏 SB 品牌（53.8%）而 SP 精确（打排名）仅 22.4%。竞品是 2019 年老款、manny 是 2024 Gen3 新款（产品力占优但评论/排名积累不足）。

**Why:** 型号 ASIN 分组和同尺寸组竞品基准是每次 manny 分析都要反复确认的固定信息，记录后避免重新查 erp_listing 定位。
**How to apply:** 后续分析 manny 型号时直接用本表定位 ASIN 归属和竞品，对比结论作为基线（评论数/自然占比会随时间变化，需重新拉 SIF 更新）。关联 [[manny-ads-optimization-workflow]]、[[lingsxing-mcp-meeting-templates]]。
