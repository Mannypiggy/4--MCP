# Amazon 广告诊断工作流 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用领星 MCP 为两家美国站店铺输出只读的 SP/SBV `manny` 广告诊断与人工操作建议。

**Architecture:** 每次诊断先发现授权店铺并映射 Profile ID，再从两个非大促日期段读取各层级广告报告。活动数据先筛选和排序，随后只对需关注活动下钻至位置、广告组、关键词/搜索词，最终形成按店铺分组、跨店汇总的建议报告。所有 MCP 调用均为查询接口。

**Tech Stack:** Codex 对话编排、领星 MCP 广告报表接口、Markdown 报告。

## Global Constraints

- 只分析 Amazon 美国站哥贝尔店与 DeePaint 店；负责人为余曼妮。
- 只包含广告名称含 `manny` 的 SP 与 SBV 活动。
- 运行日为 2026-07-14 时，窗口为 2026-06-15 至 2026-07-14；常态样本拆为 `2026-06-15 - 2026-06-22` 与 `2026-06-27 - 2026-07-14`，排除 Prime Day `2026-06-23 - 2026-06-26`。
- 仅给建议，绝不调用修改、创建、删除、暂停、否词、调价或调预算接口。
- 相对基线必须在同店铺、同广告类型、同一常态日期段内计算；不以固定 ACOS/TACOS 阈值作唯一判断。

---

### Task 1: 发现店铺并验证数据接口

**Files:**
- Create: `reports/README.md`
- Modify: `docs/superpowers/specs/2026-07-14-amazon-ads-diagnostic-design.md`（仅在接口能力不足时记录限制）

**Interfaces:**
- Consumes: `mcp__lingxing__ad_auth_shops({})`
- Produces: 两家目标店铺的 `profile_ids: string[]`，以及位置报告的可用性结论。

- [ ] **Step 1: 查询广告授权店铺**

调用：`mcp__lingxing__ad_auth_shops({})`。

预期：返回中包含美国站哥贝尔店和 DeePaint 店，记录各自店铺名、国家和 Profile ID；若名称不完全相同，以返回的店铺名请负责人确认，不继续猜测映射。

- [ ] **Step 2: 验证活动报表的过滤能力**

对两个 Profile ID 调用：

```json
{
  "profile_ids": ["<哥贝尔ProfileID>", "<DeePaintProfileID>"],
  "report_date": "2026-06-15 - 2026-06-22",
  "ads_type": ["sp", "sbv"],
  "search_type": "campaign_name",
  "search_text": "manny",
  "page": 1,
  "length": 100,
  "sort_field": "spends",
  "sort_type": "desc"
}
```

预期：仅得到名称包含 `manny` 的 SP/SBV 活动，且响应含活动 ID、名称、广告类型和绩效字段；若不支持 `sbv`，保留接口返回并将该限制写入规格。

- [ ] **Step 3: 验证广告位置数据来源**

检查领星 MCP 的可调用广告报表工具是否存在按 placement/position 返回数据的接口或在活动报告响应中返回位置明细。若存在，使用同一活动与日期段作只读样本查询；若不存在，写入规格：首版报告标记“领星 MCP 当前未暴露广告位置明细”，不得根据其他层级数据推断位置表现。

- [ ] **Step 4: 记录数据发现结果**

在 `reports/README.md` 写入 Profile ID 映射、可用报表接口、已验证字段和位置数据可用性；不要写入访问令牌或其他凭据。

### Task 2: 采集常态期间的活动与广告组数据

**Files:**
- Create: `reports/2026-07-14-amazon-ads-diagnostic.md`
- Modify: `reports/README.md`

**Interfaces:**
- Consumes: Task 1 的 Profile ID、`mcp__lingxing__ad_campaign_report`、`mcp__lingxing__ad_campaign_group_report`
- Produces: 两个日期段的活动和广告组数据，以及每店/广告类型的相对基线。

- [ ] **Step 1: 分日期段拉取活动报告并处理分页**

分别对 `2026-06-15 - 2026-06-22`、`2026-06-27 - 2026-07-14` 调用活动报告；参数保持 Task 1 的 SP/SBV 和 `manny` 过滤。若响应显示还有下一页，递增 `page` 至全部读取完成。不得用跨段单次查询替代，否则会纳入 Prime Day。

- [ ] **Step 2: 合并两个常态日期段**

按 `profile_id + campaign_id` 合并花费、销售额、订单、曝光与点击；重新计算：

```text
ACOS = 花费 / 销售额（销售额为 0 时标记“无销售”，不计算）
ROAS = 销售额 / 花费（花费为 0 时标记“无花费”，不计算）
CTR = 点击 / 曝光（曝光为 0 时标记“无曝光”）
CVR = 订单 / 点击（点击为 0 时标记“无点击”）
```

- [ ] **Step 3: 计算活动相对基线并筛出下钻对象**

