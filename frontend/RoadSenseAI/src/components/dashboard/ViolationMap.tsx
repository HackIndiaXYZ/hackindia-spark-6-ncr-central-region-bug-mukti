
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Info, MapPin } from 'lucide-react';
import type { Icon as LeafletIcon } from 'leaflet';

// Dynamic import for Leaflet components to avoid SSR errors
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface ViolationPoint {
  id: string;
  position: [number, number];
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
}

const MOCK_POINTS: ViolationPoint[] = [
  { id: '1', position: [28.6675, 77.2282], type: 'No Helmet', severity: 'high', location: 'Kashmiri Gate, Delhi' },
  { id: '2', position: [28.4950, 77.0890], type: 'Wrong Side Driving', severity: 'high', location: 'Cyber City, Gurgaon' },
  { id: '3', position: [28.5677, 77.3260], type: 'Triple Riding', severity: 'medium', location: 'Sector 18, Noida' },
  { id: '4', position: [28.5708, 77.2210], type: 'Illegal Parking', severity: 'low', location: 'South Ext, Delhi' },
  { id: '5', position: [28.7041, 77.1025], type: 'Red Light Violation', severity: 'medium', location: 'Rohini Sec 7, Delhi' },
];

export function ViolationMap() {
  const [selected, setSelected] = useState<ViolationPoint | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Import leaflet directly on client
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!isMounted || !L) {
    return (
      <Card className="flex h-[600px] w-full items-center justify-center border-2 bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Initializing Sentinel Map...</p>
        </div>
      </Card>
    );
  }

  // Create custom marker icon function
  const createMarkerIcon = (severity: string) => {
    const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#06b6d4';
    const pulseClass = severity === 'high' ? 'animate-pulse' : '';
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 rounded-full bg-white shadow-xl opacity-80"></div>
          <div class="relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${pulseClass}" style="background-color: ${color}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border-2 bg-muted/20 shadow-xl">
      <MapContainer
        center={[28.6139, 77.2090] as any} // Center on Delhi
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {MOCK_POINTS.map((point) => (
          <Marker
            key={point.id}
            position={point.position as any}
            icon={createMarkerIcon(point.severity)}
            eventHandlers={{
              click: () => setSelected(point),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <Badge 
                  variant={point.severity === 'high' ? 'destructive' : 'secondary'} 
                  className="mb-1 text-[9px] uppercase font-bold"
                >
                  {point.type}
                </Badge>
                <h5 className="text-sm font-bold text-primary">{point.location}</h5>
                <p className="text-[10px] text-muted-foreground mt-1">Status: Sentinel Verified</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected Info Overlay */}
      {selected && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 z-[1000]">
          <Card className="p-4 shadow-2xl border-2 animate-in slide-in-from-bottom-4 bg-background/95 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={selected.severity === 'high' ? 'destructive' : 'secondary'} className="mb-2 uppercase font-bold text-[10px]">
                  {selected.type}
                </Badge>
                <h4 className="font-bold text-primary text-lg">{selected.location}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Verified by Community Sentinel</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-primary p-1">
                <Info className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ShieldAlert className="h-5 w-5 text-primary" />
              </div>
              <div className="text-[11px] leading-tight text-muted-foreground font-medium">
                Sentinel-verified report. Local traffic authorities in {selected.location.split(',')[1] || 'NCR'} have been notified.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-6 left-6 rounded-xl border-2 bg-background/90 p-4 backdrop-blur shadow-xl z-[1000]">
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Delhi NCR Live Hotspots</h5>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-xs font-semibold">Critical Violation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            <span className="text-xs font-semibold">Frequent Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span className="text-xs font-semibold">Normal Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
