"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Filter, Eye, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

// Removed static MOCK_REPORTS

export default function ReportsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<{violations: number, recent: any[]}>({ violations: 0, recent: [] });

  useEffect(() => {
    setRole(localStorage.getItem('userRole'));
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/get_stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const isAdmin = role === 'admin';
  const filteredReports = stats.recent.filter((r: any) => 
    (isAdmin || r.reporter !== 'Flask AI') && // Let Demo assume non-AI are user's reports
    (r.type.toLowerCase().includes(searchTerm.toLowerCase()) || r.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">
            {isAdmin ? 'Master Violation Ledger' : 'My Sentinel Reports'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Complete overview of all community-submitted violations.' : 'History of your contribution to Indian road safety.'}
          </p>
        </div>
        {!isAdmin && (
          <Link href="/dashboard/reports/new">
            <Button className="font-bold shadow-md">
              Submit New Report
            </Button>
          </Link>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by violation type or location..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 font-bold">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Violation</TableHead>
                <TableHead className="font-bold">Vehicle</TableHead>
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                {isAdmin && <TableHead className="font-bold">Reporter</TableHead>}
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs">{report.id}</TableCell>
                  <TableCell className="font-bold">{report.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono uppercase tracking-widest bg-secondary/30">
                      {report.vehicle}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {report.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {report.date}
                    </div>
                  </TableCell>
                  {isAdmin && <TableCell className="text-xs">{report.reporter}</TableCell>}
                  <TableCell className="text-center">
                    <Badge 
                      variant={report.status === 'Verified' ? 'default' : report.status === 'Rejected' ? 'destructive' : 'outline'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Report Evidence: {report.id}</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2">
                          <Image 
                            src="/demo.png" 
                            alt="Violation Proof" 
                            fill 
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="p-4 bg-muted rounded-lg text-xs space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-bold">{report.reporter === 'Flask AI' ? 'Automated AI Detection' : 'Sentinel Verified Report'}</span>
                          </div>
                          <p><strong>Detected At:</strong> {report.date}, {report.time} IST</p>
                          <p><strong>GPS Location:</strong> {report.location}</p>
                          <p><strong>Vehicle ID:</strong> {report.vehicle}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
