"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowUpRight, TrendingUp, AlertCircle, MapPin, Clock, Car, Smartphone, User, History, Eye, Camera, Activity, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

// Removed static INDIA_DATA and RECENT_REPORTS_INDIA

const RECENT_REPORTS_INDIA = [
  { id: '1', type: 'No Helmet', location: 'MG Road, Bangalore', time: '5m ago', status: 'Verified' },
  { id: '2', type: 'Wrong Side Driving', location: 'Marine Drive, Mumbai', time: '15m ago', status: 'Pending' },
  { id: '3', type: 'Triple Riding', location: 'Connaught Place, Delhi', time: '1h ago', status: 'Verified' },
];

export default function UserDashboardPage() {
  const [stats, setStats] = useState<{ violations: number, recent: any[] }>({ violations: 0, recent: [] });

  useEffect(() => {
    const getApiBase = () => {
      if (typeof window === 'undefined') return 'http://localhost:5000';
      const hostname = window.location.hostname;
      return `http://${hostname}:5000`;
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(`${getApiBase()}/get_stats`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats from Flask:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const systemAlerts = stats.recent.filter((r: any) => r.reporter === 'User Sentinel' && (r.status === 'Pending' || r.status === 'Verified'));

  // Compute dynamic chart data
  const violationCounts = stats.recent.reduce((acc: any, curr: any) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});
  
  const dynamicChartData = Object.keys(violationCounts).length > 0 
    ? Object.keys(violationCounts).map(key => ({ name: key, count: violationCounts[key] }))
    : [{ name: 'Awaiting Feeds', count: 0 }];

  // Compute User Sentinel Stats
  const userReports = stats.recent.filter((r: any) => r.reporter === 'User Sentinel');
  const userPoints = userReports.length * 25;
  const userVerified = userReports.filter((r: any) => r.status === 'Verified').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Sentinel Overview</h1>
          <p className="text-muted-foreground">Track your contributions and monitor your traffic health on CivicMinds.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/profile">
            <Button variant="outline" className="font-bold border-2">
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </Link>
          <Link href="/dashboard/reports/new">
            <Button className="font-bold shadow-md bg-accent text-primary hover:bg-accent/80">
              Submit New Violation
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Mission Reports Carousel */}
      {systemAlerts.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x w-full">
          {systemAlerts.map((challan: any, i: number) => (
            <Alert key={`${challan.id}-${i}`} variant="default" className="min-w-[85%] md:min-w-[600px] shrink-0 snap-center border-2 border-primary/20 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-bold text-lg m-0 text-primary">Automated Report Filed</AlertTitle>
                  </div>
                  <AlertDescription className="space-y-4">
                    <p className="text-muted-foreground text-xs">The AI Sentinel has successfully recorded a violation on your behalf. This has been submitted to the government portal.</p>
                    <div className="flex flex-wrap gap-4 bg-destructive/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-semibold">Violation: {challan.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs font-semibold">Location: {challan.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold">Detection Date: {challan.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="default" size="sm" className="font-black bg-primary text-black hover:bg-primary/90">
                        View Submission Details
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="font-bold gap-2 text-destructive border-destructive hover:bg-destructive/10">
                            <Eye className="h-4 w-4" />
                            View Proof
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Violation Evidence: {challan.id}</DialogTitle>
                          </DialogHeader>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-destructive/20 shadow-inner bg-black">
                            <Image
                              src={challan.proofImage}
                              alt="Violation Proof"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                            <div className="absolute top-4 right-4">
                              <Badge variant="destructive" className="uppercase font-mono">Violation Detected</Badge>
                            </div>
                          </div>
                          <div className="p-4 bg-muted rounded-lg text-xs space-y-1">
                            <p><strong>Reporter ID:</strong> {challan.reporter}</p>
                            <p><strong>Timestamp:</strong> {challan.time}</p>
                            <p><strong>Accuracy:</strong> {(challan.confidence * 100).toFixed(1)}% (AI Confirmed)</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </AlertDescription>
                </div>
                <div className="hidden md:block w-48 shrink-0">
                  <div className="relative h-full w-full rounded-lg border-2 border-destructive/20 overflow-hidden grayscale group hover:grayscale-0 transition-all bg-black">
                    <Image
                      src={challan.proofImage}
                      alt="Quick Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-destructive/20" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <Badge className="w-full justify-center bg-destructive text-[8px]">PROOFS ATTACHED</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      ) : (
        <Alert variant="default" className="border-2 border-green-500/50 bg-green-500/5 shadow-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-bold text-lg m-0 text-green-700">All Clear!</AlertTitle>
          </div>
          <AlertDescription className="text-green-600/80 mt-2">
            You currently have no pending traffic violations. Great job staying safe on the roads! (Waiting for backend detections...)
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'My Total Reports', value: userReports.length.toString(), trend: 'Live', icon: <Shield className="h-4 w-4 text-accent" /> },
          { label: 'Points Earned', value: userPoints.toString(), trend: '+25/report', icon: <TrendingUp className="h-4 w-4 text-accent" /> },
          { label: 'Verified Cases', value: userVerified.toString(), trend: '100%', icon: <AlertCircle className="h-4 w-4 text-accent" /> },
          { label: 'Current Level', value: userPoints > 100 ? 'Sentinel Lvl 2' : 'Sentinel Lvl 1', trend: 'Active', icon: <Smartphone className="h-4 w-4 text-accent" /> },
        ].map((stat, i) => (
          <Card key={i} className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                {stat.trend} growth
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Chart Column */}
        <Card className="lg:col-span-4 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-headline">City-wide Violation Trends</CardTitle>
            <CardDescription>Most reported incidents in your vicinity (As of Mar 10, 2026).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {dynamicChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* List Column */}
        <Card className="lg:col-span-3 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-headline">Live Local Feed</CardTitle>
            <CardDescription>Real-time reports from fellow Sentinels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm border rounded-lg bg-muted/20">
                  No local violations detected yet.
                </div>
              ) : (
                stats.recent.map((report: any, i: number) => (
                  <div key={`${report.id}-${i}`} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{report.type}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {report.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-[10px]">
                        AI Flagged
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">{report.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/reports">
              <Button variant="ghost" className="w-full mt-6 text-xs text-accent font-bold hover:text-primary">
                Expand Area Activity
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
