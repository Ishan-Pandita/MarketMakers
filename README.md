# MarketMakers 📈

**Master the Markets Like a Pro.**
An elite trading education platform connecting learners with verified experts.
**Owned & Operated by Ishan Pandita**.

![Platform Preview](frontend/myapp/public/vite.svg)

## 🚀 Overview

MarketMakers is a comprehensive Learning Management System (LMS) designed specifically for financial education. It features a premium, contributor-centric marketplace where verified experts can create and sell their own trading modules, and learners can master the markets through structured curriculum.

## ✨ Key Features

-   **Premium UI/UX**:
    -   Immersive **Light Airy Mesh Gradients** and refined Glassmorphism design system.
    -   **SVG Gradient Brand Identity** — Reusable Logo component with 4 variants (icon, abbreviated, full, stacked) and a custom lightning bolt with blue→purple→green gradient.
    -   Custom **Inter Typography** for a premium, modern feel.
    -   Enhanced **Glassmorphism Mobile Navigation** with backdrop blur effects.
    -   Fully responsive, mobile-first layout with smooth fadeIn animations.
-   **Structured Education**:
    -   **3 Professional Courses**: Stock Market Mastery, Forex Trading Essentials, and Crypto Fundamentals.
    -   **Deep Curriculum**: ~18 modules and ~57 detailed lessons covering technical/fundamental analysis and risk management.
-   **Contributor Marketplace**:
    -   **Application Workflow**: Users apply -> Admins approve.
    -   **Creator Studio**: Contributors create Modules and Lessons using a rich editor.
    -   **Public Profiles**: Dedicated portfolio pages for every contributor.
-   **Student Learning Portal**:
    -   Progress tracking for every lesson.
    -   Certification exams with automatic grading and passing criteria.
    -   Dynamic "Featured Curriculum" on the home page.
-   **Administrative Control**:
    -   Role-based access control (RBAC).
    -   Admin dashboard for user management and contributor approval.

## 📂 Project Structure

