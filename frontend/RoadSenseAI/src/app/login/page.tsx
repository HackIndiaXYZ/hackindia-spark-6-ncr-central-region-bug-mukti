"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userEmail = process.env.NEXT_PUBLIC_USER_EMAIL;
    const userPass = process.env.NEXT_PUBLIC_USER_PASSWORD;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPass) {
      localStorage.setItem('userRole', 'admin');
      toast({ title: "Login Successful", description: "Welcome, Administrator." });
      router.push('/dashboard/admin');
    } else if (email === userEmail && password === userPass) {
      localStorage.setItem('userRole', 'user');
      toast({ title: "Login Successful", description: "Welcome back, Sentinel." });
      router.push('/dashboard/user');
    } else {
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: "Invalid credentials. Please use the demo accounts provided in instructions." 
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-headline">CivicMinds Login</CardTitle>
          <CardDescription>Enter your credentials to access the sentinel portal</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold h-11" type="submit" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 bg-secondary/20 border-t text-[10px] text-center text-muted-foreground">
          Demo Accounts: user1@gmail.com / admin@gmail.com (pwd: 12345678)
        </div>
      </Card>
    </div>
  );
}