同店、同广告类型内，分别按 ACOS、ROAS、CVR、花费计算中位数与四分位数。仅对满足以下任一条件的活动下钻：花费位于该组前 25% 且 ACOS 位于后 25%；花费位于前 25% 且订单为 0；或 ROAS、CVR 同时位于前 25%。样本不足 4 个活动时，改为按排序说明，不输出“显著落后/领先”标签。

- [ ] **Step 4: 读取下钻活动的广告组报告**

对筛出的活动 ID，分两个常态日期段调用 `mcp__lingxing__ad_campaign_group_report`，使用 `sponsored_type: ["sp", "sbv"]`、`with_ring: 0`、`page: 1` 和 `length: 100`。重复步骤 2 的合并与指标计算，并以所属活动内的广告组作为比较组。

- [ ] **Step 5: 写入活动与广告组中间结论**

在诊断报告中按店铺分别列出：样本量、常态日期段、活动层结论、被下钻活动、广告组层结论。Prime Day 四天不可混入任何累计值。

### Task 3: 采集关键词、搜索词与广告位置数据

**Files:**
- Modify: `reports/2026-07-14-amazon-ads-diagnostic.md`

**Interfaces:**
- Consumes: Task 2 的下钻活动 ID、`mcp__lingxing__ad_campaign_keyword_report`、`mcp__lingxing__ad_campaign_search_term_report`，及 Task 1 验证过的位置数据接口（如可用）。
- Produces: 可执行的词级建议和位置级建议或明确的数据不可用说明。

- [ ] **Step 1: 拉取关键词报告**

对每个下钻活动、每个常态日期段调用关键词报告，参数为 `profile_ids`、`campaign_id`、`report_date`、`sponsored_type: ["sp", "sbv"]`、`group_type: "keyword_text"`、`page: 1`、`length: 100`、`sort_field: "spends"`、`sort_type: "desc"`。分页完成后，按活动、广告组、关键词文本和匹配方式合并，重新计算指标。

- [ ] **Step 2: 拉取搜索词报告**

对同一活动和日期段调用搜索词报告，包含 `profile_ids`、`campaign_id`、`report_date`、`page: 1`、`length: 100`、`sort_field: "spends"`、`sort_type: "desc"`、`with_translation: 1`。分页完成后按活动、广告组和搜索词合并，保留原始搜索词与翻译。

- [ ] **Step 3: 形成词级判定**

在各活动内将有至少 1 次点击的词按花费、订单、ACOS、ROAS、CVR 排序。花费靠前且 0 订单的搜索词标为“考虑否定/降价”；ACOS 靠后且有订单的词标为“考虑降价”；ROAS 与 CVR 同时靠前的词标为“考虑加价或独立建组”。样本量不足 4 时，只展示排序和证据，不使用四分位标签。

- [ ] **Step 4: 形成位置级判定或限制说明**

若 Task 1 已验证位置数据接口，则对每个下钻活动按两个常态日期段拉取、合并并比较位置指标，输出“提高、降低或保持位置竞价”的建议及证据。若未验证到接口，则报告中写明“广告位置数据当前不可通过已绑定的领星 MCP 获取，本次不产生位置竞价建议”。

### Task 4: 输出人工执行清单并进行只读验证

**Files:**
- Modify: `reports/2026-07-14-amazon-ads-diagnostic.md`

**Interfaces:**
- Consumes: Tasks 2–3 的分层结论。
- Produces: 余曼妮可在领星中逐项操作的优先级清单。

- [ ] **Step 1: 以统一格式生成建议**

每个建议按以下格式写入报告：`P0/P1/P2 | 店铺 | 活动 | 广告组/位置/词 | 建议动作 | 证据 | 风险/说明`。P0 为高花费无订单或显著低效，P1 为有明确相对落后/领先证据，P2 为数据不足但值得观察；没有证据不得建议改动。

- [ ] **Step 2: 给出店铺小结和跨店汇总**

分别总结哥贝尔店与 DeePaint 店的花费、销售额、订单、ACOS、ROAS、主要问题和增长机会；再汇总两店最优先的 5 项建议。汇总仅做管理视图，不用跨店数值当作店内相对基线。

- [ ] **Step 3: 做只读安全核验**

检查本次所有 MCP 调用名称都以查询/报告为目的，且报告没有“已执行”“已暂停”“已否定”等表述。预期：报告仅包含“建议”“考虑”“需确认”等人工操作措辞。

- [ ] **Step 4: 做数据边界核验**

检查所有常态累计数据只来自 `2026-06-15 - 2026-06-22` 与 `2026-06-27 - 2026-07-14`；检查 SP/SBV 和 `manny` 过滤在活动层已生效。预期：报告中不将 2026-06-23 至 2026-06-26 纳入常态总计或基线。

- [ ] **Step 5: 记录周度复盘调用方式**

在报告末尾记录：负责人提出周度复盘时，复用同一过滤和位置规则，以请求日所在周为分析窗口；若窗口触及 Prime Day，仍将 2026-06-23 至 2026-06-26 单列并从常态比较排除。
