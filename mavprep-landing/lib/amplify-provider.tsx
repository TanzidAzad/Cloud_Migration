'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
  ssr: true,
};

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Amplify.configure(amplifyConfig);
  }, []);

  return <>{children}</>;
}
