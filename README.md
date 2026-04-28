<div align="center">

# MarketMakers

**A production-grade financial education platform with AI-powered portfolio intelligence.**

Built with React, Express, FastAPI, and MongoDB -- 3 services, 12 data models, 75 tested endpoints, ~28K lines of code.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue)](LICENSE)

</div>

---

## What is MarketMakers?

MarketMakers is a merit-based EdTech platform where learners study structured courses in stocks, forex, and cryptocurrency -- then apply that knowledge through AI-powered portfolio tools. Contributors (approved via admin review) author courses and modules, while learners track progress, earn certifications, and manage real portfolio positions with live market data.

The platform integrates two LLM providers (Gemini 2.5 Flash as primary, Groq Llama 3.3 70B as fallback) through a dedicated Python microservice that handles portfolio analysis, investment simulation, financial Q&A, and news article simplification -- all through a unified intent-detection assistant.

---

## Table of Contents

- [Architecture](#architecture)
- [Feature Breakdown](#feature-breakdown)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [License](#license)

---

## Architecture

```
                                     MarketMakers Architecture
 
    Browser (React SPA)                 Express API                    FastAPI AI Service
   +---------------------+        +----------------------+        +-----------------------+
   |                     |  REST  |                      | Token  |                       |
   |  Vite + React 18   |------->|  Express 4 + Mongo   |------->|  FastAPI + Pydantic   |
   |  Tailwind + GSAP   |<-------|  Mongoose ODM        |<-------|  SSE Streaming        |
   |  Recharts          |        |  JWT + bcrypt        |        |  Intent Detection     |
   |  Port 5173         |        |  Port 5001           |        |  Port 8000            |
   +---------------------+        +----------+-----------+        +-----------+-----------+
                                             |                                |
                                  +----------+----------+          +----------+----------+
                                  |   MongoDB Atlas      |          |  Gemini 2.5 Flash   |
                                  |   12 Collections     |          |  (primary)          |
                                  +---------------------+          +---------------------+
                                                                   |  Groq Llama 3.3 70B |
                                                                   |  (fallback)         |
                                                                   +---------------------+
                                                                   |  Twelve Data API    |
                                                                   |  (live prices)      |
                                                                   +---------------------+
```

**Design decisions:**

- **Microservice AI layer** -- The AI service is a separate FastAPI process, authenticated via a shared `INTERNAL_TOKEN` header. This isolates LLM latency from the main API, allows independent scaling, and enables provider-agnostic fallback (Gemini -> Groq) without touching backend code.
- **SSE streaming** -- Chat responses are streamed via Server-Sent Events, delivering progressive rendering to the frontend instead of blocking on full LLM generation.
- **DB-verified auth** -- The JWT middleware verifies the user still exists in MongoDB on every request, preventing deleted or banned users from accessing the API with stale tokens.

---

## Feature Breakdown

### Learning Management System
| Feature | Detail |
|---------|--------|
| Course hierarchy | 3-level structure: Course -> Module -> Lesson with ordered sequencing |
| Content delivery | Rich text explanations with embedded YouTube video support per lesson |
| Certification exams | Timed MCQ assessments with configurable pass thresholds and PDF certificate generation |
| Progress tracking | Per-lesson completion with module/course-level aggregation and stats endpoint |
| Contributor workflow | Users apply with experience/reason, admins approve/reject, approved users get authoring access |
| Suggestions | Learners submit per-lesson improvement suggestions; contributors can review them |

### Portfolio Intelligence
| Feature | Detail |
|---------|--------|
| Asset search | TradingView-style autocomplete via Twelve Data API with 100+ pre-loaded tickers |
| Portfolio CRUD | Add, update, delete holdings with ticker, quantity, buy price, and asset type |
| Live prices | Real-time price lookups for portfolio and watchlist via Twelve Data |
| Health score | Algorithmic 0-100 score with weighted factors: diversification (30), concentration (30), count (20), balance (20) |
| AI analysis | Gemini-powered portfolio analysis returning risk level, diversification score, insights, and actionable suggestions |
| History snapshots | Automatic daily portfolio value recording, capped at 365 entries |
| Watchlist | Track assets before buying; one-click promotion to portfolio |
| Course recommendations | Portfolio-aware course suggestions based on ticker-to-tag mapping (e.g., AAPL -> technology, us-markets) |

### AI Assistant
| Feature | Detail |
|---------|--------|
| Unified chat | Single endpoint with intent detection routing to: general_chat, news_simplify, portfolio_guidance, learning_guidance |
| Dual-provider | Gemini 2.5 Flash (primary) with automatic Groq Llama 3.3 70B fallback on quota/error |
| Streaming | SSE-based progressive response delivery with chunk-level JSON events |
| Session persistence | Chat history stored in MongoDB with session management (list, retrieve, continue) |
| Investment simulator | Compound interest projections with AI-generated scenario analysis for preset strategies |
| News simplification | Paste any financial article/headline for plain-language breakdown with key takeaways |

### Admin and Security
| Feature | Detail |
|---------|--------|
| Role system | 3 roles (admin, contributor, learner) enforced at middleware level |
| Auth hardening | bcrypt (12 rounds), JWT with DB verification, password reset via time-limited email tokens |
| Rate limiting | Global limiter (1000 req/15min) + sensitive auth limiter (20 req/15min) |
| Input validation | express-validator on all mutation endpoints with sanitization |
| Security headers | Helmet, CORS with explicit origin allowlist, 50KB body limit |
| Admin dashboard | Platform-wide statistics, contributor approval queue, recent user activity |

### Frontend
| Feature | Detail |
|---------|--------|
| 23 page components | Full SPA with route-level code splitting |
| Dual theme | Persistent light/dark mode via CSS custom properties and React context |
| Animations | Scroll-triggered GSAP animations, CountUp counters, parallax hero section |
| CSS globe | Custom CSS-only animated 3D globe with orbit rings (no Three.js dependency) |
| Glassmorphism | Blurred backdrop panels, gradient borders, layered depth effects |
| Responsive | Mobile-first Tailwind layouts with adaptive navigation |
| Onboarding | Multi-step modal collecting risk profile, literacy score, and first portfolio asset |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3 | SPA framework, build tool, utility-first CSS |
| **UI Libraries** | GSAP, Recharts, Lucide, react-countup | Scroll animations, portfolio charts, icon system, animated numbers |
| **Backend** | Node.js 18+, Express 4, Mongoose 8 | REST API server, MongoDB ODM |
| **Validation** | express-validator, Helmet, express-rate-limit | Input sanitization, security headers, rate limiting |
| **AI Service** | Python 3.11+, FastAPI, Pydantic | Async microservice with typed request/response models |
| **LLM Providers** | Google Gemini 2.5 Flash, Groq Llama 3.3 70B | Primary and fallback generative AI |
| **Market Data** | Twelve Data API | Live price lookups and asset search |
| **Database** | MongoDB Atlas | Cloud-hosted document store |
| **Auth** | jsonwebtoken, bcryptjs, Nodemailer | JWT tokens, password hashing, transactional email |

---

## Data Model

12 Mongoose collections powering the platform:

```
User              Course            Module            Lesson
+-----------+     +-----------+     +-----------+     +-----------+
| name      |     | title     |     | title     |     | title     |
| email     |     | desc      |     | courseId  |     | moduleId  |
| password  |     | instructor|     | order     |     | explanation|
| role      |     | tags[]    |     | contributor|    | videoLinks|
| status    |     | order     |     +-----------+     | order     |
| riskProfile|    | isActive  |                       +-----------+
| literacyScore|  +-----------+
+-----------+

Exam              ExamAttempt       Progress          Suggestion
+-----------+     +-----------+     +-----------+     +-----------+
| title     |     | userId    |     | userId    |     | lessonId  |
| courseId   |     | examId    |     | lessonId  |     | userId    |
| questions[]|    | answers[] |     | completedAt|    | text      |
| passingScore|   | score     |     +-----------+     +-----------+
| duration  |     | passed    |
+-----------+     +-----------+

Portfolio         Watchlist         ChatHistory       PasswordReset
+-----------+     +-----------+     +-----------+     +-----------+
| userId    |     | userId    |     | userId    |     | userId    |
| assets[]  |     | symbol    |     | sessionTitle|   | token     |
| totalValue|     | name      |     | messages[]|     | expiresAt |
| history[] |     | assetType |     +-----------+     +-----------+
+-----------+     | notes     |
                  +-----------+
```

---

## Project Structure

```
MarketMakers/                          133 files, ~28K lines
|
|-- backend/                           Node.js + Express API
|   |-- controllers/                   9 route handlers
|   |   |-- authController.js          Registration, login, password flows, onboarding
|   |   |-- courseController.js        Course CRUD with cascade delete
|   |   |-- moduleController.js        Module CRUD with cascade delete
|   |   |-- lessonController.js        Lesson CRUD with pagination
|   |   |-- portfolioController.js     Portfolio CRUD, summary, live values
|   |   |-- watchlistController.js     Watchlist CRUD with add-to-portfolio
|   |   |-- aiController.js            Proxy to AI microservice
|   |   |-- adminController.js         Platform stats, contributor management
|   |   +-- examController.js          Exam CRUD, attempts, certificates
|   |-- middleware/
|   |   |-- authMiddleware.js          JWT verify + DB user existence check
|   |   |-- validators.js             express-validator rule sets
|   |   |-- checkAdmin.js             Admin role guard
|   |   |-- checkContributor.js        Contributor role guard
|   |   |-- asyncHandler.js           Async error wrapper
|   |   +-- errorMiddleware.js         Global error handler + 404
|   |-- models/                        12 Mongoose schemas
|   |-- routes/                        13 Express routers
|   |-- services/
|   |   |-- aiClient.js               HTTP client for AI microservice
|   |   +-- courseRecommender.js       Portfolio-aware course recommendation engine
|   |-- scripts/
|   |   |-- seed.js                   Full database seeder (users, courses, 60+ lessons, exams)
|   |   +-- resetAdmin.js            Admin password reset utility
|   |-- utils/
|   |   |-- emailService.js          Nodemailer transactional email
|   |   |-- pagination.js            Reusable pagination helper
|   |   +-- tokenGenerator.js        Crypto token generation for password resets
|   |-- config/
|   |   |-- db.js                    MongoDB connection with retry
|   |   +-- logger.js                Winston structured logging
|   |-- app.js                       Express config (CORS, Helmet, rate limiting, routes)
|   +-- index.js                     Server entry point
|
|-- ai-service/                       Python FastAPI microservice
|   |-- services/
|   |   |-- assistant.py             Unified assistant with intent detection + streaming
|   |   |-- portfolio_analyzer.py    Gemini-powered portfolio analysis
|   |   |-- simulator.py            Compound interest simulation + AI explanation
|   |   |-- price_fetcher.py        Twelve Data API integration for live prices
|   |   +-- health_score.py         Algorithmic portfolio health scoring (0-100)
|   |-- main.py                     FastAPI app with token auth, CORS, 9 endpoints
|   +-- requirements.txt
|
|-- frontend/myapp/                   React SPA
|   |-- src/
|   |   |-- components/              14 reusable components
|   |   |   |-- Navbar.jsx           Responsive nav with role-based menu items
|   |   |   |-- OnboardingModal.jsx  Multi-step onboarding wizard (23KB)
|   |   |   |-- AssetSearch.jsx      TradingView-style autocomplete search
|   |   |   |-- HeroGlobe.jsx       CSS-only animated 3D globe
|   |   |   +-- portfolio/           Portfolio sub-components
|   |   |-- pages/                   23 route-level pages
|   |   |   |-- Home.jsx            Scroll-driven homepage with GSAP (30KB)
|   |   |   |-- Dashboard.jsx       Unified learner dashboard (20KB)
|   |   |   |-- Portfolio.jsx       Full portfolio workspace (25KB)
|   |   |   |-- Chatbot.jsx         AI chat interface with streaming (19KB)
|   |   |   +-- ...                 Login, Register, Courses, Exams, Admin, etc.
|   |   |-- context/                Auth + Theme providers
|   |   |-- hooks/                  Custom hooks
|   |   +-- services/               Axios API client
|   +-- index.html                  Entry point with Google Fonts
|
+-- tests/
    +-- runtime_smoke.py            75-test end-to-end smoke test suite
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- MongoDB instance ([Atlas free tier](https://www.mongodb.com/atlas) or local)

### 1. Clone and Install

```bash
git clone https://github.com/Ishan-Pandita/MarketMakers.git
cd MarketMakers

# Backend
cd backend && npm install && cp .env.example .env && cd ..

# AI Service
cd ai-service && python -m venv venv
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
pip install -r requirements.txt && cp .env.example .env && cd ..

# Frontend
cd frontend/myapp && npm install && cp .env.example .env && cd ../..
```

### 2. Configure Environment

Edit the `.env` files in each service directory. See [Environment Variables](#environment-variables) for required values.

### 3. Start All Services

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: AI Service
cd ai-service && uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
cd frontend/myapp && npm run dev
```

### 4. Seed Sample Data (Optional)

```bash
cd backend && npm run seed
```

Creates 5 users, 3 courses, 18 modules, 60+ lessons, and 2 certification exams. Login credentials are printed to the console.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | 64-char hex string for token signing | Yes |
| `JWT_EXPIRE` | Token expiry (default: `7d`) | Yes |
| `PORT` | Server port (default: `5001`) | No |
| `AI_SERVICE_URL` | AI microservice base URL | Yes |
| `INTERNAL_TOKEN` | Shared secret for AI service auth | Yes |
| `FRONTEND_URL` | Frontend origin for CORS | Yes |
| `EMAIL_SERVICE` | Email provider (e.g., `gmail`) | No |
| `EMAIL_USER` | Sender email address | No |
| `EMAIL_PASSWORD` | App-specific email password | No |

### AI Service (`ai-service/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key ([get free key](https://aistudio.google.com/apikey)) | Yes |
| `GROQ_API_KEY` | Groq API key ([get free key](https://console.groq.com/keys)) | No |
| `TWELVE_DATA_API_KEY` | Twelve Data key for live prices | No |
| `INTERNAL_TOKEN` | Must match backend value | Yes |
| `CORS_ORIGINS` | Comma-separated allowed origins | No |

### Frontend (`frontend/myapp/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (e.g., `http://localhost:5001/api/v1`) | Yes |

---

## API Reference

### Authentication (9 endpoints)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Create account (learner or contributor) | Public |
| POST | `/api/v1/auth/login` | Authenticate and receive JWT | Public |
| GET | `/api/v1/auth/me` | Get current user profile | JWT |
| GET | `/api/v1/auth/me/context` | Get user + portfolio + learning summary | JWT |
| PUT | `/api/v1/auth/profile` | Update name/email | JWT |
| PUT | `/api/v1/auth/change-password` | Change password (requires current) | JWT |
| POST | `/api/v1/auth/complete-onboarding` | Submit risk profile + first asset | JWT |
| POST | `/api/v1/auth/forgot-password` | Request password reset email | Public |
| POST | `/api/v1/auth/reset-password/:token` | Reset with time-limited token | Public |

### Learning Content (12 endpoints)

| Method | Endpoint | Auth |
|--------|----------|------|
| GET/POST | `/api/v1/courses` | Read: public. Write: contributor |
| GET | `/api/v1/courses/:id` | Public |
| GET | `/api/v1/courses/recommended` | JWT (portfolio-aware) |
| DELETE | `/api/v1/courses/:id` | Contributor (cascade deletes modules/lessons) |
| GET/POST | `/api/v1/modules` | Read: public. Write: contributor |
| GET/POST/DELETE | `/api/v1/lessons` | Read: public. Write: contributor |
| GET | `/api/v1/lessons/module/:id` | Public |
| POST | `/api/v1/progress` | JWT (mark lesson complete) |
| GET | `/api/v1/progress/me` | JWT |
| GET | `/api/v1/progress/stats` | JWT |

### Portfolio and Watchlist (10 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/portfolio` | Full portfolio with assets |
| GET | `/api/v1/portfolio/summary` | Allocation, top assets, history |
| POST | `/api/v1/portfolio/assets` | Add holding |
| PUT/DELETE | `/api/v1/portfolio/assets/:id` | Update or remove |
| GET | `/api/v1/portfolio/live-values` | Live prices for all holdings |
| GET | `/api/v1/watchlist` | List watched assets |
| POST | `/api/v1/watchlist` | Add to watchlist |
| GET | `/api/v1/watchlist/live-values` | Live prices for watched |
| POST | `/api/v1/watchlist/:sym/add-to-portfolio` | Promote to portfolio |
| DELETE | `/api/v1/watchlist/:sym` | Remove from watchlist |

### AI Services (8 endpoints via backend proxy)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/chat` | Chat with unified assistant (intent detection) |
| POST | `/api/v1/ai/chat/stream` | SSE streaming chat |
| GET | `/api/v1/ai/chat/sessions` | List chat sessions |
| GET | `/api/v1/ai/chat/sessions/:id` | Retrieve session history |
| POST | `/api/v1/ai/analyze` | AI portfolio analysis |
| GET | `/api/v1/ai/health-score` | Algorithmic health score |
| GET | `/api/v1/ai/asset-search` | Search tickers via Twelve Data |
| POST | `/api/v1/ai/simulate` | Investment simulation + AI explanation |

### Admin (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/stats` | Platform-wide analytics |
| GET | `/api/v1/admin/pending-contributors` | Contributor approval queue |
| PUT | `/api/v1/admin/update-status/:id` | Approve/reject contributor |

---

## Testing

The project includes a comprehensive 75-test end-to-end smoke test suite that covers every API endpoint.

```bash
# Install test dependencies
pip install httpx python-dotenv

# Start backend and AI service, then:
python tests/runtime_smoke.py
```

**Test coverage by category:**

| Category | Tests | What's verified |
|----------|-------|-----------------|
| Infrastructure | 4 | Health checks, root endpoints |
| Public endpoints | 8 | Courses, modules, exams, search, contributors |
| Auth guards | 4 | 401 on unauthenticated requests |
| Registration flow | 11 | Register, login, password change, onboarding, forgot/reset |
| RBAC enforcement | 5 | Learners blocked from contributor/admin actions |
| Portfolio CRUD | 7 | Create, read, update, delete assets + live prices |
| Watchlist | 5 | CRUD + add-to-portfolio promotion |
| AI proxy endpoints | 8 | Chat, stream, analyze, simulate, health score, search |
| AI direct endpoints | 8 | FastAPI endpoints with internal token auth |
| Progress tracking | 2 | Completion recording and statistics |
| Exams | 5 | Submit attempt, review, certificate generation |
| **Total** | **75** | **Full endpoint coverage** |

---

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
