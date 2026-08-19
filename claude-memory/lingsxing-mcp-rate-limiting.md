---
name: lingsxing-mcp-rate-limiting
description: 领星MCP工具串行调用和速率限制规则
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 96834c18-57ad-4b09-b2ec-8d201c95c346
  modified: 2026-07-28T05:58:19.294Z
---

领星MCP工具必须串行调用，相邻调用至少间隔2秒。遇到429错误立即停止，禁止自动重试。

**Why:** 领星API有速率限制，并发调用或频繁调用会触发429限流。串行+间隔可避免触发限流；遇到429说明已达上限，继续重试只会加剧问题。

**How to apply:** 每次使用领星MCP工具（mcp__LingXing-MCP__*）时，必须一个接一个调用，两个调用之间至少等待2秒。如果任何调用返回429状态码，立即停止所有后续领星MCP调用，报告用户"领星API限流，已停止"。
