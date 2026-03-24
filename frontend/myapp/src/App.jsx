import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OnboardingModal from "./components/OnboardingModal";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./pages/Chatbot";
import ContributorProfile from "./pages/ContributorProfile";
import Contributors from "./pages/Contributors";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import CreateModule from "./pages/CreateModule";
import Dashboard from "./pages/Dashboard";
import ExamResult from "./pages/ExamResult";
import Exams from "./pages/Exams";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Lessons from "./pages/Lessons";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import StaticPage from "./pages/StaticPage";
import TakeExam from "./pages/TakeExam";
import Watchlist from "./pages/Watchlist";

function AppContent() {
  const { isDark } = useTheme();
  const { isAuthenticated, loading, user } = useAuth();

  return (
    <div
      className={`relative min-h-screen font-body transition-colors duration-300 ${
        isDark
          ? "bg-dark-bg text-gray-100 selection:bg-cyan-900 selection:text-cyan-200"
          : "bg-surface text-slate-heading selection:bg-indigo-100 selection:text-indigo-700"
      }`}
    >
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/community" element={<Contributors />} />
            <Route path="/profile/:id" element={<ContributorProfile />} />

            <Route
              path="/about"
              element={
                <StaticPage
                  title="About Us"
                  content="MarketMakers is the premier destination for aspiring traders. Founded by Ishan Pandita, our mission is to democratize financial education through community-driven learning."
                />
              }
            />
            <Route
              path="/careers"
              element={
                <StaticPage
                  title="Careers"
                  content="Join our team! We are looking for passionate individuals to help us build the future of trading education."
                />
              }
            />
            <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
            <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
            <Route path="/cookies" element={<StaticPage title="Cookie Policy" />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/modules"
              element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/modules"
              element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/module/:id"
              element={
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lesson/:id"
              element={
                <ProtectedRoute>
                  <Lesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <Exams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams/:id/take"
              element={
                <ProtectedRoute>
                  <TakeExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams/:id/result"
              element={
                <ProtectedRoute>
                  <ExamResult />
                </ProtectedRoute>
              }
            />

            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-course"
              element={
                <ProtectedRoute requiredRole="contributor">
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-module"
              element={
                <ProtectedRoute requiredRole="contributor">
                  <CreateModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/create-module"
              element={
                <ProtectedRoute requiredRole="contributor">
                  <CreateModule />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/portfolio/dashboard" element={<Navigate to="/portfolio" replace />} />
            <Route path="/simulator" element={<Navigate to="/portfolio" replace />} />

            <Route
              path="*"
              element={
                <div className="flex min-h-[80vh] items-center justify-center p-6 text-center">
                  <div className="max-w-md animate-slideIn">
                    <div className="mb-[-1rem] select-none text-9xl font-extrabold tracking-tighter text-slate-border dark:text-dark-border">
                      404
                    </div>
                    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-heading dark:text-gray-100">
                      Page Not Found
                    </h1>
                    <p className="mb-8 leading-relaxed text-slate-body dark:text-gray-400">
                      The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <a href="/" className="btn-primary inline-block">
                      Return Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>

      {isAuthenticated && !loading && user && !user.onboardingComplete && <OnboardingModal />}
    </div>
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
          borderRadius: "12px",
          background: isDark ? "#1B1F2C" : "#1e293b",
          color: "#f1f5f9",
          fontSize: "14px",
          fontWeight: "500",
          border: isDark ? "1px solid rgba(60,73,76,0.3)" : "none",
        },
        success: {
          iconTheme: {
            primary: isDark ? "#34D399" : "#22c55e",
            secondary: "#f1f5f9",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#f1f5f9",
          },
        },
      }}
    />
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

export default App;
