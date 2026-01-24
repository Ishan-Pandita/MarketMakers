# MarketMakers 📈

**Master the Markets Like a Pro.**
An elite trading education platform connecting learners with verified experts.
**Owned & Operated by Ishan Pandita**.

![Platform Preview](frontend/myapp/public/vite.svg)

## 🚀 Overview

MarketMakers is a comprehensive Learning Management System (LMS) designed specifically for financial education. It features a premium, contributor-centric marketplace where verified experts can create and sell their own trading modules, and learners can master the markets through structured curriculum.

## ✨ Key Features

-   **Premium UI/UX**:
    -   Immersive Mesh Gradients and Glassmorphism design system.
    -   Fully responsive, mobile-first layout.
    -   Smooth animations and interactive elements.
-   **Contributor Marketplace**:
    -   **Application Workflow**: Users apply -> Admins approve.
    -   **Creator Studio**: Contributors create Modules and Lessons using a rich editor.
    -   **Public Profiles**: Dedicated portfolio pages for every contributor.
-   **Student Learning Portal**:
    -   Progress tracking for every lesson.
    -   Certification exams with automatic grading.
    -   Dynamic "Featured Curriculum" on the home page.
-   **Administrative Control**:
    -   Role-based access control (RBAC).
    -   Admin dashboard for user management.

## 📂 Project Structure

```bash
MarketMakers/
├── backend/
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── middleware/
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   ├── authMiddleware.js   # JWT protection
│   │   ├── checkContributor.js # Role verification
│   │   ├── errorMiddleware.js  # Global error handler
│   │   └── validators.js       # Input validation rules
│   ├── models/
│   │   ├── Exam.js             # Exam schema
│   │   ├── ExamAttempt.js      # Student attempts
│   │   ├── Lesson.js           # Module lessons
│   │   ├── Module.js           # Course modules
│   │   ├── PasswordReset.js    # Reset tokens
│   │   ├── Progress.js         # Student progress
│   │   ├── Suggestion.js       # User feedback
│   │   └── User.js             # User accounts
│   ├── routes/
│   │   ├── adminRoutes.js      # Admin management
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── examRoutes.js       # Exam Logic
│   │   ├── lessonRoutes.js     # Lesson CRUD
│   │   ├── moduleRoutes.js     # Module CRUD
│   │   ├── progressRoutes.js   # Tracking logic
│   │   ├── searchRoutes.js     # Global search
│   │   ├── suggestionRoutes.js # Feedback handling
│   │   └── userRoutes.js       # Public profiles
│   ├── utils/
│   │   ├── emailService.js     # Email sender
│   │   └── tokenGenerator.js   # Secure tokens
│   ├── index.js                # Server entry point
│   └── resetAdmin.js           # Admin seeding script
│
└── frontend/myapp/
    ├── public/
    └── src/
        ├── components/
        │   ├── ErrorBoundary.jsx   # Crash handler
        │   ├── ErrorMessage.jsx    # Alert UI
        │   ├── Footer.jsx          # Premium Footer
        │   ├── LoadingSpinner.jsx  # Loading state
        │   ├── Navbar.jsx          # Glassmorphism Nav
        │   ├── Pagination.jsx      # List navigation
        │   ├── ProgressBar.jsx     # Visual progress
        │   ├── ProtectedRoute.jsx  # Route guard
        │   └── SuccessMessage.jsx  # Success feedback
        ├── context/
        │   └── AuthContext.jsx     # Auth Provider
        ├── pages/
        │   ├── ContributorProfile.jsx # Public Portfolio
        │   ├── Contributors.jsx    # Expert Directory
        │   ├── CreateModule.jsx    # Creator Studio
        │   ├── Dashboard.jsx       # Student Hub
        │   ├── ExamResult.jsx      # Scorecard
        │   ├── Exams.jsx           # Exam List
        │   ├── ForgotPassword.jsx  # Recovery
        │   ├── Home.jsx            # Landing Page
        │   ├── Lesson.jsx          # Lesson Player
        │   ├── Lessons.jsx         # Module Content
        │   ├── Login.jsx           # Sign In
        │   ├── Modules.jsx         # Course Catalog
        │   ├── Profile.jsx         # User Settings
        │   ├── Register.jsx        # Sign Up
        │   ├── ResetPassword.jsx   # New Password
        │   └── TakeExam.jsx        # Exam Interface
        ├── services/
        │   └── api.js              # Axios Config
        ├── App.jsx                 # Main Router
        └── index.css               # Global Styles
```

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion.
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
    git clone https://github.com/ishanpandita/marketmakers.git
    cd marketmakers
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

## 🔐 Administrative Access

> **Note:** Public registration for Admins is disabled for security.

To initialize the **Master Admin** account, run the included seed script:

```bash
cd backend
node resetAdmin.js
```

**Credentials:**
-   **Email:** `ishanpandita@marketmakers.com`
-   **Password:** `Marketmakers.123`

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
