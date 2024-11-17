import { getServerSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface ServerAuthProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectToLogin?: boolean;
}

export default async function SSProtectedComponent({
  children,
  allowedRoles,
  redirectToLogin = true
}: ServerAuthProps) {
  const session = await getServerSession();
  const headerList = await headers();
  const currentPath = new URL(headerList.get('x-url') || '', process.env.NEXTAUTH_URL).pathname;
  const encodedCallbackUrl = encodeURIComponent(currentPath);

  if (!session) {
    if (redirectToLogin) {
      redirect(`/auth/signIn?callbackUrl=${encodedCallbackUrl}`);
    }
    return
  }

  const userRole = session?.user?.role;
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    if (redirectToLogin) {
      redirect(`/auth/signIn?callbackUrl=${encodedCallbackUrl}`);
    }
    return false;
  }

  return <div>{children}</div>;
}
