import ProtectedLayout from '@/components/protected-layout';
import AppLayout from '../(app)/layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout requiredRole="admin">
        <AppLayout>
            {children}
        </AppLayout>
    </ProtectedLayout>
  );
}
