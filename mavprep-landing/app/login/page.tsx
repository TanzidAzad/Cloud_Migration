"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - MavPrep Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-center justify-center">
        {/* Animated neon background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* MavPrep Logo */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-7xl font-bold text-gray-300 tracking-wide">
              Mav
            </span>
            <span className="text-7xl font-bold text-white tracking-wide neon-text-glow">
              Prep
            </span>
          </div>
          <p className="text-gray-400 text-xl max-w-md">
            Your intelligent companion for academic success
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          {!showSignup ? (
            /* Login Form */
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign in with UTA email to continue to MavPrep
                </p>
              </div>

              <div className="space-y-3">
                {/* Login Credentials Border */}
                <div className="p-4 border border-gray-700 rounded-xl bg-gray-900/50">
                  {/* Username/Email Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      id="username"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your UTA email (example@mavs.uta.edu)"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-xs text-primary hover:text-accent transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button className="w-full px-4 py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-accent transition-all neon-glow">
                  Sign In
                </button>


                {/* Sign Up Link */}
                <p className="text-center text-gray-400 text-xs mt-4">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setShowSignup(true)}
                    className="text-primary hover:text-accent transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  Create Account
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign up with UTA email to get started with MavPrep
                </p>
              </div>

              <div className="space-y-3">
                {/* Signup Credentials Border */}
                <div className="p-4 border border-gray-700 rounded-xl bg-gray-900/50">
                  {/* Username Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      id="signup-username"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Choose a username"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="mb-3">
                    <input
                      type="email"
                      id="signup-email"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter your UTA email (example@mavs.uta.edu)"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <input
                      type="password"
                      id="signup-password"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Create a password"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <input
                      type="password"
                      id="signup-confirm-password"
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <button className="w-full px-4 py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-accent transition-all neon-glow mt-2">
                  Create Account
                </button>
                {/* Sign In Link */}
                <p className="text-center text-gray-400 text-xs mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowSignup(false)}
                    className="text-primary hover:text-accent transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
