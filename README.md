<div align="center">

# 📈 MarketMakers

### _Your Gateway to Trading Excellence_

A comprehensive full-stack trading education platform that transforms learners into certified contributors through an innovative exam-based progression system.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**MarketMakers** is a modern learning management system specifically designed for stock market education. What sets it apart is the unique **dual-role progression system** where learners can become content contributors by passing a certification exam, creating a self-sustaining educational ecosystem.

### Why MarketMakers?

- 🎓 **Structured Learning Path** - 6 comprehensive modules covering basics to advanced strategies
- 📝 **Certification System** - Pass exams to unlock contributor privileges
- 📊 **Progress Tracking** - Monitor your learning journey with detailed analytics
- 🎥 **Video Integration** - Curated YouTube tutorials for each lesson
- 👥 **Community-Driven** - Certified contributors create and manage content
- 🔐 **Secure & Scalable** - JWT authentication, role-based access, pagination

---

## ✨ Features

### For Learners

<table>
<tr>
<td width="50%">

#### 📚 **Comprehensive Curriculum**

- 6 structured modules
- 23+ detailed lessons
- Real-world trading concepts
- Beginner to advanced content

</td>
<td width="50%">

#### 🎯 **Interactive Learning**

- Video tutorials
- Progress tracking
- Completion certificates
- Personalized dashboard

</td>
</tr>
<tr>
<td width="50%">

#### 📝 **Certification Exams**

- Timed assessments
- Multiple-choice questions
- Instant results
- Auto-role upgrade on pass

</td>
<td width="50%">

#### 💬 **Engagement Tools**

- Lesson suggestions
- Community feedback
- Discussion support
- Real-time updates

</td>
</tr>
</table>

### For Contributors

- ✍️ **Content Creation** - Create and manage modules and lessons
- 🛠️ **Full CRUD Access** - Update and delete educational content
- 🎖️ **Verified Status** - Earned through certification exam (80%+)
- 📈 **Impact Tracking** - See how your content helps learners

### Technical Features

- 🔒 **Secure Authentication** - JWT-based with password reset
- 📄 **Pagination** - Efficient data loading for large datasets
- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Error Handling** - Graceful error boundaries and user feedback
- 🔄 **Real-time Updates** - Live exam timer and progress tracking
- 📧 **Email Integration** - Password reset via email (optional)

---

## 🎬 Demo

### Screenshots

> **Note:** Add your screenshots here after running the application

```
📸 Coming Soon - Add screenshots of:
- Landing page
- Dashboard
- Module listing
- Lesson view
- Exam interface
- Results page
```

### Live Demo

