# ⚡ MarketMakers — Financial Intelligence & Learning Platform

A full-stack financial platform that combines **AI-powered investment tools** with a structured **learning management system**. Built with React, Node.js, FastAPI, and a unified free-tier AI assistant powered by Gemini 2.5 Flash with optional Groq fallback.

---

## ✨ Features

### 🎨 Premium UI & Theming
- **Dual-Theme Architecture** — Seamless, persistent Light and Dark modes.
- **Micro-Interactions** — Smooth CSS transitions, tactile button feedback (`active:scale`), and slide-in animations.
- **Professional Iconography** — Fully integrated with scalable `lucide-react` SVG icons.
- **Glassmorphism** — Modern, blurred backdrop panels for cards and navigation.

### 📚 Learning Management System
- **Courses & Modules** — Structured financial education content
- **Lessons** — Rich text content with embedded video support
- **Exams & Certifications** — MCQ-based assessments with scoring
- **Progress Tracking** — Per-lesson completion tracking
- **Contributor System** — Approved contributors can create courses

### 💼 Portfolio Management
- **Smart Asset Search** — TradingView-style autocomplete with 100+ pre-loaded assets (US stocks, Indian stocks, crypto, ETFs, bonds, commodities)
- **Asset CRUD** — Add, edit, and remove investments with auto-fill from search
- **Unified Portfolio Workspace** — Holdings, allocation charts, health score, and simulator tools in one place
- **Portfolio Health Score** — Weighted 0-100 score based on diversification, concentration, asset count, and balance
- **AI Portfolio Analyzer** — Gemini-powered diversification analysis, risk scoring, and actionable suggestions
- **Watchlist** — Track assets before buying with live price lookups
- **History Tracking** — Automatic portfolio value snapshots (capped at 365 entries)

### 🤖 AI-Powered Tools
- **Unified AI Financial Assistant** — One assistant for chat, portfolio-aware guidance, learning help, and financial news simplification using Gemini 2.5 Flash with optional Groq fallback
- **Investment Simulator** — Compound interest calculator with interactive charts, preset strategies, and AI-generated insights
- **Quick Actions** — One-click cards for portfolio advice, market analysis, article simplification, and learning prompts

### 🛡️ Admin Dashboard
- **Platform Analytics** — Total users, learners, contributors, courses, exams, lesson completions
- **Contributor Management** — Approve or reject contributor applications
- **Recent Users** — View latest signups with role badges

