
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ArrowUpRight, TrendingUp, AlertCircle, MapPin, Clock } from 'lucide-react';
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

const DATA = [
  { name: 'Parking', count: 124 },
  { name: 'Speeding', count: 86 },
  { name: 'Red Light', count: 45 },
  { name: 'Turning', count: 32 },
  { name: 'Signal', count: 18 },
];

const RECENT_REPORTS = [
  { id: '1', type: 'Speeding', location: 'Sunset Blvd', time: '10m ago', status: 'Verified' },
  { id: '2', type: 'Illegal Parking', location: 'Park Lane', time: '1h ago', status: 'Pending' },
  { id: '3', type: 'Illegal Turn', location: 'Market St', time: '3h ago', status: 'Verified' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Overview</h1>
          <p className="text-muted-foreground">System health and community reporting activity.</p>
        </div>
        <Link href="/dashboard/reports/new">
          <Button className="font-bold shadow-md">
            New Report
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Sentinel Reports', value: '2,842', trend: '+12%', icon: <Shield className="h-4 w-4 text-accent" /> },
          { label: 'Violations Resolved', value: '1,421', trend: '+5%', icon: <AlertCircle className="h-4 w-4 text-accent" /> },
          { label: 'Hotspot Zones', value: '18', trend: '-2', icon: <MapPin className="h-4 w-4 text-accent" /> },
          { label: 'Avg Verify Time', value: '42m', trend: '-8m', icon: <Clock className="h-4 w-4 text-accent" /> },
        ].map((stat, i) => (
          <Card key={i} className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Chart Column */}
        <Card className="lg:col-span-4 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-headline">Violation Distribution</CardTitle>
            <CardDescription>Most frequent reports in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* List Column */}
        <Card className="lg:col-span-3 border-2">
          <CardHeader>
            <CardTitle className="text-primary font-headline">Live Community Feed</CardTitle>
            <CardDescription>Recent verified reports near your area.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_REPORTS.map((report) => (
                <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{report.type}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {report.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={report.status === 'Verified' ? 'default' : 'outline'} className="text-[10px]">
                      {report.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{report.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-accent font-bold hover:text-primary">
              View All Global Activity
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
