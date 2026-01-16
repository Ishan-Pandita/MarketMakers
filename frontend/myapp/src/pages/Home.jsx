// src/pages/Home.jsx - UPGRADED VERSION
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">MarketMakers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            An evolution for stock and trading beginners. Learn from verified
            experts and master the markets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link to="/modules" className="btn-primary px-8 py-3 text-lg">
                  Start Learning →
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-secondary px-8 py-3 text-lg"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-8 py-3 text-lg">
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3 text-lg">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Structured Learning
            </h3>
            <p className="text-gray-600">
              Complete core curriculum covering all trading fundamentals
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verified Contributors
            </h3>
            <p className="text-gray-600">
              Learn from experts who passed our comprehensive certification exam
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and
              certificates
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">
                Create your free account as a learner
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Learn</h4>
              <p className="text-gray-600 text-sm">
                Complete modules, take quizzes, earn certificates
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Take Exam</h4>
              <p className="text-gray-600 text-sm">
                Pass the contributor exam (80%+ score)
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Contribute</h4>
              <p className="text-gray-600 text-sm">
                Create content and teach others
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600 mt-2">Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600 mt-2">Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600 mt-2">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600 mt-2">Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
