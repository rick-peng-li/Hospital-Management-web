# Health Nest 医院管理系统

Git 仓库：<https://github.com/rick-peng-li/Hospital-Management-web>

Health Nest 是一个前后端分离的医院管理系统，覆盖医生排班展示、患者档案、预约管理、管理员统计与报表、在线留言和评价等场景。前端为 React 单页应用，后端基于 Express 提供 REST 接口，数据持久化在 MongoDB。界面文案保持英文，与项目原有设计一致。

## 功能模块

### 前端页面

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| 首页 | `/`、`/home` | 品牌主视觉、核心服务介绍、医院图文轮播、患者评价轮播、行动号召区、评分弹窗 |
| 医生列表 | `/doctors` | 医生卡片、关键字搜索、详情弹窗、一键预约跳转 |
| 预约管理 | `/appointments` | 需登录；预约列表、搜索、新建预约、完成标记、删除 |
| 患者管理 | `/patients` | 患者档案增删改查、姓名搜索、表单校验 |
| 管理员后台 | `/admin` | 管理员登录、数据概览卡片、导出 PDF 报表、退出登录 |
| 注册 | `/signup` | 患者注册，含密码强度提示、性别与年龄字段 |
| 登录 | `/login` | 患者邮箱密码登录，签发 JWT |
| 关于我们 | `/about-us` | 使命、愿景、价值观与团队介绍 |
| 服务介绍 | `/services` | 系统提供的服务清单 |
| 联系我们 | `/contact-us` | 联系方式展示与留言表单（写入数据库） |
| 隐私政策 | `/privacy-policy` | 数据使用与隐私说明 |
| 服务条款 | `/terms-of-service` | 使用条款说明 |
| 404 | 其他路径 | 兜底页面，可返回首页 |

### 后端模块

- 患者模块：注册、登录、列表查询、资料更新、删除，密码使用 bcrypt 加密，登录签发 JWT。
- 医生模块：医生列表与单条详情查询。
- 预约模块：预约列表（关联医生信息）、新建预约、状态变更、删除；写操作需要携带患者 JWT。
- 管理员模块：管理员登录、统计汇总（医生数、患者数、预约数、完成数、评价数）。
- 留言模块：提交联系表单、管理员查看留言列表。
- 评价模块：提交星级评价与评论、评价列表查询。
- 数据初始化：服务启动时自动写入默认医生、演示患者和示例预约，接口幂等。

## 技术架构

### 前端

- React 18 + Vite 5，函数组件与 Hooks
- React Router 6 负责路由
- Tailwind CSS 3 负责样式与响应式布局
- Framer Motion 提供过渡与动效
- react-slick 实现轮播、react-datepicker 选择预约时间、react-icons 图标
- axios 调用接口，Vite 开发代理转发 `/api`
- jsPDF 生成管理端报表

### 后端

- Node.js + Express 4（ES Module）
- MongoDB + Mongoose 8 数据建模
- JWT（jsonwebtoken）鉴权，bcrypt 密码哈希，uuid 生成患者编号
- cors、dotenv 配置跨域与运行参数

### 目录结构

```
Hospital-Management-web/
├── Backend/
│   ├── api/
│   │   ├── controllers/   # 业务控制器
│   │   ├── middleware/    # JWT 鉴权中间件
│   │   ├── models/        # Mongoose 模型
│   │   └── routes/        # REST 路由
│   ├── config.js          # 端口、数据库、JWT、管理员配置
│   ├── seed.js            # 初始数据脚本
│   └── server.js          # 服务入口
└── Frontend/
    ├── public/
    └── src/
        ├── assets/
        ├── components/    # 页面级组件
        ├── context/       # 登录状态上下文
        ├── pages/         # 信息页
        ├── App.jsx        # 路由与布局
        └── main.jsx       # 应用入口
```

## 接口说明

统一前缀为 `/api`，请求与响应均为 JSON。需要鉴权的接口在请求头中携带 `Authorization: Bearer <token>`。

