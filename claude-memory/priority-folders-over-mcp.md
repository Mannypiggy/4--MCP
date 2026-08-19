---
name: priority-folders-over-mcp
description: 当用户消息中给出明确文件夹路径时，必须优先探索该文件夹的项目代码，禁止跳过文件夹直接使用 MCP
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e82ac21a-669d-441f-9c1f-a575fd59b171
  modified: 2026-07-21T01:53:45.108Z
---

当用户在消息中明确给出了文件夹路径（如 `D:\CodexProjects\xxx` 或任何磁盘路径），必须**优先、死磕**探索该文件夹：

1. 先确认路径是否存在（Windows 路径中文编码问题用 `/d/CodexProjects/xxx` 或 `find` 兜底）
2. 读取该文件夹内的项目文件（package.json、README、源代码等）
3. 按项目自身的功能/脚本执行，而不是跳到 MCP 或其他工具

**禁止的行为：**
- 路径访问一次失败就放弃，改用 MCP 分析 ASIN
- 看到 ASIN 列表就往 SIF MCP 或领星 MCP 的广告/流量分析方向走
- 忽略文件夹路径，自行判断用户意图

**补充：不要自动合并已有数据。** 用户说"搜集竞品ASIN"并列出 21 个 ASIN，就应该只处理这 21 个竞品，而不是擅自把它追加到已有本品 ASIN 的文件里。用户说的范围就是范围，不要自动扩展。

**Why:** 用户发文件夹路径 = 要用那个项目。2026-07-21 的 "搜集价格" 项目中，我因为 `ls` 中文路径报错一次就放弃，看到 ASIN 列表就切到 SIF MCP，还把竞品追加到了本品文件，浪费了用户时间。

**How to apply:** 每次用户消息里出现磁盘路径时，第一反应是"打开文件夹看看里面有什么"，而非"这些 ASIN 我用 MCP 分析一下"。路径访问失败多换几种写法重试。
