# MarketMakers

**A full-stack financial education platform that bridges the gap between financial literacy and professional trading.**

MarketMakers is a merit-based EdTech ecosystem built with React, Express, FastAPI, and MongoDB. It delivers structured courses in stocks, forex, and cryptocurrency trading -- backed by AI-powered tools for portfolio analysis, investment simulation, and an adaptive financial assistant.

> **Live Architecture:** React (Vite) frontend | Express + MongoDB backend | FastAPI AI microservice powered by Gemini 2.5 Flash and Groq Llama 3.3 70B

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [License](#license)

---

## Key Features

### Learning Management System
- **Courses, Modules, and Lessons** -- Structured financial education with rich text content and embedded video support.
- **Certification Exams** -- MCQ-based assessments with timed sessions, scoring, pass/fail thresholds, and downloadable certificates.
- **Progress Tracking** -- Per-lesson completion tracking with visual progress indicators across modules and courses.
- **Contributor System** -- Approved contributors can author courses, modules, and lessons with full editorial control.

### Portfolio Management
- **Smart Asset Search** -- TradingView-style autocomplete with 100+ pre-loaded assets (US stocks, Indian stocks, crypto, forex, commodities).
- **Asset CRUD** -- Add, edit, and remove investments with quantity, buy price, and auto-filled metadata from search.
- **Portfolio Health Score** -- Weighted 0-100 score based on diversification, concentration risk, asset count, and balance metrics.
- **AI Portfolio Analyzer** -- Gemini-powered diversification analysis, risk scoring, and actionable investment suggestions.
- **Watchlist** -- Track assets of interest with live price lookups before committing capital.
- **History Tracking** -- Automatic portfolio value snapshots (capped at 365 entries) for trend analysis.

### AI-Powered Tools
- **Unified Financial Assistant** -- One assistant that handles chat, portfolio-aware guidance, learning help, and financial Q&A through intent detection.
- **Investment Simulator** -- Compound interest calculator with interactive charts, preset strategies (Conservative, Balanced, Aggressive), and AI-generated scenario analysis.
- **Quick Actions** -- One-click cards for portfolio advice, market analysis, article simplification, and learning prompts.

### Admin Dashboard
- **Platform Analytics** -- Total users, learners, contributors, courses, exams, and lesson completion metrics.
- **Contributor Management** -- Approve or reject contributor applications with role-based access control.
- **Recent Activity** -- View latest signups with role badges and platform usage statistics.

### Security and Authentication
- JWT-based authentication with httpOnly cookie support and 7-day token expiry.
- Role-based access control (admin, contributor, learner) enforced at both route and middleware levels.
- bcrypt password hashing with configurable salt rounds.
- Input validation and sanitization on all API endpoints via express-validator.
- Rate limiting, CORS configuration, and secure headers via Helmet.
- Password reset flow with time-limited tokens and email delivery.

### UI/UX Design
- **Dual-Theme Architecture** -- Seamless, persistent Light and Dark modes with CSS custom properties.
- **Micro-Interactions** -- Smooth CSS transitions, tactile button feedback, and scroll-triggered GSAP animations.
- **Glassmorphism** -- Modern blurred backdrop panels for cards and navigation elements.
- **Responsive Design** -- Mobile-first layouts with Tailwind CSS utility classes.

---

## Architecture

```
+-----------------------+    +-----------------------+    +---------------------+
|     Frontend          |    |     Backend API       |    |   AI Microservice   |
|     React + Vite      |--->|     Express + Mongo   |--->|   FastAPI           |
|     Port 5173         |    |     Port 5001         |    |   Port 8000         |
+-----------------------+    +-----------------------+    +---------------------+
                                                                   |
                                                          +--------+--------+
                                                          | Gemini 2.5      |
                                                          | Flash           |
                                                          +-----------------+
                                                          | Groq Llama      |
                                                          | 3.3 70B         |
                                                          +-----------------+
```

**Data Flow:**
1. The React frontend communicates with the Express backend via RESTful API calls.
2. The backend proxies AI requests to the FastAPI microservice, authenticated via a shared internal token.
3. The AI microservice routes requests to Gemini (primary) or Groq (fallback) based on the task type.

---

## Tech Stack

| Layer          | Technology                                                |
|----------------|-----------------------------------------------------------|
| Frontend       | React 19, Vite, Tailwind CSS, GSAP, Recharts, Lucide     |
| Backend        | Node.js, Express 4, Mongoose 8, express-validator         |
| AI Service     | Python 3.11+, FastAPI, Google Generative AI, Groq SDK     |
| Database       | MongoDB (Atlas or local)                                  |
| Authentication | JWT (jsonwebtoken), bcryptjs                              |
| Email          | Nodemailer (Gmail SMTP)                                   |

---

## Project Structure

```
MarketMakers/
|-- backend/
|   |-- controllers/         # Route handlers (auth, course, portfolio, admin, etc.)
|   |-- middleware/           # Auth, validation, error handling, role checks
|   |-- models/              # Mongoose schemas (User, Course, Module, Lesson, Exam, Portfolio)
|   |-- routes/              # Express route definitions
|   |-- services/            # AI client proxy, course recommender
|   |-- scripts/             # Database seeding and admin reset utilities
|   |-- utils/               # Email service, pagination, token generation
|   |-- app.js               # Express app configuration
|   +-- index.js             # Server entry point
|
|-- ai-service/
|   |-- services/
|   |   |-- assistant.py     # Unified AI assistant with intent detection
|   |   |-- portfolio_analyzer.py  # Gemini-powered portfolio analysis
|   |   |-- simulator.py     # Investment simulation engine
|   |   |-- price_fetcher.py # Live price lookups via Twelve Data
|   |   +-- health_score.py  # Portfolio health scoring algorithm
|   |-- main.py              # FastAPI application with CORS and routing
|   +-- requirements.txt     # Python dependencies
|
|-- frontend/myapp/
|   |-- src/
|   |   |-- components/      # Reusable UI components (Navbar, Footer, Pagination, etc.)
|   |   |-- pages/           # Route-level page components
|   |   |-- context/         # React context providers (Auth, Theme)
|   |   |-- hooks/           # Custom hooks (usePageTitle)
|   |   +-- services/        # Axios API client configuration
|   |-- public/              # Static assets
|   +-- index.html           # Application entry point
|
+-- tests/                   # Smoke tests and integration test scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/ishan2210291-commits/MarketMakers.git
cd MarketMakers
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email configuration
npm run dev
```

The backend server starts on `http://localhost:5001`.

### 3. AI Service Setup

```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Gemini and Groq API keys
uvicorn main:app --reload --port 8000
```

The AI microservice starts on `http://localhost:8000`.

### 4. Frontend Setup

```bash
cd frontend/myapp
npm install
cp .env.example .env
npm run dev
```

The frontend starts on `http://localhost:5173`.

### 5. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This creates sample users, courses, modules, lessons, and exams for development. Default credentials are printed to the console after seeding.

---

## Environment Variables

Each service requires its own `.env` file. Use the provided `.env.example` files as templates.

**Backend (`backend/.env`):**

| Variable          | Description                              |
|-------------------|------------------------------------------|
| `MONGO_URI`       | MongoDB connection string                |
| `JWT_SECRET`      | 64-character hex string for JWT signing  |
| `JWT_EXPIRE`      | Token expiry duration (e.g., `7d`)       |
| `PORT`            | Server port (default: `5001`)            |
| `AI_SERVICE_URL`  | AI microservice URL                      |
| `INTERNAL_TOKEN`  | Shared secret for backend-AI auth        |
| `FRONTEND_URL`    | Frontend URL for CORS                    |
| `EMAIL_SERVICE`   | Email provider (e.g., `gmail`)           |
| `EMAIL_USER`      | Sender email address                     |
| `EMAIL_PASSWORD`  | App-specific password                    |

**AI Service (`ai-service/.env`):**

| Variable            | Description                            |
|----------------------|----------------------------------------|
| `GEMINI_API_KEY`     | Google Gemini API key                  |
| `GROQ_API_KEY`       | Groq API key (optional, for fallback)  |
| `TWELVE_DATA_API_KEY` | Twelve Data API key (optional)        |
| `INTERNAL_TOKEN`     | Must match backend `INTERNAL_TOKEN`    |

**Frontend (`frontend/myapp/.env`):**

| Variable         | Description                                |
|------------------|--------------------------------------------|
| `VITE_API_URL`   | Backend API base URL                       |

---

## API Reference

### Authentication
| Method | Endpoint                  | Description              | Access  |
|--------|---------------------------|--------------------------|---------|
| POST   | `/api/v1/auth/register`   | Register a new user      | Public  |
| POST   | `/api/v1/auth/login`      | Login and receive JWT     | Public  |
| POST   | `/api/v1/auth/forgot-password` | Request password reset | Public |
| POST   | `/api/v1/auth/reset-password/:token` | Reset password  | Public  |

### Courses and Content
| Method | Endpoint                       | Description               | Access       |
|--------|--------------------------------|---------------------------|--------------|
| GET    | `/api/v1/courses`              | List all courses          | Authenticated |
| POST   | `/api/v1/courses`              | Create a course           | Contributor  |
| GET    | `/api/v1/modules?courseId=...`  | List modules for a course | Authenticated |
| GET    | `/api/v1/lessons?moduleId=...` | List lessons for a module | Authenticated |
| POST   | `/api/v1/progress`             | Mark a lesson complete    | Authenticated |

### Portfolio
| Method | Endpoint                       | Description               | Access       |
|--------|--------------------------------|---------------------------|--------------|
| GET    | `/api/v1/portfolio`            | Get user portfolio        | Authenticated |
| POST   | `/api/v1/portfolio/assets`     | Add an asset              | Authenticated |
| PUT    | `/api/v1/portfolio/assets/:id` | Update an asset           | Authenticated |
| DELETE | `/api/v1/portfolio/assets/:id` | Remove an asset           | Authenticated |

### AI Services
| Method | Endpoint                     | Description                | Access       |
|--------|------------------------------|----------------------------|--------------|
| POST   | `/api/v1/ai/chat`            | Chat with AI assistant     | Authenticated |
| POST   | `/api/v1/ai/analyze`         | Analyze portfolio          | Authenticated |
| POST   | `/api/v1/ai/simulate`        | Run investment simulation  | Authenticated |
| GET    | `/api/v1/ai/health-score`    | Get portfolio health score | Authenticated |

### Admin
| Method | Endpoint                          | Description                  | Access |
|--------|-----------------------------------|------------------------------|--------|
| GET    | `/api/v1/admin/stats`             | Platform statistics          | Admin  |
| GET    | `/api/v1/admin/contributors`      | List contributor applications | Admin |
| PUT    | `/api/v1/admin/contributors/:id`  | Approve/reject contributor   | Admin  |

---

## Screenshots

> Screenshots will be added after deployment. The platform features a dual-theme design with glassmorphism effects, scroll-triggered animations, and a responsive layout optimized for both desktop and mobile.

---

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
