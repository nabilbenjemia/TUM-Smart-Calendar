import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    studentId: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate TUM email
    if (!formData.email.endsWith("@tum.de") && !formData.email.endsWith("@mytum.de")) {
      setError("Please use a valid TUM email address (@tum.de or @mytum.de)");
      return;
    }

    // Additional validation for sign up
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      if (!formData.firstName || !formData.lastName) {
        setError("Please provide your first and last name");
        return;
      }
    }

    try {
      // Call Java backend
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      
      // Prepare request body based on action
      const requestBody = isSignUp 
        ? {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            studentId: formData.studentId
          }
        : {
            email: formData.email,
            password: formData.password
          };
      
      console.log(`Attempting to connect to: ${endpoint}`);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        let errorMessage = 'Authentication failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON, try reading as text
          try {
            const errorText = await response.clone().text();
            console.error('Non-JSON error response:', errorText);
            errorMessage = errorText || `Server error: ${response.status}`;
          } catch (e2) {
            errorMessage = `Server error: ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login successful, received data:', data);
      
      onLogin(data.token, data.user);
      navigate("/calendar");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-6">
      <div className="max-w-md w-full">
        {/* TUM Logo and Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-1">
            <img
              src="/TUM_Logo.svg"
              alt="TUM Logo"
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-bold text-[#0065bd]">
              Smart Calendar
            </h1>
          </div>
          <p className="text-gray-500 text-xs mb-4">
            Your intelligent scheduling companion for TUM
          </p>
          <p className="text-gray-600 text-base">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-xs font-semibold text-gray-700 mb-1">
                    Student ID <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="03123456"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                TUM Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.name@tum.de"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isSignUp ? "Min. 8 characters" : "Enter your password"}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0065bd] focus:border-[#0065bd] transition"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0065bd] hover:bg-[#004a8f] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setFormData({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  firstName: "",
                  lastName: "",
                  studentId: ""
                });
              }}
              className="text-[#0065bd] hover:text-[#004a8f] font-medium text-xs transition"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-4">
          © 2026 N. Ben Jemia, Y. Bouchaala, O. Fahim
        </p>
      </div>
    </div>
  );
}

export default AuthPage;