# MarketMakers 📈

**Master the Markets Like a Pro.**
A premium trading education platform connecting learners with verified experts.
**Owned & Operated by Ishan Pandita**.

## 🚀 Overview

MarketMakers is a full-stack Learning Management System (LMS) for financial education. Verified contributors create structured courses, and learners progress through curriculum with progress tracking and certification exams.

## ✨ Key Features

- **Premium Light Theme UI** — Clean editorial design with indigo/teal accents, Plus Jakarta Sans & DM Sans typography, soft shadows, and micro-animations.
- **Structured Courses** — Courses → Modules → Lessons hierarchy with video support and progress tracking.
- **Contributor Marketplace** — Contributors apply, admins approve, then creators build courses with a clean editor.
- **Certification Exams** — Timed assessments with automatic grading, score tracking, and pass/fail results.
- **Role-Based Access** — Learner, Contributor, and Admin roles with protected routes.
- **Responsive Design** — Mobile-first layout, frosted glass navbar, smooth transitions.

## 📂 Project Structure

```
MarketMakers/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   ├── authMiddleware.js    # JWT authentication
│   │   ├── checkAdmin.js        # Admin role check
│   │   ├── checkContributor.js  # Contributor role check
│   │   ├── errorMiddleware.js   # Global error handler
│   │   └── validators.js        # Input validation
│   ├── models/
│   │   ├── Course.js            # Course schema
│   │   ├── Exam.js              # Exam schema
│   │   ├── ExamAttempt.js       # Exam attempts
│   │   ├── Lesson.js            # Lesson schema
│   │   ├── Module.js            # Module schema
│   │   ├── PasswordReset.js     # Password reset tokens
│   │   ├── Progress.js          # Lesson progress
│   │   ├── Suggestion.js        # User comments
│   │   └── User.js              # User accounts
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin management
│   │   ├── authRoutes.js        # Auth (register, login, reset)
│   │   ├── courseRoutes.js      # Course CRUD
│   │   ├── examRoutes.js        # Exam & attempts
│   │   ├── lessonRoutes.js      # Lesson CRUD
│   │   ├── moduleRoutes.js      # Module CRUD
│   │   ├── progressRoutes.js    # Progress tracking
│   │   ├── searchRoutes.js      # Global search
│   │   ├── suggestionRoutes.js  # Comments/feedback
│   │   └── userRoutes.js        # Public profiles
│   ├── scripts/
│   │   ├── resetAdmin.js        # Admin reset utility
│   │   ├── seed.js              # Full database seeder
│   │   └── seedAdmin.js         # Admin-only seeder
│   ├── utils/
│   │   ├── emailService.js      # Email sender
│   │   ├── pagination.js        # Pagination helper
│   │   └── tokenGenerator.js    # Secure token generator
│   ├── .env.example             # Environment template
│   ├── app.js                   # Express app setup
│   └── index.js                 # Server entry point
│
└── frontend/myapp/
    ├── public/
    │   ├── logo.svg             # Brand logo
    │   └── vite.svg             # Vite favicon
    └── src/
        ├── components/
        │   ├── ErrorBoundary.jsx   # React error boundary
        │   ├── ErrorMessage.jsx    # Error alert
        │   ├── Footer.jsx          # Site footer
        │   ├── LoadingSpinner.jsx  # Loading state
        │   ├── Logo.jsx            # Brand logo component
        │   ├── Navbar.jsx          # Navigation bar
        │   ├── Pagination.jsx      # Page navigation
        │   ├── ProgressBar.jsx     # Progress indicator
        │   ├── ProtectedRoute.jsx  # Auth route guard
        │   └── SuccessMessage.jsx  # Success alert
        ├── context/
        │   └── AuthContext.jsx     # Auth state provider
        ├── pages/
        │   ├── ContributorProfile.jsx  # Public contributor page
        │   ├── Contributors.jsx        # Contributors list
        │   ├── Courses.jsx             # Course browser
        │   ├── CreateCourse.jsx        # Course creation form
        │   ├── CreateModule.jsx        # Module creation form
        │   ├── Dashboard.jsx           # User dashboard
        │   ├── ExamResult.jsx          # Exam results page
        │   ├── Exams.jsx               # Exams list
        │   ├── ForgotPassword.jsx      # Password recovery
        │   ├── Home.jsx                # Landing page
        │   ├── Lesson.jsx              # Single lesson view
        │   ├── Lessons.jsx             # Module lessons list
        │   ├── Login.jsx               # Login page
        │   ├── Modules.jsx             # Course modules list
        │   ├── Profile.jsx             # Account settings
        │   ├── Register.jsx            # Registration page
        │   ├── ResetPassword.jsx       # Password reset form
        │   ├── StaticPage.jsx          # Generic static page
        │   └── TakeExam.jsx            # Exam interface
        ├── services/
        │   └── api.js              # Axios HTTP client
        ├── App.jsx                 # Root component & routes
        ├── main.jsx                # React entry point
        └── index.css               # Global styles & Tailwind
```

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Plus Jakarta Sans & DM Sans (Google Fonts) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or Atlas URI)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Ishan-Pandita/MarketMakers
    cd MarketMakers
    ```

2. **Install dependencies**
    ```bash
    cd backend && npm install
    cd ../frontend/myapp && npm install
    ```

3. **Environment setup**
    Copy the example env file and configure:
    ```bash
    cp backend/.env.example backend/.env
    ```
    Edit `backend/.env` with your values:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/marketmakers
    JWT_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:5173
    ```

4. **Seed the database**
    ```bash
    cd backend
    npm run seed
    ```

### Running the Application

```bash
# Terminal 1 — Backend
cd backend
npm start

# Terminal 2 — Frontend
cd frontend/myapp
npm run dev
```

Access the app at **http://localhost:5173**

## 🔐 Demo Accounts

Created by `npm run seed`. All passwords: `password123`

| Role | Name | Email |
|:-----|:-----|:------|
| **Admin** | Ishan Pandita | `admin@marketmakers.com` |
| **Contributor** | Priya Sharma | `priya@marketmakers.com` |
| **Contributor** | Rajesh Kapoor | `rajesh@marketmakers.com` |
| **Learner** | Arjun Mehta | `arjun@marketmakers.com` |
| **Learner** | Sneha Patel | `sneha@marketmakers.com` |

## 📡 API Endpoints

| Endpoint | Method | Description | Access |
|:---------|:-------|:------------|:-------|
| `/api/auth/register` | POST | Register user | Public |
| `/api/auth/login` | POST | Login | Public |
| `/api/auth/forgot-password` | POST | Send reset email | Public |
| `/api/auth/reset-password/:token` | POST | Reset password | Public |
| `/api/courses` | GET / POST | List / Create courses | Public / Contributor |
| `/api/modules` | GET / POST | List / Create modules | Public / Contributor |
| `/api/modules/:id` | GET | Module details | Protected |
| `/api/lessons/module/:id` | GET | Module lessons | Protected |
| `/api/lessons/:id` | GET | Lesson details | Protected |
| `/api/exams` | GET | List exams | Protected |
| `/api/exams/:id/attempt` | POST | Submit exam | Protected |
| `/api/progress` | POST | Mark lesson complete | Protected |
| `/api/users/contributors` | GET | List contributors | Public |
| `/api/users/contributors/:id` | GET | Contributor profile | Public |
| `/api/admin/pending-contributors` | GET | Pending applications | Admin |
| `/api/admin/update-status/:id` | PUT | Approve/reject user | Admin |

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 👨‍💻 Owner

**Ishan Pandita** — Full Stack Developer & Platform Owner

---

© 2026 MarketMakers. All Rights Reserved.
