'use client';

import {
  confirmSignUp,
  getCurrentUser,
  signIn,
  signUp,
} from 'aws-amplify/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    checkIfAlreadyLoggedIn();
  }, []);

  const checkIfAlreadyLoggedIn = async () => {
    try {
      await getCurrentUser();
      // User is already logged in, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      // User not logged in, stay on login page
      console.log('User not logged in, showing login form');
    }
  };

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Confirmation code state
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn({
        username: loginForm.email,
        password: loginForm.password,
      });
      setSuccess('Login successful! Redirecting...');

      // Small delay to ensure session is established
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await signUp({
        username: signupForm.email,
        password: signupForm.password,
        options: {
          userAttributes: {
            email: signupForm.email,
            preferred_username: signupForm.username,
          },
        },
      });
      setConfirmationEmail(signupForm.email);
      setShowConfirmation(true);
      setSuccess(
        'Account created! Please check your email for a verification code.'
      );
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await confirmSignUp({
        username: confirmationEmail,
        confirmationCode: confirmationCode,
      });
      setSuccess('Email verified! You can now sign in.');
      setShowConfirmation(false);
      setShowSignup(false);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black flex'>
      {/* Left Side - MavPrep Branding */}
      <div className='hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-center justify-center'>
        {/* Animated neon background */}
        <div className='absolute inset-0'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* MavPrep Logo */}
        <div className='relative z-10 text-center'>
          <div className='flex items-center justify-center mb-6'>
            <span className='text-7xl font-bold text-gray-300 tracking-wide'>
              Mav
            </span>
            <span className='text-7xl font-bold text-white tracking-wide neon-text-glow'>
              Prep
            </span>
          </div>
          <p className='text-gray-400 text-xl max-w-md'>
            Your intelligent companion for academic success
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          {/* Back to Home Link */}
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to Home
          </Link>

          {!showSignup && !showConfirmation ? (
            /* Login Form */
            <form onSubmit={handleLogin}>
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-white mb-1 tracking-tight'>
                  Welcome Back
                </h2>
                <p className='text-gray-400 text-sm'>
                  Sign in with UTA email to continue to MavPrep
                </p>
              </div>

              {error && (
                <div className='mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg'>
                  <p className='text-red-300 text-sm'>{error}</p>
                </div>
              )}

              {success && (
                <div className='mb-4 p-3 bg-green-900/50 border border-green-600 rounded-lg'>
                  <p className='text-green-300 text-sm'>{success}</p>
                </div>
              )}

              <div className='space-y-3'>
                {/* Login Credentials Border */}
                <div className='p-4 border border-gray-700 rounded-xl bg-gray-900/50'>
                  {/* Username/Email Input */}
                  <div className='mb-3'>
                    <input
                      type='email'
                      id='username'
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Enter your UTA email (example@mavs.uta.edu)'
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <input
                      type='password'
                      id='password'
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Enter your password'
                      required
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className='flex justify-end'>
                  <Link
                    href='#'
                    className='text-xs text-primary hover:text-accent transition-colors'
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full px-4 py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-accent transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Sign Up Link */}
                <p className='text-center text-gray-400 text-xs mt-4'>
                  Don&apos;t have an account?{' '}
                  <button
                    type='button'
                    onClick={() => setShowSignup(true)}
                    className='text-primary hover:text-accent transition-colors font-medium'
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          ) : showConfirmation ? (
            /* Email Confirmation Form */
            <form onSubmit={handleConfirmSignup}>
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-white mb-1 tracking-tight'>
                  Verify Your Email
                </h2>
                <p className='text-gray-400 text-sm'>
                  Enter the verification code sent to {confirmationEmail}
                </p>
              </div>

              {error && (
                <div className='mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg'>
                  <p className='text-red-300 text-sm'>{error}</p>
                </div>
              )}

              {success && (
                <div className='mb-4 p-3 bg-green-900/50 border border-green-600 rounded-lg'>
                  <p className='text-green-300 text-sm'>{success}</p>
                </div>
              )}

              <div className='space-y-3'>
                <div className='p-4 border border-gray-700 rounded-xl bg-gray-900/50'>
                  <input
                    type='text'
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-center tracking-wider'
                    placeholder='Enter 6-digit code'
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full px-4 py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-accent transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>

                <p className='text-center text-gray-400 text-xs mt-4'>
                  Didn&apos;t receive a code?{' '}
                  <button
                    type='button'
                    onClick={() => setShowConfirmation(false)}
                    className='text-primary hover:text-accent transition-colors font-medium'
                  >
                    Go back
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup}>
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-white mb-1 tracking-tight'>
                  Create Account
                </h2>
                <p className='text-gray-400 text-sm'>
                  Sign up with UTA email to get started with MavPrep
                </p>
              </div>

              {error && (
                <div className='mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg'>
                  <p className='text-red-300 text-sm'>{error}</p>
                </div>
              )}

              {success && (
                <div className='mb-4 p-3 bg-green-900/50 border border-green-600 rounded-lg'>
                  <p className='text-green-300 text-sm'>{success}</p>
                </div>
              )}

              <div className='space-y-3'>
                {/* Signup Credentials Border */}
                <div className='p-4 border border-gray-700 rounded-xl bg-gray-900/50'>
                  {/* Username Input */}
                  <div className='mb-3'>
                    <input
                      type='text'
                      id='signup-username'
                      value={signupForm.username}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          username: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Choose a username'
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className='mb-3'>
                    <input
                      type='email'
                      id='signup-email'
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Enter your UTA email (example@mavs.uta.edu)'
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className='mb-3'>
                    <input
                      type='password'
                      id='signup-password'
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Create a password'
                      minLength={8}
                      required
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <input
                      type='password'
                      id='signup-confirm-password'
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors'
                      placeholder='Confirm your password'
                      required
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full px-4 py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-accent transition-all neon-glow mt-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Sign In Link */}
                <p className='text-center text-gray-400 text-xs mt-4'>
                  Already have an account?{' '}
                  <button
                    type='button'
                    onClick={() => setShowSignup(false)}
                    className='text-primary hover:text-accent transition-colors font-medium'
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
