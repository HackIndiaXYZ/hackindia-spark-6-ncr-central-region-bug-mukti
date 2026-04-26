"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Shield, Star, AlertTriangle, History, MapPin, Award, CheckCircle, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ProfilePage() {
  const [stats, setStats] = useState<{violations: number, recent: any[]}>({ violations: 0, recent: [] });

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/get_stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const payFine = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/pay_fine/${id}`, { method: 'POST' });
      fetchStats(); // Refresh after payment
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  const userContributions = stats.recent.filter((r: any) => r.reporter !== 'Flask AI');
  const userPoints = userContributions.length * 25;
  const aiChallans = stats.recent.filter((r: any) => r.reporter === 'Flask AI');

  const user = {
    name: "Sentinel User",
    role: "User",
    level: Math.floor(userPoints / 100) + 1,
    points: userPoints,
    totalReports: userContributions.length,
    verifiedReports: userContributions.filter((r: any) => r.status === 'Verified').length,
    rank: userPoints > 100 ? "Elite Vigilante" : "Novice Scout"
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your credentials, track rewards, and view violation history.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-accent flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-xl mb-4">
              K
            </div>
            <CardTitle className="text-xl font-headline">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary">{user.rank}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                <span>Progress to Level {user.level + 1}</span>
                <span>{user.points} / 2000 XP</span>
              </div>
              <Progress value={(user.points / 2000) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-2xl font-bold text-primary">{user.totalReports}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reports</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-2xl font-bold text-accent">{user.points}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Points</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full font-bold">Edit Profile</Button>
            <Button variant="outline" className="w-full font-bold">Redeem Rewards</Button>
          </CardFooter>
        </Card>

        {/* Violations & Points History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-primary font-headline">Issued Violations (Challans)</CardTitle>
                </div>
                <Badge variant="destructive">{aiChallans.filter((v:any) => v.status !== 'Paid' && v.status !== 'Rejected').length} Action Required</Badge>
              </div>
              <CardDescription>Traffic rules violations linked to your vehicle.</CardDescription>
            </CardHeader>
            <CardContent>
              {aiChallans.length > 0 ? (
                <div className="space-y-4">
                  {aiChallans.map((v) => (
                    <div key={v.id} className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">{v.type}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {v.location} • {v.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-destructive">{v.fine}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs gap-2">
                              <Eye className="h-3 w-3" />
                              View Evidence
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Violation Proof: {v.id}</DialogTitle>
                            </DialogHeader>
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                              <Image 
                                src={v.proofImage} 
                                alt="Violation Evidence" 
                                fill 
                                className="object-cover"
                                data-ai-hint="helmet violation"
                                unoptimized
                              />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Captured by AI Sentinel Node #921 on {v.date}. Location verified via GPS.
                            </div>
                          </DialogContent>
                        </Dialog>
                        {v.status !== 'Paid' && v.status !== 'Rejected' ? (
                          <Button size="sm" variant="destructive" className="h-8 font-bold" onClick={() => payFine(v.id)}>Pay Fine Now</Button>
                        ) : (
                          <Badge variant="outline" className={v.status === 'Paid' ? "text-green-600 border-green-600 bg-green-50" : "text-muted-foreground"}>{v.status}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2 opacity-20" />
                  <p className="text-muted-foreground">No active challans. Ride safe!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <CardTitle className="text-primary font-headline">My Contribution Impact</CardTitle>
              </div>
              <CardDescription>How your reports are making roads safer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl border bg-accent/5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Verification Accuracy</h4>
                  <p className="text-2xl font-bold text-primary">94%</p>
                  <p className="text-[10px] text-green-600 font-medium mt-1">Top 5% in New Delhi</p>
                </div>
                <div className="p-4 rounded-xl border bg-primary/5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Safety Points Growth</h4>
                  <p className="text-2xl font-bold text-primary">+250</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Mar 2026</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-bold text-primary mb-3">Recent Reporting History</h4>
                <div className="space-y-3">
                  {userContributions.length > 0 ? userContributions.slice(0, 5).map((h: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                      <div>
                        <span className="font-semibold">{h.type}</span>
                        <p className="text-[10px] text-muted-foreground">{h.location} • {h.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={h.status === 'Verified' ? 'default' : 'outline'} className="text-[9px]">{h.status}</Badge>
                        <p className="text-[10px] font-bold text-accent mt-0.5">+25 XP</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground italic">No manual reports submitted yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
