# ⚡ MarketMakers — Financial Intelligence & Learning Platform

A full-stack financial platform that combines **AI-powered investment tools** with a structured **learning management system**. Built with React, Node.js, FastAPI, and multi-provider AI (Gemini 2.5 Flash + Groq Llama 3.3 70B).

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
- **Portfolio Dashboard** — Interactive charts (Pie chart allocation, Area chart growth history)
- **Portfolio Health Score** — Weighted 0-100 score based on diversification, concentration, asset count, and balance
- **AI Portfolio Analyzer** — Gemini-powered diversification analysis, risk scoring, and actionable suggestions
- **History Tracking** — Automatic portfolio value snapshots (capped at 365 entries)

### 🤖 AI-Powered Tools
- **AI Financial Chatbot** — Ultra-fast conversational AI powered by Groq Llama 3.3 70B (<500ms), with Gemini 2.5 Flash fallback. Includes integrated **News Simplifier** — paste any financial article directly in the chat to get simple explanations, key terms, and market impact
- **Investment Simulator** — Compound interest calculator with interactive charts, preset strategies, and AI-generated insights
- **Quick Actions** — One-click cards for Portfolio Advice, Market Analysis, News Simplification, and Learning

### 🛡️ Admin Dashboard
- **Platform Analytics** — Total users, learners, contributors, courses, exams, lesson completions
- **Contributor Management** — Approve or reject contributor applications
- **Recent Users** — View latest signups with role badges

### 🔐 Security & Authentication
- JWT authentication with strong 64-char secret
- Role-based access control with hierarchy (Admin > Contributor > Learner)
- Admin role injection protection (can't self-assign admin via registration)
- Password hashing with bcryptjs (salt factor 12)
- Rate limiting (100 req/15min global, 10 req/15min for auth)
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
│       ├── news_simplifier.py        ← Gemini 2.5 Flash
│       ├── chatbot.py                ← Groq Llama 3.3 70B + fallback
│       └── simulator.py              ← Gemini 2.5 Flash
│
└── frontend/myapp/             # React + Vite + TailwindCSS
    ├── src/
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx    ← Platform analytics
    │   │   ├── Portfolio.jsx         ← Smart asset search + CRUD
    │   │   ├── PortfolioDashboard.jsx ← Charts + health score + AI
    │   │   ├── Chatbot.jsx           ← Chat + integrated news simplifier
    │   │   ├── Simulator.jsx         ← Investment growth simulator
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
    └── .env.example
```

## 🛠️ Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Recharts, react-hot-toast |
| **Backend** | Node.js, Express.js, Mongoose, Helmet, compression |
| **AI Service** | Python, FastAPI, Gemini 2.5 Flash, Groq Llama 3.3 70B |
| **Database** | MongoDB (Atlas or local) |
| **Auth** | JWT (64-char secret), bcryptjs |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v14+
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
   cp .env.example .env
   # Edit .env with your MongoDB URI and settings
   ```

3. **Frontend setup**
   ```bash
   cd frontend/myapp
   npm install
   cp .env.example .env
   # Default: VITE_API_URL=http://localhost:5001/api/v1
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

   # Create .env with your API keys:
   # GEMINI_API_KEY=your_gemini_key
   # GROQ_API_KEY=your_groq_key (optional — enables ultra-fast chatbot)
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
| `/api/v1/ai/simplify-news` | POST | Simplify financial news (validated) |
| `/api/v1/ai/chat` | POST | AI chatbot (validated) |
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
| `/simplify-news` | POST | News simplification (Gemini) |
| `/chat` | POST | Chatbot (Groq → Gemini fallback) |
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
