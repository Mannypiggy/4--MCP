# manny 广告优化分析 — 可复用工作流

> 每次运行只需告诉 Claude：「按照 manny 广告优化工作流，帮我分析最近 30 天的广告数据并生成优化报表」
> Claude 将自动：发现店铺 → 拉取活动报告 → 筛选问题活动 → 下钻关键词/投放/搜索词 → 输出 HTML 报表

---

## 一键提示词

```text
按照 manny 广告优化工作流，分析最近30天广告数据，生成优化报表。

本期窗口：自动取今天往前30天，排除中间的 Prime Day
负责人：余曼妮
店铺：Amazon 美国站哥贝尔店 + DeePaint店

仅分析 SP 和 SBV 类型、广告活动名称含 "manny" 的活动。
读取 D:\CodexProjects\领星MCP\广告优化\docs\superpowers\plans\manny-ads-optimization-workflow.md 作为工作流规范。
```

---

## 固定参数

| 参数 | 值 |
|------|-----|
| 店铺 | 哥贝尔店 (profile_id=984347342660317, sid=101) + DeePaint店 (profile_id=3966969369877399, sid=286) |
| 国家 | 美国站 (US) |
| 广告类型 | 仅 SP (`sp`) 和 SBV (`hsa` / `sbv`) |
| 活动名过滤 | 名称含 `manny`（不区分大小写） |
| 负责人 | 余曼妮 |
| 操作限制 | **只读**，绝不调用修改/创建/删除/暂停/否词/调价/调预算接口 |

---

## 日期窗口规则

- 默认取**今天往前 30 天**作为分析窗口
- 若窗口内含 Prime Day（通常在 6 月下旬或 7 月中旬），将 Prime Day 日期段排除，拆为两个常态窗口
- 示例（运行日 2026-07-14）：
  - 窗口1: 2026-06-15 ~ 2026-06-22
  - 窗口2: 2026-06-27 ~ 2026-07-14
  - 排除: 2026-06-23 ~ 2026-06-26 (Prime Day)

---

## 完整分析流程

### Step 1: 发现店铺并验证

```
mcp__LingXing-MCP__ad_auth_shops({})
mcp__LingXing-MCP__get_my_sids({})
```

- 确认哥贝尔店和 DeePaint 店的 profile_id 可用
- 如果 profile_id 变更，更新本文档

### Step 2: 拉取活动报告（分窗口 + 手动过滤）

对每个窗口分别调用 `ad_campaign_report`，**合并两窗口数据**：

```json
{
  "profile_ids": ["984347342660317","3966969369877399"],
  "report_date": "<窗口日期范围>",
  "page": 1,
  "length": 100,
  "sort_field": "spends",
  "sort_type": "desc"
}
```

> ⚠️ 注意：API 的 `ads_type` 和 `search_text` 过滤可能不生效，必须在 Node.js 中手动过滤：
> - `name.toLowerCase().includes('manny')`
> - `sponsored_type === 'sp' || sponsored_type === 'hsa'`

### Step 3: 合并两窗口 + 计算指标 + 筛选问题活动

用 Node.js 按 `profile_id + campaign_name` 合并两窗口数据：

```javascript
// 合并后重新计算
ACOS = 花费 / 销售额
ROAS = 销售额 / 花费
CTR = 点击 / 曝光
CVR = 订单 / 点击
```

**筛选需下钻的活动（使用相对基线，不用固定阈值）：**

按**同店铺、同广告类型**分别计算四分位基线：
- 花费 P75（前 25% 高花费）
- ACOS P75（后 25% 高 ACOS）
- ROAS P25（前 25% 低 ROAS）
- CVR P25（前 25% 低 CVR）

满足以下**任一条件**的活动进入下钻：
1. 花费 ≥ P75 **且** ACOS ≥ P75（高花费+低效）
2. 花费 ≥ P75 **且** 订单为 0（高花费+无转化）
3. 花费 ≥ P75 **且** ROAS ≤ P25 **且** CVR ≤ P25（高花费+全面低效）

> ⚠️ **禁止使用固定 ACOS 阈值（如 ACOS>40%）**作为唯一判断标准。不同店铺、不同产品线利润空间不同，必须用同店同类型的相对基线。
>
> 样本不足 4 个活动时，改为按排序展示，不输出"显著落后/领先"标签。

### Step 4: 下钻关键词报告

对每个问题活动的 `campaign_id`，拉取关键词报告。**推荐逐活动单独查询**（批量查询时 campaign 归属可能丢失）：

```json
{
  "profile_ids": ["984347342660317"],
  "campaign_id": ["<单个campaign_id>"],
  "report_date": "<完整日期范围>",
  "page": 1,
  "length": 50,
  "sort_field": "spends",
  "sort_type": "desc"
}
```

