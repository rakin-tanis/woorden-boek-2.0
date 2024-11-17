'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ClientAuthProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectToLogin?: boolean;
}

export default function ClientAuth({
  children,
  allowedRoles,
  redirectToLogin = true
}: ClientAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const userRole = session?.user?.role;
    const hasRequiredRole = userRole && allowedRoles.includes(userRole);

    if (!hasRequiredRole && redirectToLogin) {
      const currentPath = window.location.pathname;
      const encodedCallbackUrl = encodeURIComponent(currentPath);
      router.push(`/auth/signIn?callbackUrl=${encodedCallbackUrl}`);
    }
  }, [session, status, allowedRoles, redirectToLogin, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    if (redirectToLogin) {
      return <div>You have to sign in to display this page.</div>
    }
    return
  }

  const userRole = session?.user?.role;
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    if (redirectToLogin) {
      return <div>You don not have permission to display this page! You are redirecting to the Home page.</div>
    }
    return
  }

  return <>{children}</>;
}