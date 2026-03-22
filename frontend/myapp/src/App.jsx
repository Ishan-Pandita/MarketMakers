// src/App.jsx — MarketMakers Dual Theme
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Exams from "./pages/Exams";
import TakeExam from "./pages/TakeExam";
import ExamResult from "./pages/ExamResult";
import CreateModule from "./pages/CreateModule";
import Contributors from "./pages/Contributors";
import ContributorProfile from "./pages/ContributorProfile";
import StaticPage from "./pages/StaticPage";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";

// Financial Platform Pages
import Portfolio from "./pages/Portfolio";
import PortfolioDashboard from "./pages/PortfolioDashboard";
import NewsSimplifier from "./pages/NewsSimplifier";
import Chatbot from "./pages/Chatbot";
import Simulator from "./pages/Simulator";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen font-body relative transition-colors duration-300 ${
      isDark
        ? 'bg-dark-bg text-gray-100 selection:bg-cyan-900 selection:text-cyan-200'
        : 'bg-surface text-slate-heading selection:bg-indigo-100 selection:text-indigo-700'
    }`}>
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Community Routes */}
            <Route path="/community" element={<Contributors />} />
            <Route path="/profile/:id" element={<ContributorProfile />} />

            {/* Static Pages */}
            <Route path="/about" element={<StaticPage title="About Us" content="MarketMakers is the premier destination for aspiring traders. Founded by Ishan Pandita, our mission is to democratize financial education through community-driven learning." />} />
            <Route path="/careers" element={<StaticPage title="Careers" content="Join our team! We are looking for passionate individuals to help us build the future of trading education." />} />
            <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
            <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
            <Route path="/cookies" element={<StaticPage title="Cookie Policy" />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/course/:courseId/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/module/:id" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/lesson/:id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/exams/:id/take" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
            <Route path="/exams/:id/result" element={<ProtectedRoute><ExamResult /></ProtectedRoute>} />

            {/* Financial Platform Routes */}
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/portfolio/dashboard" element={<ProtectedRoute><PortfolioDashboard /></ProtectedRoute>} />
            <Route path="/news-simplifier" element={<ProtectedRoute><NewsSimplifier /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />

            {/* Contributor-Only Routes */}
            <Route path="/create-course" element={<ProtectedRoute requiredRole="contributor"><CreateCourse /></ProtectedRoute>} />
            <Route path="/create-module" element={<ProtectedRoute requiredRole="contributor"><CreateModule /></ProtectedRoute>} />
            <Route path="/course/:courseId/create-module" element={<ProtectedRoute requiredRole="contributor"><CreateModule /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
                <div className="max-w-md animate-fadeIn">
                  <div className="text-9xl font-extrabold text-slate-border dark:text-dark-border mb-[-1rem] select-none tracking-tighter">404</div>
                  <h1 className="text-3xl font-extrabold text-slate-heading dark:text-gray-100 mb-4 tracking-tight">Page Not Found</h1>
                  <p className="text-slate-body dark:text-gray-400 mb-8 leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>
                  <a href="/" className="btn-primary inline-block">
                    Return Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: isDark ? '#1B1F2C' : '#1e293b',
          color: '#f1f5f9',
          fontSize: '14px',
          fontWeight: '500',
          border: isDark ? '1px solid rgba(60,73,76,0.3)' : 'none',
        },
        success: { iconTheme: { primary: isDark ? '#34D399' : '#22c55e', secondary: '#f1f5f9' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
      }}
    />
  );
}

export default App;
