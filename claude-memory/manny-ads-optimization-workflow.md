---
name: manny-ads-optimization-workflow
description: 领星MCP可复用的manny广告优化分析工作流 — 店铺映射、日期窗口、分析步骤、输出HTML报表规范、一键提示词
metadata: 
  node_type: memory
  type: project
  originSessionId: 46550b43-d4f4-4b3f-a80f-09b27026b1fa
---

# manny 广告优化分析工作流

## 一键提示词

```
按照 manny 广告优化工作流，分析最近30天广告数据，生成优化报表。
```

## 固定参数

- 店铺：哥贝尔店 (profile_id=984347342660317) + DeePaint店 (profile_id=3966969369877399)、美国站
- 广告类型：仅 SP 和 SBV、活动名含 `manny`（大小写不敏感）
- 负责人：余曼妮
- 操作限制：**只读**，绝不修改/暂停/否词/调价
- 日期窗口：默认今天往前30天，排除 Prime Day（拆为两段常态窗口）

## 工作流规范文件

D:\CodexProjects\领星MCP\广告优化\docs\superpowers\plans\manny-ads-optimization-workflow.md

## 分析流程

1. 发现店铺 → ad_auth_shops + get_my_sids
2. 拉取活动报告（分两窗口）→ 手动过滤 SP/SBV + manny
3. 合并两窗口计算 ACOS/ROAS → 筛选 P0(ACOS>40%,花费>$200) 和 P1 问题活动
4. 逐活动下钻关键词报告（获取 campaign_id 归属）
5. 批量拉取投放对象报告（targeting）
6. 分窗口拉取搜索词报告（with_translation:1）→ 生成否定/降价建议
7. 输出 HTML 报表到 D:\CodexProjects\领星MCP\广告优化\reports\

## 搜索词判定规则

- 花费≥$5且0销售 → 🔴精确否定
- ACOS>80% → 🔴否定
- ACOS>50% → 🟡考虑否定/降价
- ACOS<15%且花费>$30 → 🟢好词,保留/可加价

## 已知限制

- API的ads_type和search_text过滤可能不生效，需手动过滤
- 关键词报告group_type="keyword_text"时campaign_id可能为null，需逐活动单独查询
- 位置报告不可用，不生成位置建议

**Why:** 用户希望通过一次提示词即可自动生成完整广告优化报表，无需每次重复指定参数和工作流
**How to apply:** 当用户提到"manny广告优化""广告优化报表""分析广告数据并生成报表"时，读取工作流规范文件并按流程执行