🔗 **[View Live Demo](#)** _(Deploy and add link here)_

### Test Credentials

```
Learner Account:
Email: learner@example.com
Password: password123

Contributor Account:
Email: contributor@example.com
Password: password123
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/MarketMakers.git
cd MarketMakers
```

2. **Backend Setup**

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with sample data
node seed.js

# Start the server
npm run dev
```

3. **Frontend Setup**

```bash
cd ../frontend/myapp
npm install

# Start the development server
npm run dev
```

4. **Access the Application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                   |
| ------------------- | ------------------------- |
| **React 18**        | UI framework with hooks   |
| **React Router v6** | Client-side routing       |
| **Axios**           | HTTP client               |
| **Tailwind CSS**    | Utility-first styling     |
| **Vite**            | Build tool and dev server |

### Backend

| Technology     | Purpose               |
| -------------- | --------------------- |
| **Node.js**    | Runtime environment   |
| **Express.js** | Web framework         |
| **MongoDB**    | NoSQL database        |
| **Mongoose**   | ODM for MongoDB       |
| **JWT**        | Authentication tokens |
| **bcrypt**     | Password hashing      |
| **Nodemailer** | Email service         |

---

## 📁 Project Structure

```
MarketMakers/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── checkContributor.js   # Role check
│   │   └── validators.js         # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Module.js            # Module schema
│   │   ├── Lesson.js            # Lesson schema
│   │   ├── Progress.js          # Progress tracking
│   │   ├── Exam.js              # Exam schema
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── moduleRoutes.js      # Module CRUD
│   │   ├── lessonRoutes.js      # Lesson CRUD
│   │   ├── examRoutes.js        # Exam system
│   │   └── ...
│   ├── utils/
│   │   ├── pagination.js        # Pagination helper
│   │   ├── emailService.js      # Email utilities
│   │   └── tokenGenerator.js    # Token generation
│   ├── seed.js                  # Database seeder
│   ├── index.js                 # Server entry
│   └── package.json
│
└── frontend/myapp/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── ErrorBoundary.jsx
    │   │   └── ...
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Exams.jsx
    │   │   ├── TakeExam.jsx
    │   │   └── ...
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 📚 API Documentation

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

#### Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

### Modules

```http
GET    /api/modules?page=1&limit=10     # Get all modules (paginated)
GET    /api/modules/:id                 # Get single module
POST   /api/modules                     # Create module (contributor)
PUT    /api/modules/:id                 # Update module (contributor)
DELETE /api/modules/:id                 # Delete module (contributor)
```

### Lessons

```http
GET    /api/lessons/module/:moduleId?page=1&limit=10  # Get lessons by module
GET    /api/lessons/:id                               # Get single lesson
POST   /api/lessons                                   # Create lesson (contributor)
PUT    /api/lessons/:id                               # Update lesson (contributor)
DELETE /api/lessons/:id                               # Delete lesson (contributor)
```

### Exams

```http
GET    /api/exams                       # Get all active exams
GET    /api/exams/:id                   # Get single exam
POST   /api/exams/:id/attempt           # Submit exam attempt
GET    /api/exams/attempts/me           # Get user's exam history
GET    /api/exams/attempt/:id           # Get specific attempt
```

### Progress

```http
POST   /api/progress                    # Mark lesson as completed
GET    /api/progress/me                 # Get user's progress
GET    /api/progress/stats              # Get progress statistics
GET    /api/progress/check/:lessonId    # Check if lesson completed
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/marketmakers

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@marketmakers.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## 🎓 Learning Modules

The platform includes 6 comprehensive modules:

1. **Introduction to Stock Market** - Fundamentals and market mechanics
2. **Understanding Market Basics** - Orders, spreads, and trading sessions
3. **Technical Analysis Fundamentals** - Charts, indicators, and patterns
4. **Fundamental Analysis** - Financial statements and ratios
5. **Risk Management & Psychology** - Position sizing and trading discipline
6. **Trading Strategies** - Day trading, swing trading, and investing

Each module contains multiple lessons with:

- Detailed explanations (200-300 words)
- Curated YouTube video tutorials
- Real-world examples
- Progressive difficulty

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend/myapp
npm test
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Browse modules with pagination
- [ ] View lesson content
- [ ] Take certification exam
- [ ] Pass exam and verify role upgrade
- [ ] Update profile information
- [ ] Change password
- [ ] Request password reset
- [ ] Create content as contributor

---

## 🚢 Deployment

### Backend (Railway/Render/Heroku)

1. Create a new project
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from `backend` directory

### Frontend (Vercel/Netlify)

1. Create a new project
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=your-backend-url`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Trading education community for inspiration
- Open source contributors
- MongoDB, Express, React, Node.js communities
- YouTube creators for educational content
- All beta testers and early users

---

## 📞 Support

If you have any questions or need help, please:

- 📧 Email: support@marketmakers.com
- 💬 Open an [Issue](https://github.com/yourusername/MarketMakers/issues)
- 📖 Check the [Documentation](#-api-documentation)

---

## 🗺️ Roadmap

### Phase 1 (Completed ✅)

- [x] User authentication and authorization
- [x] Module and lesson management
- [x] Progress tracking
- [x] Certification exam system
- [x] Profile management
- [x] Password reset flow

### Phase 2 (Planned)

- [ ] Rich text editor for content creation
- [ ] Image upload for modules
- [ ] Discussion forums
- [ ] Quiz questions within lessons
- [ ] Certificates on completion
- [ ] Leaderboards

### Phase 3 (Future)

- [ ] Live trading simulations
- [ ] Real-time market data integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered learning recommendations
- [ ] Multi-language support

---

## 📊 Project Stats

- **Total Lines of Code:** ~2,500+
- **Modules:** 6
- **Lessons:** 23+
- **API Endpoints:** 30+
- **Components:** 15+
- **Development Time:** 2 weeks

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ for aspiring traders**

[⬆ Back to Top](#-marketmakers)
