// src/pages/Register.jsx - NEW FILE
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import LoadingSpinner from "../components/LoadingSpinner";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.experience,
      formData.reason
    );

    setLoading(false);

    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">
            Start your trading education journey
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <ErrorMessage message={error} onClose={() => setError("")} />
            )}
            {success && <SuccessMessage message={success} />}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Role Selection Cards */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({ target: { name: "role", value: "learner" } })
                  }
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${formData.role === "learner"
                      ? "border-primary-600 bg-primary-50 ring-2 ring-primary-100"
                      : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
                    }`}
                >
                  <div className="text-2xl mb-2">👨‍🎓</div>
                  <h3
                    className={`font-bold ${formData.role === "learner"
                        ? "text-primary-900"
                        : "text-gray-900"
                      }`}
                  >
                    Learner
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Access courses and take exams
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: "role", value: "contributor" },
                    })
                  }
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${formData.role === "contributor"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <h3
                    className={`font-bold ${formData.role === "contributor"
                        ? "text-blue-900"
                        : "text-gray-900"
                      }`}
                  >
                    Contributor
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Share knowledge & create modules
                  </p>
                </button>
              </div>

              {formData.role === "contributor" && (
                <div className="mt-3 text-sm bg-blue-50 text-blue-800 p-3 rounded-lg flex items-start gap-2 animate-fadeIn">
                  <span className="text-lg">ℹ️</span>
                  <p>
                    Contributor accounts require <strong>admin approval</strong>.
                    You will be notified once your application is reviewed.
                  </p>
                </div>
              )}
            </div>

            {/* Contributor Extra Fields */}
            {formData.role === "contributor" && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-slideDown">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Contributor Application
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleChange}
                    className="input-field bg-white"
                    placeholder="e.g. 5+ years in Forex Trading"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to contribute?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason || ""}
                    onChange={handleChange}
                    className="input-field bg-white min-h-[100px]"
                    placeholder="Tell us about your expertise and what you plan to teach..."
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>
                  Sign Up as{" "}
                  {formData.role === "learner" ? "Learner" : "Contributor"}
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
