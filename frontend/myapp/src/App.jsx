// src/App.jsx - UPGRADED VERSION
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-mesh bg-fixed text-gray-800">
          <Navbar />
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

            {/* Protected Routes */}
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
              path="/modules"
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

            {/* Contributor-Only Routes */}
            <Route
              path="/create-module"
              element={
                <ProtectedRoute requiredRole="contributor">
                  <CreateModule />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-6">Page not found</p>
                    <a href="/" className="btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
