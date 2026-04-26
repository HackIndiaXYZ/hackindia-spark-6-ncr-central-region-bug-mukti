"use client";

import { Navbar } from '@/components/layout/Navbar';
import { LayoutDashboard, Map as MapIcon, ClipboardList, Settings, User, ShieldCheck, UserCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (!savedRole) {
      router.push('/login');
    } else {
      setRole(savedRole);
    }
  }, [router]);

  if (!role) return null;

  const isAdmin = role === 'admin';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-card lg:block">
          <div className="flex h-full flex-col p-4">
            <div className="mb-8 px-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isAdmin ? 'CivicMinds Admin' : 'Sentinel Portal'}
              </h2>
            </div>
            <nav className="space-y-2">
              <Link 
                href={isAdmin ? "/dashboard/admin" : "/dashboard/user"} 
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${pathname === '/dashboard/user' || pathname === '/dashboard/admin' ? 'bg-accent/10 text-primary' : 'hover:bg-muted'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link href="/dashboard/map" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard/map' ? 'bg-accent/10 text-primary' : 'hover:bg-muted'}`}>
                <MapIcon className="h-4 w-4" />
                Interactive Map
              </Link>
              <Link href="/dashboard/reports" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard/reports' ? 'bg-accent/10 text-primary' : 'hover:bg-muted'}`}>
                <ClipboardList className="h-4 w-4" />
                {isAdmin ? 'Master Ledger' : 'My Reports'}
              </Link>
              {!isAdmin && (
                <>
                  <Link href="/dashboard/camera" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${pathname === '/dashboard/camera' ? 'bg-accent/10 text-primary border-r-4 border-primary' : 'hover:bg-muted'}`}>
                    <Camera className="h-4 w-4 text-primary" />
                    Live Camera
                  </Link>
                  <Link href="/dashboard/profile" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard/profile' ? 'bg-accent/10 text-primary' : 'hover:bg-muted'}`}>
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Link>
                </>
              )}
              {/* {isAdmin && (
                // <Link href="/dashboard/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                //   <User className="h-4 w-4" />
                //   User Management
                </Link>
              )} */}
              <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
            
            <div className="mt-auto border-t pt-4">
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${isAdmin ? 'bg-destructive' : 'bg-accent text-primary'}`}>
                  {isAdmin ? 'A' : 'K'}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-bold">{isAdmin ? 'Admin Sentinel' : 'Kavya'}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{isAdmin ? 'Full Access' : 'Level 4 Vigilante'}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('userRole');
                  router.push('/login');
                }}
                className="w-full mt-4 text-xs text-muted-foreground hover:text-destructive text-left px-3 py-1 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