输出每个关键词的：花费、销售额、订单、ACOS、CPC、当前竞价、建议竞价。

### Step 5: 下钻投放对象报告

批量拉取所有问题活动的 targeting 报告：

```json
{
  "profile_ids": ["984347342660317"],
  "campaign_id": ["<所有问题campaign_id>"],
  "report_date": "<窗口日期>",
  "page": 1,
  "length": 100,
  "sort_field": "spends",
  "sort_type": "desc"
}
```

识别自动投放（auto target）、ASIN 定向、类目定向的效率和浪费点。

### Step 6: 下钻搜索词报告

分批拉取搜索词报告（**分两个窗口别拉 + 合并**，数据量大）：

```json
{
  "profile_ids": ["984347342660317"],
  "campaign_id": ["<所有问题campaign_id>"],
  "report_date": "<窗口日期>",
  "page": 1,
  "length": 100,
  "sort_field": "spends",
  "sort_type": "desc",
  "with_translation": 1
}
```

**搜索词判定规则：**
| 条件 | 动作 |
|------|------|
| 花费 ≥ $5 且 0 销售 | 🔴 精确否定 |
| 花费 < $5 且 0 销售 | 🟠 待观察 |
| ACOS > 80% | 🔴 否定 |
| ACOS > 50% | 🟡 考虑否定/降价 |
| ACOS < 15% 且 花费 > $30 | 🟢 好词，保留/可加价 |
| 有销售但 ACOS 35-50% | ➖ 维持或微降价 |

### Step 7: 输出 HTML 报表

报表必须包含以下模块，保存到 `D:\CodexProjects\领星MCP\广告优化\reports\YYYY-MM-DD-manny-ads-optimization-report.html`：

| 模块 | 内容 |
|------|------|
| **Header** | 店铺、分析周期、排除日期、负责人 |
| **KPI 概览卡片** | 活动数、总花费、总订单、ACOS、预估节省、预估 ACOS 改善 |
| **P0 高优先级** | 每个活动：campaign header（指标概览）+ 诊断说明 + 关键词调价表 + 搜索词否定表 + 预估效果 |
| **P1 中优先级** | 同上结构 |
| **效果汇总** | 卡片网格：逐活动当前花费→动作→预估节省→预估 ACOS |
| **执行清单** | 按优先级排序的操作步骤表（#、优先级、活动、动作、具体操作、预估节省） |
| **Footer** | 报告生成时间、数据来源、只读声明、负责人 |

**报表设计规范：**
- CSS 变量配色：红色(#d63031) 否定、橙色(#e17055) 降价、绿色(#00b894) 维持/好词
- 表格行 hover 高亮、P0/P1 行背景色区分
- KPI 卡片使用 border-left 色带
- 支持打印 (@media print)
- 中文字体优先 PingFang SC / Microsoft YaHei

---

## 数据量大时的处理策略

- 领星 MCP 返回的超大数据会自动保存到 `~/.claude/projects/.../tool-results/` 目录
- 使用 `node -e "..."` 脚本读取文件并解析 JSON
- 批量查询优于单条查询（1 次 8 个 campaign > 8 次 1 个 campaign）
- 搜索词报告建议仍分两窗口，因为单窗口数据量已较大

---

## 已知限制

1. API 的 `ads_type` 过滤参数可能不生效 → 手动在 Node.js 中过滤
2. API 的 `search_text` 过滤可能不生效 → 手动 `name.includes('manny')` 过滤
3. 关键词报告 `group_type: "keyword_text"` 模式下，`campaign_id` 和 `match_type` 字段可能为 null → 需逐活动单独查询关键词报告
4. 领星 MCP 暂未暴露广告位置（placement）明细 → 报告中不生成位置竞价建议
5. 竞品价格需用户手动提供，无法通过 MCP 自动拉取

---

## 修改记录

## 铁律：建议必须可定位到广告活动

任何广告优化结论、执行清单和口头答复，**必须逐条写出对应的完整广告活动名称**；在可获得时，同时写出 `campaign_id`。不得只给出搜索词、投放对象、ASIN、广告组或泛化的“产品词/品牌词”活动描述。

- 同一搜索词或投放对象出现在多个活动时，必须按活动分别列示其表现和建议，不得合并后省略归属。
- 提出调价、否定、扩量、预算迁移或暂停建议时，必须注明应在哪个具体活动中执行。
- 若接口返回的明细缺少活动归属，需改为逐活动查询后再输出；无法确认归属时，明确标注“活动名称待确认”，不得提供可执行的修改指令。

| 日期 | 修改内容 |
|------|----------|
| 2026-07-15 | 新增铁律：所有优化建议必须包含完整广告活动名称（可得时附 campaign_id） |
| 2026-07-14 | 初始版本，基于哥贝尔店 manny 活动分析经验总结 |
