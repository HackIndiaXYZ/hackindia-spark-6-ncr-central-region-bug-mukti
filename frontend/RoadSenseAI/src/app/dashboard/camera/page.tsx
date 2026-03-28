"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Settings, 
  Wifi, 
  Shield, 
  Zap,
  Activity, 
  ShieldCheck, 
  RefreshCcw, 
  VideoOff,
  ShieldAlert,
  Play,
  RotateCcw
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from 'react';

const getApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  const hostname = window.location.hostname;
  return `http://${hostname}:5000`;
};

export default function CameraPage() {
  const [isLive, setIsLive] = useState(false);
  const [stats, setStats] = useState({ violations: 0, recent: [] as any[] });
  const [yoloStatus, setYoloStatus] = useState<'online' | 'offline' | 'linking'>('linking');
  const [feedKey, setFeedKey] = useState(0);
  const [cameras, setCameras] = useState<{id: string, name: string}[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("videos/sample.mp4");
  const [processedFrame, setProcessedFrame] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBase()}/get_stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setYoloStatus('online');
      }
    } catch (err) {
      setYoloStatus('offline');
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Enumerate client devices (mobile cameras, webcams)
    const getDevices = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setYoloStatus('offline');
        console.warn("Media Devices API not available. Ensure you're using HTTPS or localhost.");
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({ id: device.deviceId, name: device.label || `Camera ${device.deviceId.slice(0, 5)}` }));
        setCameras(videoDevices);
      } catch (err) {
        console.error("Error listing cameras:", err);
      }
    };
    getDevices();

    if (isLive) {
      const interval = setInterval(fetchStats, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive, fetchStats]);

  const processFrame = useCallback(async () => {
    if (!isLive) return;

    if (!isProcessingRef.current && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        isProcessingRef.current = true;
        
        // 🟢 Accuracy Re-Sync: Higher resolution for better AI feature extraction
        canvas.width = 640;
        canvas.height = 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          // 🟢 Optimization: Use binary Blob instead of Base64
          canvas.toBlob(async (blob) => {
            if (!blob) {
              isProcessingRef.current = false;
              return;
            }
            
            try {
              const response = await fetch(`${getApiBase()}/process_client_frame`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/octet-stream' },
                body: blob
              });
              
              if (response.ok) {
                const data = await response.json();
                setProcessedFrame(data.image);
              }
            } catch (err) {
              console.error("Processing error:", err);
            } finally {
              isProcessingRef.current = false;
            }
          }, 'image/jpeg', 0.6); // 🟢 Quality increased to 0.6 for accuracy
        } catch (err) {
          console.error("Canvas toBlob error:", err);
          isProcessingRef.current = false;
        }
      }
    }
    
    // Always schedule the next check as long as we're live
    if (isLive) {
      requestRef.current = requestAnimationFrame(processFrame);
    }
  }, [isLive]);

  useEffect(() => {
    if (isLive && selectedSource !== "videos/sample.mp4") {
      const startCamera = async () => {
        try {
          // Reset backend tracker ONCE when scan starts
          await fetch(`${getApiBase()}/reset_client_tracker`, { method: 'POST' });
          
          const constraints = {
            video: { 
              deviceId: selectedSource ? { exact: selectedSource } : undefined,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            requestRef.current = requestAnimationFrame(processFrame);
          }
        } catch (err) {
          console.error("Camera start error:", err);
          setIsLive(false);
        }
      };
      startCamera();
    } else if (!isLive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      setProcessedFrame(null);
    }
  }, [isLive, selectedSource]); // processFrame removed to prevent infinite loops

  const toggleScan = () => {
    if (!isLive) {
      setFeedKey(Date.now());
    }
    setIsLive(!isLive);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tighter text-primary flex items-center gap-3">
            SENTINEL VISION 
            <Badge variant="outline" className="text-xs uppercase px-3 py-1 border-primary/30">Active Feed v1.0</Badge>
          </h2>
          <p className="text-muted-foreground font-medium italic flex items-center gap-2">
            <Wifi className="h-3 w-3 animate-pulse text-primary" /> 
            AI Direct Link: {isLive ? 'ESTABLISHED' : 'STANDBY'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-primary/20">
           <Camera className="h-5 w-5 text-primary" />
           <div className="flex flex-col">
             <label className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest">Video Source</label>
             <select 
               className="bg-black border border-primary/20 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
               value={selectedSource}
               onChange={(e) => setSelectedSource(e.target.value)}
               disabled={isLive}
             >
               <option value="videos/sample.mp4">Sample Road Feed</option>
               {cameras.map(cam => (
                 <option key={cam.id} value={cam.id}>{cam.name}</option>
               ))}
               {cameras.length === 0 && (
                 <option disabled>
                   {typeof window !== 'undefined' && !navigator.mediaDevices ? '⚠️ Secure context (HTTPS) required' : 'No cameras found'}
                 </option>
               )}
             </select>
           </div>
           {cameras.length === 0 && typeof window !== 'undefined' && navigator.mediaDevices && (
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-8 w-8 text-primary hover:text-primary/80"
               onClick={async () => {
                 try {
                   await navigator.mediaDevices.getUserMedia({ video: true });
                   window.location.reload();
                 } catch (e) {}
               }}
             >
               <RotateCcw className="h-4 w-4" />
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative overflow-hidden border-2 shadow-2xl bg-black min-h-[450px] sm:aspect-video flex items-center justify-center rounded-3xl group">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            
            {isLive ? (
              selectedSource === "videos/sample.mp4" ? (
                <img 
                  key={feedKey}
                  src={`${getApiBase()}/video_feed?source=${selectedSource}&t=${feedKey}`} 
                  alt="Dashcam AI Stream" 
                  className="w-full h-full object-contain"
                  onError={() => setYoloStatus('offline')}
                />
              ) : (
                <img 
                  src={processedFrame || ''} 
                  alt="Live Mobile Stream" 
                  className={`w-full h-full object-contain ${!processedFrame ? 'hidden' : ''}`}
                />
              )
            ) : null}

            {!isLive && (
              <div className="text-center p-8 sm:p-12 space-y-8">
                <div className="p-8 rounded-full bg-primary/10 border border-primary/20 inline-block animate-pulse">
                  <VideoOff className="h-16 w-16 text-primary/40" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white mb-3">SENTINEL STANDBY</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                    The AI System is ready. Select a camera source and engage the vision link.
                  </p>
                </div>
                <Button 
                  onClick={toggleScan}
                  className="bg-primary hover:bg-primary/90 text-black font-black px-12 py-8 text-lg rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="h-6 w-6 mr-3 fill-current" />
                  ENGAGE AI SCAN
                </Button>
              </div>
            )}

            {isLive && !processedFrame && selectedSource !== "videos/sample.mp4" && (
              <div className="flex flex-col items-center gap-3">
                <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs font-mono text-primary animate-pulse uppercase tracking-widest">Waking Sentinel...</p>
              </div>
            )}

            {/* Status Badges Overlay */}
            {isLive && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className={`backdrop-blur-md text-white border-0 py-1.5 px-3 font-mono text-[10px] flex gap-2 items-center ${yoloStatus === 'online' ? 'bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-red-500/80 animate-pulse'}`}>
                  <Zap className="h-3 w-3" />
                  AI LINK: {yoloStatus.toUpperCase()}
                </Badge>
                <Badge className="bg-blue-600/80 backdrop-blur-md text-white border-0 py-1.5 px-3 font-mono text-[10px] uppercase flex gap-2 items-center">
                  <Activity className="h-3 w-3" />
                  SOURCE: {selectedSource === 'videos/sample.mp4' ? 'SAMPLE_ROAD_MP4' : 'LIVE_MOBILE_INPUT'}
                </Badge>
              </div>
            )}
            
            {isLive && (
              <div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={toggleScan}
                  className="font-black px-6 shadow-lg"
                >
                  STOP SCAN
                </Button>
              </div>
            )}
          </Card>

          <Alert className="bg-primary/5 border-2 border-primary/10 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertTitle className="font-bold text-primary">System Integrity Check</AlertTitle>
            <AlertDescription className="text-xs">
              AI YOLO Engine is processing the live stream from the {selectedSource === 'videos/sample.mp4' ? 'sample video' : 'mobile camera'}. All detections are recorded to the central mission database.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-xl bg-primary/[0.02] rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Mission Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-5 rounded-2xl bg-black border border-white/5 shadow-inner">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">Total Detections</p>
                  <p className="text-4xl font-black text-primary tracking-tighter">{stats.violations}</p>
                </div>
                <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] font-bold text-green-600 uppercase mb-1 tracking-widest">Sentinel Points</p>
                  <p className="text-3xl font-black text-green-600 tracking-tighter">{stats.violations * 25} PTS</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                   <Activity className="h-3 w-3" />
                   Recent Activity Log
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar grayscale hover:grayscale-0 transition-all">
                  {stats.recent.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-xl opacity-20">
                      <Zap className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-[10px]">AWAITING DATA</p>
                    </div>
                  ) : (
                    stats.recent.slice(0, 5).map((v: any, i: number) => (
                      <div key={i} className="flex flex-col p-3 rounded-xl bg-muted/30 border border-primary/5 hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-[11px] text-primary">{v.type || 'Violation'}</span>
                          <span className="text-[9px] font-mono opacity-50">{v.time}</span>
                        </div>
                        <div className="text-[9px] opacity-70 font-medium">Vehicle ID: {v.id || 'Unknown'}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-2 border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-primary/10"
                onClick={fetchStats}
              >
                <RefreshCcw className="h-3 w-3 mr-2" />
                Sync Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

