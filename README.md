# MX-星云一人公司 🌌

> 215+ AI 专家角色，拖拽编排，一键执行。让 AI 像团队一样协作。

**MX-星云**是一个 AI Agent 可视化全栈 SaaS 平台，基于 [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) 的 215 个专家角色定义。将一堆 GitHub markdown 文件变成可浏览、可编排、可执行的在线产品。

## 核心功能

- 🔍 **Agent 浏览器** — 215 个 AI 角色卡片，按部门/平台/工具筛选搜索
- 📋 **一键安装** — 支持 Claude Code / Cursor / Copilot 等 17 种工具，专属安装指令
- 🎨 **可视化编排** — Vue Flow 拖拽 DAG 工作流，连线定义 Agent 协作顺序
- ⚡ **实时执行** — BullMQ 引擎并行调度，SSE 实时推送进度
- 💰 **免费增值** — Free / Pro (¥69/月) / Enterprise (¥349/月)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 3 + Vue 3 + TypeScript |
| UI | Tailwind CSS + shadcn-vue |
| 编排 | Vue Flow (DAG 画布) |
| 后端 | Nitro Server Routes |
| 数据库 | PostgreSQL + Drizzle ORM |
| 队列 | BullMQ + Redis |
| 支付 | Stripe |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 许可证

MIT License

## 致谢

- [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — AI Agent 角色库
- [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) — Agent 编排引擎