### 🔐 Security & Authentication
- JWT authentication with strong 64-char secret
- Role-based access control with hierarchy (Admin > Contributor > Learner)
- Admin role injection protection (can't self-assign admin via registration)
- Password hashing with bcryptjs (salt factor 12)
- Global rate limiting with stricter throttling on sensitive auth routes
- Input validation on all endpoints (portfolio, AI, auth, courses)
- Response compression (gzip)
- Helmet security headers
- Toast notifications for all API error states

---

## 🏗️ Architecture

```
┌────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Frontend     │◄──►│   Backend API   │◄──►│  AI Microservice │
│  React + Vite  │    │  Express + Mongo│    │  FastAPI         │
│  :5173         │    │  :5001          │    │  :8000           │
└────────────────┘    └─────────────────┘    └──────────────────┘
                                                    │
                                              ┌─────┴──────┐
                                              │ Gemini 2.5  │
                                              │ Flash       │
                                              ├─────────────┤
                                              │ Groq Llama  │
                                              │ 3.3 70B     │
                                              └─────────────┘
```

```
MarketMakers/
├── backend/                    # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js         ← Auth + role protection
│   │   ├── adminController.js        ← Admin stats + approvals
│   │   ├── courseController.js        ← Course CRUD
│   │   ├── portfolioController.js    ← Portfolio CRUD + summary
│   │   ├── aiController.js           ← AI feature proxy
│   │   └── ...
│   ├── models/
│   │   ├── User.js                   ← Roles, hashing, validation
│   │   ├── Portfolio.js              ← Assets + capped history
│   │   ├── ChatHistory.js            ← Chat session persistence
│   │   └── Course.js, Module.js, Lesson.js, Exam.js ...
│   ├── routes/
│   │   ├── adminRoutes.js            ← /api/v1/admin/*
│   │   ├── portfolioRoutes.js        ← /api/v1/portfolio/*
│   │   ├── aiRoutes.js               ← /api/v1/ai/*
│   │   └── ...
│   ├── middleware/
│   │   ├── validators.js             ← Portfolio, AI, auth validators
│   │   ├── errorMiddleware.js        ← Error handling (no URL leak)
│   │   └── authMiddleware.js, checkAdmin.js, asyncHandler.js
│   ├── scripts/
│   │   ├── seed.js                   ← Full database seeder
│   │   ├── seedAdmin.js
│   │   └── resetAdmin.js
│   └── config/
│
├── ai-service/                 # Python FastAPI + Multi-Provider AI
│   ├── main.py                       ← FastAPI app with request logging
│   ├── requirements.txt
│   └── services/
│       ├── portfolio_analyzer.py     ← Gemini 2.5 Flash
│       ├── health_score.py           ← Algorithmic (no AI)
│       ├── assistant.py              ← Unified chat + news simplification
│       └── simulator.py              ← Gemini 2.5 Flash
│
└── frontend/myapp/             # React + Vite + TailwindCSS
    ├── src/
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx    ← Platform analytics
    │   │   ├── Portfolio.jsx         ← Unified portfolio workspace
    │   │   ├── Watchlist.jsx         ← Save assets before buying
    │   │   ├── Chatbot.jsx           ← Streaming AI assistant + news simplifier
    │   │   ├── Dashboard.jsx, Home.jsx, Courses.jsx ...
    │   │   └── ...
    │   ├── components/
    │   │   ├── AssetSearch.jsx       ← TradingView-style autocomplete
    │   │   ├── ProtectedRoute.jsx    ← Role hierarchy protection
    │   │   ├── Navbar.jsx            ← Dynamic nav with admin link
    │   │   └── ...
    │   ├── hooks/
    │   │   └── usePageTitle.js       ← Per-page browser tab titles
    │   ├── context/
    │   │   └── AuthContext.jsx       ← Auth state + user profile
    │   └── services/
    │       └── api.js                ← Axios + toast error handling
    └── .env
```

## 🛠️ Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Recharts, react-hot-toast |
| **Backend** | Node.js, Express.js, Mongoose, Helmet, compression |
| **AI Service** | Python, FastAPI, Gemini 2.5 Flash, optional Groq fallback |
| **Database** | MongoDB (Atlas or local) |
| **Auth** | JWT (64-char secret), bcryptjs |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.9+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Gemini API Key** (free) — [Get one here](https://aistudio.google.com/apikey)
- **Groq API Key** (free, optional) — [Get one here](https://console.groq.com/keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ishan-Pandita/MarketMakers
   cd MarketMakers
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   # Edit the existing .env with your MongoDB URI and settings
   ```
   Required backend `.env` values:
   ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_long_random_secret
    INTERNAL_TOKEN=shared_secret_used_by_backend_and_ai_service
    PORT=5001
    AI_SERVICE_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:5173
    CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
    JWT_EXPIRE=7d
    ```
   Optional backend email values:
   ```bash
   EMAIL_FROM=noreply@marketmakers.com
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email_username
   EMAIL_PASSWORD=your_email_password
   # Or use generic SMTP instead of Gmail:
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   ```
   Note: in development, password reset falls back to logging the reset URL if email delivery is not configured. In production, configure SMTP or Gmail if you want reset emails to work.

3. **Frontend setup**
   ```bash
   cd frontend/myapp
   npm install
   # Confirm frontend/myapp/.env contains:
   # VITE_API_URL=http://localhost:5001/api/v1
   ```

4. **AI Service setup**
   ```bash
   cd ai-service
   python -m venv venv

   # Windows
   .\venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate

   pip install -r requirements.txt

    # Edit ai-service/.env with your API keys:
    # GEMINI_API_KEY=your_gemini_key
    # GROQ_API_KEY=your_groq_key (optional — enables Groq fallback)
    # TWELVE_DATA_API_KEY=your_twelve_data_key (optional — enables live prices)
    # INTERNAL_TOKEN=shared_secret_used_by_backend_and_ai_service
    # PORT=8000
    ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

### Running the Application

Start all three services in separate terminals:

```bash
# Terminal 1 — AI Service (port 8000)
cd ai-service
.\venv\Scripts\activate    # or: source venv/bin/activate
python main.py

# Terminal 2 — Backend API (port 5001)
cd backend
npm run dev

# Terminal 3 — Frontend (port 5173)
cd frontend/myapp
npm run dev
```

Access the app at **http://localhost:5173**

This project is currently documented for local development only. Docker files and compose setup have been removed for now.

### Deployment Checklist

Before deploying, make sure you:

```bash
# Frontend
cd frontend/myapp
npm run lint
npm run build
```

- Set `NODE_ENV=production` for backend and AI service.
- Set `FRONTEND_URL` to your deployed frontend URL.
- Set `CORS_ORIGINS` to a comma-separated allowlist of browser origins that should reach the backend.
- Keep `INTERNAL_TOKEN` identical in `backend/.env` and `ai-service/.env`.
- Provide `EMAIL_*` or `SMTP_*` values if production password-reset emails must be delivered.
- Provide `TWELVE_DATA_API_KEY` if you want live watchlist and portfolio prices.
- Verify `/api/v1/health` on the backend and `/health` on the AI service after deploy.

---

## 🔐 Demo Accounts

Created by `npm run seed`. All passwords: `password123`

| Role | Name | Email |
|:-----|:-----|:------|
| **Admin** | Ishan Pandita | `admin@marketmakers.com` |
| **Contributor** | Priya Sharma | `priya@marketmakers.com` |
| **Contributor** | Rajesh Kapoor | `rajesh@marketmakers.com` |
| **Learner** | Arjun Mehta | `arjun@marketmakers.com` |
| **Learner** | Sneha Patel | `sneha@marketmakers.com` |

---

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/v1/auth/register` | POST | Register (learner/contributor only) |
| `/api/v1/auth/login` | POST | Login |
| `/api/v1/auth/me` | GET | Get current user profile |
| `/api/v1/auth/forgot-password` | POST | Send reset email |
| `/api/v1/auth/reset-password/:token` | POST | Reset password |

### Admin (Admin only)
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/v1/admin/stats` | GET | Platform analytics |
| `/api/v1/admin/pending-contributors` | GET | List pending approvals |
| `/api/v1/admin/update-status/:id` | PUT | Approve/reject user |

### Portfolio Management (Protected)
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/v1/portfolio` | GET | Get user's portfolio |
| `/api/v1/portfolio/summary` | GET | Portfolio stats & allocation |
| `/api/v1/portfolio/assets` | POST | Add asset (validated) |
| `/api/v1/portfolio/assets/:id` | PUT | Update asset (validated) |
| `/api/v1/portfolio/assets/:id` | DELETE | Remove asset |

### AI Features (Protected)
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/v1/ai/analyze` | POST | AI portfolio analysis |
| `/api/v1/ai/health-score` | GET | Portfolio health score |
| `/api/v1/ai/chat` | POST | Unified AI assistant (chat + news simplification) |
| `/api/v1/ai/chat/sessions` | GET | List chat sessions |
| `/api/v1/ai/simulate` | POST | Investment simulation |

### LMS Content
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/v1/courses` | GET/POST | List / Create courses |
| `/api/v1/modules` | GET/POST | List / Create modules |
| `/api/v1/lessons` | GET/POST | List / Create lessons |
| `/api/v1/exams` | GET/POST | List / Create exams |
| `/api/v1/progress` | GET/POST | Track progress |

### AI Service (FastAPI — port 8000)
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/health` | GET | Service health check |
| `/analyze` | POST | Portfolio analysis (Gemini) |
| `/health-score` | POST | Health score (algorithmic) |
| `/chat` | POST | Unified assistant (Gemini primary, Groq fallback) |
| `/simulate` | POST | Simulation explanation (Gemini) |
| `/docs` | GET | Swagger API documentation |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes.

**Built by [Ishan Pandita](https://github.com/Ishan-Pandita)**