```bash
MarketMakers/
├── backend/
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── middleware/
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   ├── authMiddleware.js   # JWT protection
│   │   ├── checkAdmin.js       # Administrative check
│   │   ├── checkContributor.js # Role verification
│   │   ├── errorMiddleware.js  # Global error handler
│   │   └── validators.js       # Input validation rules
│   ├── models/
│   │   ├── Course.js           # Course schema
│   │   ├── Exam.js             # Exam schema
│   │   ├── ExamAttempt.js      # Student attempts
│   │   ├── Lesson.js           # Module lessons
│   │   ├── Module.js           # Scoped Modules
│   │   ├── PasswordReset.js    # Reset tokens
│   │   ├── Progress.js         # Student progress
│   │   ├── Suggestion.js       # User feedback
│   │   └── User.js             # User accounts
│   ├── routes/
│   │   ├── adminRoutes.js      # Admin management
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── courseRoutes.js     # Course endpoints
│   │   ├── examRoutes.js       # Exam Logic
│   │   ├── lessonRoutes.js     # Lesson CRUD
│   │   ├── moduleRoutes.js     # Scoped Module CRUD
│   │   ├── progressRoutes.js   # Tracking logic
│   │   ├── searchRoutes.js     # Global search
│   │   ├── suggestionRoutes.js # Feedback handling
│   │   └── userRoutes.js       # Public profiles
│   ├── scripts/
│   │   ├── resetAdmin.js       # Admin reset script
│   │   ├── seed.js             # Database seeder
│   │   └── seedAdmin.js        # Admin seeder
│   ├── tests/
│   │   ├── auth.test.js        # Auth integration tests
│   │   ├── courses.test.js     # Course integration tests
│   │   ├── health.test.js      # Health check tests
│   │   └── setup.js            # Test configuration
│   ├── utils/
│   │   ├── emailService.js     # Email sender
│   │   └── tokenGenerator.js   # Secure tokens
│   ├── app.js                  # Express app setup
│   └── index.js                # Server entry point
│
└── frontend/myapp/
    ├── public/
    └── src/
        ├── components/
        │   ├── ErrorBoundary.jsx   # Crash handler
        │   ├── ErrorMessage.jsx    # Alert UI
        │   ├── Footer.jsx          # Premium Footer
        │   ├── LoadingSpinner.jsx  # Loading state
        │   ├── Logo.jsx            # SVG Gradient Brand Logo
        │   ├── Navbar.jsx          # Glassmorphism Nav
        │   ├── Pagination.jsx      # List navigation
        │   ├── ProgressBar.jsx     # Visual progress
        │   ├── ProtectedRoute.jsx  # Route guard
        │   └── SuccessMessage.jsx  # Success feedback
        ├── context/
        │   └── AuthContext.jsx     # Auth Provider
        ├── pages/
        │   ├── ContributorProfile.jsx # AI Profile
        │   ├── Contributors.jsx    # Mentors
        │   ├── Courses.jsx         # Course Explorer
        │   ├── CreateCourse.jsx    # Course Creator
        │   ├── CreateModule.jsx    # Work bench
        │   ├── Dashboard.jsx       # Student Hub
        │   ├── ExamResult.jsx      # Performance
        │   ├── Exams.jsx           # Assessment
        │   ├── ForgotPassword.jsx  # Recovery
        │   ├── Home.jsx            # Entry Point
        │   ├── Lesson.jsx          # Media Player
        │   ├── Lessons.jsx         # Curriculum
        │   ├── Login.jsx           # Gateway
        │   ├── Modules.jsx         # Course Content
        │   ├── Profile.jsx         # Social Identity
        │   ├── Register.jsx        # Join Us
        │   ├── ResetPassword.jsx   # Reset Room
        │   └── TakeExam.jsx        # Exam Hub
        ├── services/
        │   └── api.js              # Axios Config
        ├── App.jsx                 # Main Router
        └── index.css               # Global Styles
```

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, Tailwind CSS, Google Fonts (Inter).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB, Mongoose.
-   **Authentication**: JWT, bcryptjs.
-   **Tools**: Postman, Git.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14+)
-   MongoDB (Running instance or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ishan-Pandita/MarketMakers
    cd MarketMakers
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend/myapp
    npm install
    ```

4.  **Environment Setup**
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/marketmakers
    JWT_SECRET=your_super_secret_key
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd backend
    npm start
    ```

2.  **Start the Frontend Client**
    ```bash
    cd frontend/myapp
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

## 🔐 Demo Accounts (Deployment Ready)

The following accounts are created by the `npm run seed` command. All accounts use the password: `password123`.

| Role | Name | Email | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | Ishan Pandita | `admin@marketmakers.com` | Full platform management, user/contributor control. |
| **Contributor** | Priya Sharma | `priya@marketmakers.com` | Create courses, modules, and lessons. (8+ yrs exp) |
| **Contributor** | Rajesh Kapoor | `rajesh@marketmakers.com` | Create courses, modules, and lessons. (6+ yrs exp) |
| **Learner** | Arjun Mehta | `arjun@marketmakers.com` | Access courses, track progress, take certification exams. |
| **Learner** | Sneha Patel | `sneha@marketmakers.com` | Access courses, track progress, take certification exams. |

> **IMPORTANT:** Always run the seed command below to initialize the database with professional trading content.

> **Note:** Run the seed command below to ensure these users exist in your local environment.

## 🚀 Setup & Initialization

To initialize the platform with the full course structure and demo users:

```bash
cd backend
npm run seed
```

## � API Documentation

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login user | Public |
| **Modules** | | | |
| `/api/modules` | GET | List all/featured modules | Public |
| `/api/modules` | POST | Create new module | Contributor |
| `/api/modules/:id` | GET | Get module details | Protected |
| **Users** | | | |
| `/api/users/contributors` | GET | List public contributors | Public |
| `/api/users/contributors/:id` | GET | Get contributor profile | Public |
| **Admin** | | | |
| `/api/admin/pending-contributors` | GET | List pending applications | Admin |
| `/api/admin/update-status/:id` | PUT | Approve/Reject user | Admin |

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 👨‍💻 Owner

**Ishan Pandita**
*Full Stack Developer & Platform Owner*

---

© 2026 MarketMakers. All Rights Reserved.
