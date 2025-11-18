'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  ScrollText,
  SlidersHorizontal,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type SidebarNavProps = {
  isMobile?: boolean;
};

export default function SidebarNav({ isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/automation', icon: Bot, label: 'Automation' },
    { href: '/energy', icon: BarChart3, label: 'Energy' },
    { href: '/logs', icon: ScrollText, label: 'Activity Logs' },
  ];

  const adminNavItems = [
    { href: '/admin/devices', icon: SlidersHorizontal, label: 'Manage Devices' },
    { href: '/admin/users', icon: Shield, label: 'Manage Users' },
  ];

  const renderLink = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href;
    const linkContent = (
      <>
        <item.icon className="h-5 w-5" />
        <span className="sr-only">{item.label}</span>
      </>
    );
    const linkClasses = cn(
      'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
      { 'bg-accent text-accent-foreground': isActive }
    );

    if (isMobile) {
        return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                    { 'text-foreground': isActive }
                )}
            >
                <item.icon className="h-5 w-5" />
                {item.label}
            </Link>
        )
    }

    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>
          <Link href={item.href} className={linkClasses}>
            {linkContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  };
  
  if (isMobile) {
    return (
        <TooltipProvider>
            {navItems.map(renderLink)}
            {isAdmin && <div className="my-2 border-t border-muted"></div>}
            {isAdmin && adminNavItems.map(renderLink)}
        </TooltipProvider>
    )
  }


  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        {navItems.map(renderLink)}
      </nav>
      {isAdmin && (
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          {adminNavItems.map(renderLink)}
        </nav>
      )}
    </TooltipProvider>
  );
}
