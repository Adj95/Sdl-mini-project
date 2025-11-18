'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

type ProtectedLayoutProps = {
  children: React.ReactNode;
  requiredRole?: 'admin';
};

export default function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (requiredRole === 'admin' && !isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requiredRole, router]);

  if (isLoading || !isAuthenticated || (requiredRole === 'admin' && !isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
