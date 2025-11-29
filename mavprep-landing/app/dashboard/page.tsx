'use client';

import { fetchUserAttributes, getCurrentUser, signOut } from 'aws-amplify/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [userAttributes, setUserAttributes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const currentUser = await getCurrentUser();
      console.log('User found:', currentUser);

      const attributes = await fetchUserAttributes();
      console.log('User attributes:', attributes);

      setUser(currentUser);
      setUserAttributes(attributes);
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Only redirect if it's actually an auth error
      if (error instanceof Error && error.name === 'UserUnAuthenticatedError') {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      } else {
        // For other errors, retry after a delay
        setTimeout(() => {
          checkAuth();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className='min-h-screen bg-black'>
      {/* Header */}
      <header className='bg-gray-900 border-b border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <Link href='/' className='flex items-center'>
                <span className='text-2xl font-bold text-gray-300'>Mav</span>
                <span className='text-2xl font-bold text-primary neon-text-glow'>
                  Prep
                </span>
              </Link>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-300'>
                Welcome, {userAttributes?.preferred_username || user.username}!
              </span>
              <button
                onClick={handleSignOut}
                className='bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-white mb-4'>
            Welcome to MavPrep Dashboard
          </h1>
          <p className='text-gray-400 mb-8'>
            You&apos;re successfully authenticated with AWS Cognito!
          </p>

          <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md mx-auto'>
            <h2 className='text-xl font-semibold text-white mb-4'>
              User Information
            </h2>
            <div className='space-y-2 text-left'>
              <p className='text-gray-300'>
                <span className='font-medium'>Username:</span>{' '}
                {userAttributes?.preferred_username || 'Not set'}
              </p>
              <p className='text-gray-300'>
                <span className='font-medium'>Email:</span>{' '}
                {userAttributes?.email || user.username}
              </p>
              <p className='text-gray-300'>
                <span className='font-medium'>User ID:</span> {user.userId}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