### 患者

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/patients/register` | 否 | 注册患者，字段：`name`、`email`、`password`、`gender`、`mobile`、`age` |
| POST | `/api/patients/login` | 否 | 登录，字段：`email`、`password`，返回 `token` 与患者信息 |
| GET | `/api/patients/get-patients` | 否 | 患者列表，按创建时间倒序，不返回密码 |
| PUT | `/api/patients/update-patient` | 否 | 更新资料，`patientId` 必填，`password` 可选 |
| POST | `/api/patients/delete-patient` | 否 | 删除患者，字段：`patientId` |

### 医生

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| GET | `/api/doctors` | 否 | 医生列表 |
| GET | `/api/doctors/:id` | 否 | 单个医生详情 |

### 预约

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| GET | `/api/appointments` | 否 | 预约列表，按预约时间升序，包含医生名称与科室 |
| POST | `/api/appointments` | 患者 | 新建预约，字段：`patientName`、`doctorId`、`appointmentDate`、`notes` |
| PATCH | `/api/appointments/:id/status` | 已登录 | 修改状态，`status` 取值 `Scheduled` 或 `Completed` |
| DELETE | `/api/appointments/:id` | 已登录 | 删除预约 |

### 留言与评价

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/contact` | 否 | 提交联系表单，字段：`name`、`email`、`message` |
| GET | `/api/contact` | 管理员 | 留言列表 |
| POST | `/api/reviews` | 否 | 提交评价，字段：`rating`（1-5）、`comment` |
| GET | `/api/reviews` | 否 | 评价列表，按时间倒序 |

### 管理员与健康检查

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/admin/login` | 否 | 管理员登录，字段：`username`、`password` |
| GET | `/api/admin/stats` | 管理员 | 统计数据：`doctors`、`patients`、`appointments`、`completed`、`reviews` |
| GET | `/api/health` | 否 | 服务健康检查 |

## 启动方式

### 环境要求

- Node.js 18 及以上（推荐 20）
- npm 9 及以上
- MongoDB 6 及以上，或可用的 Docker 环境

### 1. 启动 MongoDB

若本机已安装 MongoDB，直接启动服务即可；使用 Docker 时执行：

```bash
docker run -d --name healthnest-mongo -p 27017:27017 mongo:7.0
```

数据库默认连接串为 `mongodb://127.0.0.1:27017/healthnest`。

### 2. 启动后端

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

后端默认运行在 `http://localhost:6005`，启动时会自动连接数据库并写入初始数据。也可以手动执行 `npm run seed`。

### 3. 启动前端

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，`/api` 请求由 Vite 代理到 `BASE_URL` 指向的后端地址。

### 4. 访问系统

- 前端地址：<http://localhost:5173>
- 后端地址：<http://localhost:6005>
- 健康检查：<http://localhost:6005/api/health>

### 默认账号

| 类型 | 账号 | 密码 | 用途 |
| --- | --- | --- | --- |
| 演示患者 | `demo@healthnest.com` | `demo1234` | 登录后可管理预约 |
| 管理员 | `admin` | `password` | 进入 `/admin` 后台 |

也可以在 `/signup` 注册新的患者账号。

### 环境变量

后端 `Backend/.env`：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `DB_Url` | `mongodb://127.0.0.1:27017/healthnest` | MongoDB 连接串 |
| `PORT` | `6005` | 后端服务端口 |
| `JWT_SECRET` | `healthnest_jwt_secret` | JWT 签名密钥 |
| `ADMIN_USER` | `admin` | 管理员用户名 |
| `ADMIN_PASSWORD` | `password` | 管理员密码 |

前端 `Frontend/.env`：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:6005` | 开发环境代理的后端地址 |

## 构建与部署

```bash
cd Frontend
npm run build
```

构建产物输出到 `Frontend/dist`。`Backend/vercel.json` 与 `Frontend/vercel.json` 保留了 Vercel 部署配置，部署时将前端产物与后端服务分别发布，并把前端接口地址指向后端域名即可。

## 许可

本项目基于 MIT 许可发布。
