# SmartPark 后台管理示例项目

本项目为 SmartPark 智能停车场后台管理系统的示例，包含前端和后端，基于 pnpm 进行包管理。

## 目录结构

- `backend/` 后端服务，Node.js + TypeScript + Prisma
- `frontend/` 前端应用，React + Vite + TailwindCSS
- `database/` 数据库相关文件

## 环境准备

1. **安装 Node.js**
   - 推荐 Node.js 版本 >= 18.x
   - [Node.js 官网下载](https://nodejs.org/)

2. **安装 pnpm**
   
   ```sh
   npm install -g pnpm
   ```

## 安装依赖

分别进入前端和后端目录，安装依赖：

```sh
cd backend
pnpm install

cd ../frontend
pnpm install
```

## 数据库初始化（可选）

如需初始化数据库（以 Prisma 为例）：

```sh
cd backend
pnpm prisma migrate dev
```

或导入 SQL 文件：

```sh
# 以 MySQL 为例
mysql -u <user> -p < database/smart_park_db.sql
```

## 启动后端服务

```sh
cd backend
pnpm run dev
```

默认监听端口：`http://localhost:3000`

## 启动前端应用

```sh
cd frontend
pnpm run dev
```

默认访问地址：`http://localhost:5173`

## 常用脚本

- `pnpm run dev`  启动开发环境
- `pnpm run build`  打包生产环境
- `pnpm run lint`  代码检查

## 其他说明

- 如需修改数据库连接，请编辑 `backend/prisma/schema.prisma`。
- 前后端端口可在各自目录下的配置文件中调整。

---

如有问题欢迎提 issue 或联系开发者。
