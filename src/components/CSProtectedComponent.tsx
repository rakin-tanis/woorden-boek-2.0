'use client';

import { checkPermission } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ClientAuthProps {
  children: React.ReactNode;
  allowedPermissions: { action: string, resource: string }[];
  redirectToLogin?: boolean;
}

export default function ClientAuth({
  children,
  allowedPermissions,
  redirectToLogin = true
}: ClientAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) return

    const hasRequiredRole = allowedPermissions
      ?.some(p => checkPermission(session.user, p.action, p.resource));

    if (!hasRequiredRole && redirectToLogin) {
      const currentPath = window.location.pathname;
      const encodedCallbackUrl = encodeURIComponent(currentPath);
      router.push(`/auth/signIn?callbackUrl=${encodedCallbackUrl}`);
    }
  }, [session, status, allowedPermissions, redirectToLogin, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    if (redirectToLogin) {
      return <div>You have to sign in to display this page.</div>
    }
    return
  }

  if (!session) return

  const hasRequiredRole = allowedPermissions
    ?.some(p => checkPermission(session.user, p.action, p.resource));

  if (!hasRequiredRole) {
    if (redirectToLogin) {
      return <div>You don not have permission to display this page! You are redirecting to the Home page.</div>
    }
    return
  }

  return <>{children}</>;
}