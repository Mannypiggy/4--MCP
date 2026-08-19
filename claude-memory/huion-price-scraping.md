---
name: huion-price-scraping
description: Huion 官网价格抓取项目配置和操作方式
metadata: 
  node_type: memory
  type: project
  originSessionId: cfc77ab9-a1e7-41ea-a979-6537a91e787e
---

## 项目目录
`D:\CodexProjects\官网搜集价格`

## 关键文件
- `all_products.json` — 全站 135 产品原始 API 数据
- `selected_prices.csv` — 指定型号价格表
- `selected_prices_report.txt` — 可读文本报表
- `generate_report.py` — 按 TARGETS 列表筛选生成报表
- `extract_prices.py` — 全站提取脚本

## 当前监控型号（共 9 个）
1. Kamvas Pro 16 — With Stand — $299.00
2. Kamvas Pro 13 (2.5K) — Default — $329.00
3. Kamvas 22 Series — Kamvas 22 Plus — $439.00
4. Kamvas 13 (Gen 3) — Cosmo Black / With Stand — $229.00
5. Inspiroy 2 S — 两色 — $44.99
6. Inspiroy 2 M — 两色 — $59.49
7. Inspiroy Dial 2 — Default — $127.99
8. Kamvas Pro 16 V2 — Default — $339.00
9. Kamvas 22 (Gen 3) — Default — $599.00

## 更新流程
1. 分页拉取 API: `GET https://store.huion.com/api/product?page=N&limit=50`（14页）
2. 保存为 all_products.json
3. 运行 generate_report.py 生成报表

## 触发词
用户说"更新 Huion 价格"/"搜集价格"等即可触发
