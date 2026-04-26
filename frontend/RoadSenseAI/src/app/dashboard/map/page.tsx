import { ViolationMap } from '@/components/dashboard/ViolationMap';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Interactive Sentinel Map</h1>
          <p className="text-muted-foreground">Explore reported violations and identified hotspots across the Delhi NCR region.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-64 shadow-sm" placeholder="Search NCR area (e.g., Noida, Gurgaon)..." />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ViolationMap />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm">Nearby Hotspot</CardTitle>
            <CardDescription>Sector 29, Gurgaon</CardDescription>
          </CardHeader>
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Violation frequency:</span>
              <span className="font-bold text-destructive">Very High</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-destructive" style={{ width: '85%' }} />
            </div>
          </div>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm">Safest Corridor</CardTitle>
            <CardDescription>Noida Expressway (Sec 144-150)</CardDescription>
          </CardHeader>
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Violation frequency:</span>
              <span className="font-bold text-accent">Very Low</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '12%' }} />
            </div>
          </div>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm">New Activity Area</CardTitle>
            <CardDescription>Cyber City, Gurgaon</CardDescription>
          </CardHeader>
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Trend:</span>
              <span className="font-bold text-orange-500">Increasing</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: '45%' }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
