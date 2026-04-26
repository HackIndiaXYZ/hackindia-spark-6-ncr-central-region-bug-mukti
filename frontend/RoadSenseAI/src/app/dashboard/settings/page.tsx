"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Bell, Map, ShieldAlert, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [radius, setRadius] = useState([5]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your personalized alert preferences for CivicMinds have been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Alert Settings</h1>
        <p className="text-muted-foreground">Customize how and when you receive notifications from CivicMinds.</p>
      </div>

      <div className="grid gap-8">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              <CardTitle className="text-primary font-headline">Notification Preferences</CardTitle>
            </div>
            <CardDescription>Manage your global alert triggers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive instant mobile alerts for new violations.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Summary</Label>
                <p className="text-sm text-muted-foreground">Get a summary of local activity every Monday morning.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-accent" />
              <CardTitle className="text-primary font-headline">Geofencing & Proximity</CardTitle>
            </div>
            <CardDescription>Set up alerts for specific geographical zones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base">Alert Radius (km)</Label>
                <span className="text-sm font-bold text-accent">{radius} km</span>
              </div>
              <Slider 
                value={radius} 
                onValueChange={setRadius} 
                max={50} 
                step={1} 
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                You will receive alerts for violations reported within this radius of your primary location.
              </p>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-bold text-primary">Custom Monitoring Zones</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-3 rounded-lg border bg-secondary/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Downtown</p>
                    <p className="text-[10px] text-muted-foreground">3.5km monitoring</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive h-8">Remove</Button>
                </div>
                <Button variant="outline" className="border-dashed h-full py-4 border-2 hover:border-accent">
                  + Add New Zone
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              <CardTitle className="text-primary font-headline">Violation Filter</CardTitle>
            </div>
            <CardDescription>Choose which violation types trigger alerts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              "Illegal Parking", "Speeding", "Red Light Violation", "Driving Under Influence", 
              "Improper Lane Change", "Distracted Driving"
            ].map((type) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg border">
                <Label className="text-sm font-medium">{type}</Label>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button size="lg" className="px-12 font-bold shadow-xl" onClick={handleSave}>
            Save All Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
