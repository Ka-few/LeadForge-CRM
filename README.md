# LeadForge CRM

A full-stack **Sales CRM & Client Acquisition Platform** built for agencies and freelancers to manage leads, track pipelines, run website audits, and send proposals — all in one place.

---

## ✨ Features

| Module | Description |
|---|---|
| **Dashboard** | Real-time KPIs: total businesses, pipeline value, open tasks, and activity feed |
| **Business Management** | Add/edit businesses with industry, website status, social links, tags, and opportunity scoring |
| **CRM Pipeline** | Kanban-style board with drag-and-drop across 9 customizable stages |
| **Contact Tracking** | Store contacts per business with phone, WhatsApp, and email |
| **Interactions Log** | Record calls, emails, WhatsApp messages, meetings, demos, and follow-ups |
| **Tasks** | Assign prioritised tasks to businesses or yourself, with due dates |
| **Website Audits** | Score a business's website and generate a report (strengths, weaknesses, recommendations) |
| **Proposals** | Draft and manage proposals with value tracking and status flow (Draft → Sent → Accepted/Rejected) |
| **Reports** | Aggregated views of pipeline performance and activity |
| **Settings** | User profile and theme preferences |
| **Auth** | JWT-based authentication with protected routes and role-based access (ADMIN / USER) |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** (Vite)
- **TailwindCSS v4** for styling
- **React Router v7** for client-side routing
- **TanStack Query v5** for server state & caching
- **TanStack Table v8** for data tables
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for form validation
- **Recharts** for data visualisation
- **Lucide React** for icons
- **Axios** for HTTP requests

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **PostgreSQL** (via `@prisma/adapter-pg`)
- **JWT** (`jsonwebtoken`) for authentication
- **bcryptjs** for password hashing
- **Helmet** + **CORS** for security
- **Nodemon** + **ts-node** for development

### Infrastructure
- **PostgreSQL 16** (Docker Compose)
- **npm Workspaces** (monorepo)

---

## 📁 Project Structure

```
leadforge-crm/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema & enums
│   │   └── seed.ts            # Seed data
│   └── src/
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth & error handling
│       ├── routes/            # Express routers
│       │   ├── auth.routes.ts
│       │   ├── business.routes.ts
│       │   ├── pipeline.routes.ts
│       │   ├── interaction.routes.ts
│       │   ├── task.routes.ts
│       │   ├── proposal.routes.ts
│       │   ├── audit.routes.ts
│       │   └── dashboard.routes.ts
│       └── index.ts           # App entry point
├── frontend/
│   └── src/
│       ├── components/        # Shared UI components & layout
│       ├── context/           # Auth & Theme context providers
│       ├── features/          # Page-level feature modules
│       │   ├── auth/
│       │   ├── businesses/
│       │   ├── crm/           # Pipeline
│       │   ├── dashboard/
│       │   ├── tasks/
│       │   ├── proposals/
│       │   ├── audit/
│       │   ├── reports/
│       │   └── settings/
│       ├── lib/               # Utilities & helpers
│       └── services/          # Axios API service layer
├── docker-compose.yml
└── package.json               # Root workspace config
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (for the PostgreSQL database)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/leadforge-crm.git
cd leadforge-crm
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 instance on port **5433**.

### 3. Configure the backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=3001
DATABASE_URL="postgresql://leadforge:leadforge_password@localhost:5433/leadforge_crm"
JWT_SECRET="your-long-random-secret-here"
FRONTEND_URL="http://localhost:5173"
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run database migrations & seed

```bash
cd backend
npm run prisma:migrate
npm run seed
```

### 6. Start the development servers

From the root:

```bash
npm run dev
```

This concurrently starts:
- **Backend API** → `http://localhost:3001`
- **Frontend** → `http://localhost:5173`

---

## 🗄️ Database Schema

Key models: `User`, `Business`, `Contact`, `Interaction`, `Task`, `WebsiteAudit`, `Proposal`

Pipeline stages (enum `Stage`):
`RESEARCH` → `AUDIT_COMPLETE` → `CONTACTED` → `MEETING_SCHEDULED` → `DEMO_PRESENTED` → `PROPOSAL_SENT` → `NEGOTIATION` → `WON` / `LOST`

---

## 🔌 API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET/POST` | `/api/businesses` | List / create businesses |
| `GET/PUT/DELETE` | `/api/businesses/:id` | Business detail operations |
| `GET/PUT` | `/api/pipeline` | Pipeline stage overview & move |
| `GET/POST` | `/api/interactions` | Log interactions |
| `GET/POST/PUT/DELETE` | `/api/tasks` | Task management |
| `GET/POST` | `/api/proposals` | Proposal management |
| `GET/POST` | `/api/audits` | Website audit records |
| `GET` | `/api/dashboard` | Dashboard stats |
| `GET` | `/health` | Health check |

All routes except `/api/auth` and `/health` require a valid `Authorization: Bearer <token>` header.

---

## 📜 License

[MIT](./LICENSE)
