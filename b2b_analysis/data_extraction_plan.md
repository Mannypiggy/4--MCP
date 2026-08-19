# MCP 数据提取顺序（严格串行，间隔 ≥2秒）

## 执行约束
- QPS=1，每次调用间隔至少 2 秒
- 不在冷却期内重试
- 每次调用后检查返回是否正常

## Step 1: 店铺列表
- `get_my_sids` → 获取所有店铺 sid
- 从中筛选美国站店铺

## Step 2: 店铺详情
- `get_multi_platform_shop_list` platform_code=["10001"] → 获取Amazon美国站全部店铺

## Step 3: Listing数据（按店铺分批）
- `erp_listing` (每个店铺) → 获取在售Listing
  - mids="1" (美国站)
  - status=在售
  - offset=0, length=200
  - 如超过200条需翻页

## Step 4: 产品表现（B2B汇总）
- `query_product_performance_asin_lists`
  - 时间: 2025-07-28 ~ 2026-07-27 (12个月)
  - summary_field="asin"
  - 关注字段: b2b_order_items, b2b_amount
  - 再查6个月和3个月

## Step 5: 订单利润明细（B2B订单）
- `query_order_profit_list_gross_profit`
  - 时间: 同上
  - 关注字段: b2b相关字段
  - 按SKU/ASIN维度

## Step 6: 利润报表
- `get_profit_report_msku`
  - 获取成本、利润数据（如有权限）
