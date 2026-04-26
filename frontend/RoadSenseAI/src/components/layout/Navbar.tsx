"use client";

import Link from 'next/link';
import { Shield, Map as MapIcon, PlusSquare, User, Bell, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!savedRole);
    setRole(savedRole);
  }, [pathname]);

  const dashboardLink = role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
  const profileLink = role === 'admin' ? '/dashboard/admin' : '/dashboard/profile';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary transition-colors hover:opacity-90">
          <Shield className="h-6 w-6 text-accent" />
          <span className="text-xl font-headline tracking-tight">RoadSense AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link href={dashboardLink} className="text-sm font-medium hover:text-primary">Dashboard</Link>
              <Link href="/dashboard/map" className="text-sm font-medium hover:text-primary">Interactive Map</Link>
              <Link href="/dashboard/reports" className="text-sm font-medium hover:text-primary">Reports</Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
              <Link href="/dashboard/map" className="text-sm font-medium hover:text-primary">Public Map</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/reports/new">
                <Button size="sm" className="hidden sm:flex gap-2 font-bold bg-accent text-primary hover:bg-accent/80">
                  <PlusSquare className="h-4 w-4" />
                  Report
                </Button>
                <Button size="icon" className="sm:hidden bg-accent text-primary">
                  <PlusSquare className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-accent" />
              </Button>
              <Link href={profileLink}>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2 font-bold">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
