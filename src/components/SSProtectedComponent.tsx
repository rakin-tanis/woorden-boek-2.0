import { serverCheckPermission } from '@/lib/auth';
import { getServerSession } from '@/lib/session';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface ServerAuthProps {
  children: React.ReactNode;
  allowedPermissions: { action: string, resource: string }[];
  redirectToLogin?: boolean;
}

export default async function SSProtectedComponent({
  children,
  allowedPermissions,
  redirectToLogin = false
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

  // const hasRequiredPermission = true
  const hasRequiredPermission = allowedPermissions
    ?.some(async (p) => await serverCheckPermission(session.user, p.action, p.resource));

  if (!hasRequiredPermission) {
    if (redirectToLogin) {
      redirect(`/auth/signIn?callbackUrl=${encodedCallbackUrl}`);
    }
    return false;
  }

  return <div>{children}</div>;
}
