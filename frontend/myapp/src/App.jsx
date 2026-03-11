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
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon-purple selection:text-white relative">
          {/* Global Ambient Glow */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
          </div>

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

                {/* Contributor-Only Routes */}
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

                {/* 404 Page - Reimagined */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
                      <div className="max-w-md animate-slideIn">
                        <div className="text-9xl font-black text-white/5 mb-[-2rem] select-none tracking-tighter">404</div>
                        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">PAGE NOT FOUND.</h1>
                        <p className="text-gray-500 font-bold mb-10 italic leading-relaxed">The page you are attempting to access has been removed or does not exist.</p>
                        <a href="/" className="px-10 py-4 bg-neon-purple text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-all inline-block">
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
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
