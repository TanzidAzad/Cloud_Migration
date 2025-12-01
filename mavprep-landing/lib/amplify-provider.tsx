'use client';

import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const region = process.env.NEXT_PUBLIC_AWS_REGION;

const isAuthConfigured = userPoolId && userPoolClientId && region;

const amplifyConfig = isAuthConfigured
  ? {
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId,
          region,
          signUpVerificationMethod: 'code' as const,
          loginWith: {
            email: true,
          },
        },
      },
      ssr: true,
    }
  : null;

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (amplifyConfig) {
      Amplify.configure(amplifyConfig);
      setConfigured(true);
    } else {
      console.warn(
        'AWS Cognito not configured. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID, NEXT_PUBLIC_COGNITO_CLIENT_ID, and NEXT_PUBLIC_AWS_REGION in .env.local'
      );
      setConfigured(true); // Allow app to render without auth
    }
  }, []);

  return <>{children}</>;
}

// Export helper to check if auth is available
export function isAuthAvailable() {
  return isAuthConfigured;
}
