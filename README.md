# 3D 句子雨展示项目

这是一个基于 React + TypeScript + Three.js 构建的 3D 视觉展示项目。它主要用于展示流动的“句子雨”效果（类似黑客帝国代码雨，但内容为自定义句子），并配有星空背景。项目包含一个后台管理接口，允许用户实时配置展示的文字内容、颜色、速度和密度。

## ✨ 项目目的

*   **视觉展示**: 提供一个唯美、浪漫的 3D 动态背景，适合作为展示屏、屏保或浪漫惊喜页面。
*   **动态配置**: 通过可视化界面 (`/config`) 动态调整视觉参数，无需修改代码即可改变展示风格。
*   **全栈实践**: 演示了 React 前端与 Node.js (Express) 后端的结合，以及 Three.js 在 React 中的应用。

## 🚀 功能特性

*   **3D 句子雨**: 使用 `@react-three/fiber` 实现的沉浸式文字下落效果。
*   **星空背景**: 动态闪烁的星空粒子背景。
*   **实时控制**:
    *   自定义句子内容池。
    *   调整下落速度。
    *   调整文字密度。
    *   修改文字颜色。
*   **数据持久化**: 配置参数保存在服务端的 JSON 文件中，重启服务器不丢失。

## 🛠️ 技术栈

*   **前端**: React 19, TypeScript, Vite, Three.js (@react-three/fiber, @react-three/drei), React Router, CSS Modules.
*   **后端**: Node.js, Express, JSON Storage.
*   **工具**: ESLint, Nodemon, pnpm.

## Tb 快速开始

### 1. 环境准备

确保你的电脑已安装 [Node.js](https://nodejs.org/) (推荐 v18+)。本项目使用 `pnpm` 作为包管理器。

### 2. 安装依赖

在项目根目录下运行：

```bash
pnpm install
```

### 3. 启动项目

本项目包含前端和后端两个部分，建议同时启动以便完整体验。

**开发模式（同时启动前后端）：**

```bash
pnpm dev
```
此命令会同时运行 Express 后端（端口 3001）和 Vite 前端服务器（通常是端口 5173）。

**仅启动后端：**

```bash
pnpm server
```

**仅启动前端：**

```bash
pnpm client
```

### 4. 访问应用

*   **展示页面**: 打开浏览器访问 `http://localhost:5173` (或控制台显示的地址)。
*   **配置后台**: 访问 `http://localhost:5173/config` 进行参数调整。

## 📦 构建与部署

构建前端静态资源：

```bash
pnpm build
```

构建完成后，静态文件将生成在 `dist` 目录下。你可以将这些文件部署到任何静态网站托管服务（如 Vercel, Netlify, Nginx 等），或者通过后端服务器托管。

## 📂 目录结构

```
.
├── server/               # 后端代码 (Express)
│   ├── index.js          # 服务端入口
│   └── data.json         # 数据存储文件
├── src/                  # 前端代码 (React)
│   ├── components/       # React 组件 (Rain, Stars 等)
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 入口文件
├── public/               # 静态资源
├── index.html            # HTML 模板
└── package.json          # 项目配置
```
