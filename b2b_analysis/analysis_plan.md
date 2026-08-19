# B2B 数量折扣阶梯分析 - 执行计划

## 数据截止
- 日期: 2026-07-27 (最近完整自然日)
- 时区: 美西时间 (PST/PDT)
- 分析窗口: 12个月 / 6个月 / 3个月

## 店铺范围
- Amazon 美国站全部店铺
- 哥贝尔店 (sid=101)
- DeePaint店 (sid=286)
- 其他美国站店铺（如有）

## 领星 MCP 查询计划

### Phase 1: 基础数据
1. `get_my_sids` - 获取所有店铺ID
2. `get_multi_platform_shop_list` - 获取店铺详情 (platform_code=10001 Amazon)
3. `erp_listing` - 获取所有在售Listing (按店铺, 状态=在售)

### Phase 2: 产品表现（含B2B汇总）
4. `query_product_performance_asin_lists` - 每个ASIN的产品表现
   - 时间: 2025-07-28 ~ 2026-07-27 (12个月)
   - 维度: ASIN
   - 字段: b2b_order_items, b2b_amount, volume, sales_amount
   - 同样查询6个月和3个月窗口

### Phase 3: 订单明细
5. `query_order_profit_list_gross_profit` - B2B订单利润明细
   - 时间: 2025-07-28 ~ 2026-07-27
   - 维度: SKU/ASIN
   - 需要: 每笔订单的SKU级别数量

### Phase 4: 价格数据
6. 当前售价 - 从产品表现或Listing获取
7. Business Price - 领星如不支持则标注
8. B2B阶梯价 - 领星如不支持则标注

## 数据限制说明
- 领星MCP可能无法返回: Business Price设置、B2B阶梯配置、订单级别的折扣使用情况
- 如订单级别数量不可得，使用汇总数据推算分布
