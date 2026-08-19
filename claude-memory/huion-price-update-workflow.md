---
name: huion-price-update-workflow
description: 从store.huion.com抓取9个指定型号价格并识别Flash Sale的自动化工作流
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ba54a57-3b79-401d-9347-2ff03ffc1557
  modified: 2026-07-23T03:34:20.202Z
---

# Huion 官网价格更新

当用户说 "D:\CodexProjects\官网搜集价格 更新huion价格" 或类似指令时：

## 执行步骤

1. `cd D:\CodexProjects\官网搜集价格`
2. 运行 `python generate_report.py`
3. 输出文件：`selected_prices.csv` 和 `selected_prices_report.txt`

## 脚本工作原理

- 逐个调用 `/api/product/{handle}` 获取9个产品详情（不是全量134个产品）
- 调用 `/api/flash_sale` 获取当前 Flash Sale
- 自动合并：如果产品有 Flash Sale，用 sale_prices 覆盖 API 中的 price
- Flash Sale 信息写入 CSV 的 "Flash Sale" 列和 TXT 的 [🔥 FLASH SALE] 标记

## 9个目标产品

kamvas-pro-16, kamvas-pro-13-2k, kamvas-22-series, kamvas-13-gen-3, inspiroy-2-s, inspiroy-2-m, inspiroy-dial-2, kamvas-pro-16-v2, kamvas-22-gen-3

## 关键注意事项

- Flash Sale 不在产品API的 coupons 字段中，必须单独调 /api/flash_sale
- 不要用 /api/product?page=N 全量拉取（134个产品），直接用 /api/product/{handle}
- Python 路径：`/d/Python314/python`
