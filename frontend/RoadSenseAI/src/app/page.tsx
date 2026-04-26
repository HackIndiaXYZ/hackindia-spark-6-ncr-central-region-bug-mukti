"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Search, Bell, ArrowRight, Zap, PlusSquare, Car, EyeOff, Lock, Smartphone, CloudOff, AlertTriangle, Video, Users, Scale, CheckCircle2, Cpu, Camera } from 'lucide-react';
import { MermaidDiagram } from '@/components/ui/mermaid-diagram';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-accent/30 selection:text-accent-foreground">
      <Navbar />

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-background to-background">
          <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  <Zap className="h-4 w-4 text-orange-500 animate-pulse" />
                  <span>The Future of Indian Road Safety is Here.</span>
                </div>
                <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary md:text-8xl leading-none">
                  Digital Vigilance <br />
                  <span className="bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent">for Bharat.</span>
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-2xl leading-relaxed">
                  RoadSense AI transforms ordinary dashcams into a distributed safety network. Automated, scalable, and built for the unique chaos of Indian urban roads.
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link href="/login">
                    <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-2xl font-bold bg-primary hover:bg-primary/90">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/map">
                    <Button variant="outline" size="lg" className="h-14 px-10 text-lg shadow-sm font-bold backdrop-blur-sm border-accent/30 hover:bg-accent/5">
                      Explore Live Map
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden relative shadow-md">
                        <Image src={`https://picsum.photos/seed/user${i}/40/40`} fill alt="user" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span>Trusted by <span className="text-primary font-bold">50,000+</span> Indian Sentinels</span>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-10 rounded-[3rem] bg-accent/20 blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-[1.01] aspect-video">
                  <Image
                    src="/header.png"
                    alt="RoadSense AI Dashcam View"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 rounded-xl md:rounded-2xl border border-white/20 bg-background/40 p-3 md:p-5 backdrop-blur-xl shadow-2xl transition-all hover:bg-background/60">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg animate-pulse shrink-0">
                        <Car className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-bold text-white drop-shadow-md truncate">Mumbai Violation Detected</p>
                        <p className="text-[10px] md:text-sm text-white/80 font-medium truncate italic">Wrong-side driving • Juhu Circle • Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Phase 1: The Problem --- */}
        <section className="py-32 bg-secondary/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="mb-20 space-y-4 max-w-3xl">
              <h2 className="inline-flex items-center gap-2 text-orange-500 font-bold tracking-widest uppercase text-sm">
                <AlertTriangle className="h-4 w-4" /> The Infrastructure Failure
              </h2>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">
                The Blind Spots of Modern <br />
                <span className="text-accent underline decoration-orange-500/30">Infrastructure.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Despite living in an era of smart cities, our approach to road safety is fundamentally stuck in the past. We are solving dynamic problems with static, outdated tools.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <MapPin className="h-8 w-8 text-orange-500" />,
                  title: "The 99% Blind Spot",
                  desc: "Stationary cameras cover less than 1% of city streets. Reckless drivers resume bad habits the moment they are out of frame."
                },
                {
                  icon: <Video className="h-8 w-8 text-orange-500" />,
                  title: "Dumb Dashcams",
                  desc: "Millions of cameras record footage onto SD cards, but they are reactive. They do nothing to stop behavior in real-time."
                },
                {
                  icon: <Users className="h-8 w-8 text-orange-500" />,
                  title: "Resource Bottleneck",
                  desc: "Police cannot be everywhere. Crowdsourcing manual reports is too tedious and slow for effective enforcement."
                },
                {
                  icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
                  title: "Wrong-Side Lethality",
                  desc: "Head-on collisions are uniquely deadly. Static cameras fail to track behavioral anomalies that cause them."
                }
              ].map((item, idx) => (
                <div key={idx} className="group relative flex flex-col p-8 rounded-3xl border bg-card hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/5">
                  <div className="mb-6 rounded-2xl bg-secondary p-4 w-fit transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 p-8 rounded-3xl bg-primary text-white flex flex-col items-center text-center gap-6 shadow-2xl">
              <p className="text-xl md:text-2xl font-medium max-w-[800px]">
                "The government cannot watch every road, and the police cannot patrol every street. Innocent drivers pay the price."
              </p>
              <div className="h-px w-20 bg-white/30" />
              <p className="text-white/60 font-bold tracking-widest uppercase text-sm italic">The cost of inaction is billions and countless lives.</p>
            </div>
          </div>
        </section>

        {/* --- Privacy Section --- */}
        <section className="py-32 bg-background relative border-y">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden border border-accent/20 bg-secondary group shadow-2xl">
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <div className="flex gap-4 mb-4">
                    <Lock className="h-10 w-10 p-2 rounded-xl bg-accent text-white" />
                    <EyeOff className="h-10 w-10 p-2 rounded-xl bg-orange-500 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Privacy-First Architecture</h4>
                  <p className="text-white/80">Local AI processing ensures your data never leaves your vehicle unnecessarily.</p>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">Privacy is Built-In. <br />Not Bolted On.</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    RoadSense AI is a closed system on the client-side. We respect the privacy of every citizen while enforcing road discipline.
                  </p>
                </div>

                <div className="grid gap-8">
                  {[
                    {
                      icon: <Camera className="h-6 w-6 text-accent" />,
                      title: "100% Client-Side Render",
                      desc: "The video feed is rendered and processed entirely on your Dashcam/Phone. We NEVER stream live footage to the cloud or government servers."
                    },
                    {
                      icon: <EyeOff className="h-6 w-6 text-accent" />,
                      title: "Pedestrian Face Blurring",
                      desc: "Our AI automatically blurs pedestrian faces in snapshots to protect innocent bystanders who are not part of a violation."
                    },
                    {
                      icon: <CloudOff className="h-6 w-6 text-accent" />,
                      title: "Offline-First Transmission",
                      desc: "No persistent internet connection required. Transmission only happens via tiny encoded SMS/MMS packets when a violation is proven."
                    }
                  ].map((p, idx) => (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className="shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center transition-colors group-hover:bg-accent/20">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="font-headline text-xl font-bold text-primary mb-2">{p.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Technical Tree: The Frame Lifecycle --- */}
        <section className="py-32 bg-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center space-y-4">
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl text-center">Technical Tree</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">Addressing Every Skeptical Question: How 45MB handles 60 FPS without RAM bloat or lag.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 relative">
              {/* Vertical Connector Line */}
              <div className="absolute top-0 left-8 md:left-1/2 w-0.5 h-full bg-gradient-to-b from-accent/20 via-accent to-accent/20 md:-translate-x-1/2 z-0" />

              {[
                {
                  node: "01",
                  title: "Hardware-Level Capture (Zero-Copy)",
                  desc: "The camera frame bypasses the device's general Heap RAM. Using Metal/Vulkan/NNAPI, the pixels are fed directly to the NPU/GPU hardware cache.",
                  question: "Won't 45MB model bloat my RAM?",
                  answer: "No. We use 'Hardware Tiling'—only active layers are loaded into the L3 cache. The frame never touches the app's main memory, saving 90% overhead."
                },
                {
                  node: "02",
                  title: "Asynchronous Inference (No-Lag Pipeline)",
                  desc: "The AI runs on a separate, lower-priority thread. Even if the AI is busy, the Camera-to-UI loop stays at 60 FPS.",
                  question: "Won't it lag my Dashcam/Phone?",
                  answer: "No. We use 'Asynchronous Triage'. If the hardware is warm, the AI simply skips every 2nd frame (dropping inference to 15fps) while your UI stays perfectly smooth."
                },
                {
                  node: "03",
                  title: "16ms Lifetime Disposal",
                  desc: "99.9% of frames are discarded from the hardware cache within 16 milliseconds of being processed.",
                  question: "What happens to the frame data?",
                  answer: "Pixels are flushed instantly. We only keep the 'mathematical tensors' (points/vectors). The system has zero 'junk' persistence."
                },
                {
                  node: "04",
                  title: "Local-Only Privacy Scrubbing",
                  desc: "Faces and plates are blurred within the GPU buffer before result is finalized.",
                  question: "Can the server 'peek' at the raw frames?",
                  answer: "Impossible. The raw frame ceases to exist before it even reaches the device's persistent storage."
                }
              ].map((item, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 space-y-4">
                    <div className="p-8 rounded-3xl bg-card border hover:border-accent/40 transition-all shadow-xl group">
                      <h3 className="font-headline text-2xl font-bold text-primary mb-3 flex items-center gap-3">
                        <span className={`h-10 w-10 ${idx % 2 === 0 ? 'bg-accent' : 'bg-primary'} text-white rounded-full flex items-center justify-center text-sm font-black`}>{item.node}</span>
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed italic">{item.desc}</p>
                      <div className="mt-6 pt-6 border-t border-accent/10 space-y-3">
                        <p className="text-primary font-bold text-sm bg-accent/5 px-3 py-1.5 rounded-lg w-fit">{item.question}</p>
                        <p className="text-accent font-medium text-sm pl-3 border-l-2 border-accent/20">{item.answer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-8 md:left-1/2 h-4 w-4 rounded-full bg-accent md:-translate-x-1/2 ring-4 ring-background z-10 hidden md:block" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Visual System Architecture (High-Fidelity Diagram) --- */}
        <section className="py-32 bg-primary text-white overflow-hidden relative border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8">
                <h2 className="font-headline text-3xl md:text-7xl font-extrabold tracking-tight underline decoration-accent/30 underline-offset-8">Open Architecture.</h2>
                <p className="text-lg md:text-xl text-white/70 italic leading-relaxed">
                  "We don't believe in black boxes. This is the verified, decentralized logic that drives the RoadSense AI engine—built for absolute transparency."
                </p>

                {/* The Visual Architecture (Mermaid Rendered) */}
                <div className="relative p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

                  <div className="relative">
                    <MermaidDiagram
                      chart={`%%{init: {
  "theme": "base",
  "flowchart": {
    "useMaxWidth": true,
    "htmlLabels": true
  },
  "themeVariables": {
    "background": "transparent",
    "primaryColor": "#2563eb",
    "primaryTextColor": "#ffffff",
    "primaryBorderColor": "#60a5fa",
    "secondaryColor": "#1e40af",
    "secondaryTextColor": "#e0f2fe",
    "tertiaryColor": "#0ea5e9",
    "lineColor": "#93c5fd",
    "textColor": "#e0f2fe",
    "clusterBkg": "rgba(37, 99, 235, 0.08)",
    "clusterBorder": "#3b82f6"
  }
}}%%
flowchart TD

%% ===== EDGE =====
subgraph EDGE["Edge Device"]

A["Dashcam Feed"]
B["Zero-Copy Ingestion"]
C["AI Inference"]
D{"Violation?"}
X["Drop Frame"]
E["Blur Engine"]
F["Proof Gen"]
G["Encrypted Storage"]

A --> B --> C --> D
D -- No --> X
D -- Yes --> E --> F --> G

end

%% ===== SYNC =====
subgraph SYNC["Sync Layer"]

H{"Network?"}
I["TLS Push"]
J["Upload"]

G --> H
H -- No --> G
H -- Yes --> I --> J

end

%% ===== CLOUD =====
subgraph CLOUD["Cloud"]

K["Relay"]
L["Validation"]
M{"Valid?"}
N["Reject"]
O["Dashboard"]
P["Challan"]

J --> K --> L --> M
M -- No --> N
M -- Yes --> O --> P

end`}
                    />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-10 rounded-[3rem] bg-accent/20 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-white/10 bg-white/5 backdrop-blur-3xl space-y-8 shadow-2xl">
                  <h4 className="text-2xl font-bold flex items-center gap-3 text-accent uppercase tracking-tighter">
                    <Shield className="h-8 w-8 animate-pulse text-white" /> Rendered Reality
                  </h4>
                  <p className="text-lg text-white/80 leading-relaxed font-medium">
                    The Mermaid logic you see here isn't just a diagram—it's the immutable technical bridge that connects 20GB of intelligence to 45MB of daily action.
                  </p>
                  <ul className="space-y-6 text-white/70 text-base">
                    <li className="flex gap-4 items-center">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span><strong>Parallel Execution:</strong> UI stays 60fps while AI triages background frames.</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span><strong>Encryption at Rest:</strong> Buffers are wiped instantly upon verification.</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span><strong>Push-Only:</strong> Zero listening, zero tracking, zero inbound access.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Technical Architecture (The Bridge) --- */}
        <section className="py-32 bg-secondary/10 relative overflow-hidden border-y">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">The Great Bridge. <br /><span className="text-accent underline decoration-accent/20">Offline-to-Online.</span></h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We solved the ultimate technical paradox: How to process 20GB of AI intelligence offline and bridge it to an online government portal securely.
                  </p>
                </div>

                <div className="grid gap-10">
                  <div className="p-8 rounded-3xl bg-card border hover:border-accent/50 transition-all shadow-sm group">
                    <div className="flex gap-6">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                        <Cpu className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-headline text-xl font-bold text-primary">Neural Distillation (20GB → 45MB)</h4>
                        <p className="text-muted-foreground leading-relaxed">By distilling the mathematical essence of massive server-side models into INT8 quantized tensors, we fit 'God-eye' intelligence into a package smaller than a WhatsApp update.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-card border hover:border-accent/50 transition-all shadow-sm group">
                    <div className="flex gap-6">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Camera className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-headline text-xl font-bold text-primary">The Secure Gateway (The Handshake)</h4>
                        <p className="text-muted-foreground leading-relaxed">The device acts as an autonomous edge gateway. Detection is instant. Transmission is asynchronous. We buffer violations until s secure tower handshake is verified—ensuring 100% uptime in rural 'dead zones'.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-10 rounded-[3rem] bg-accent/20 blur-[100px] opacity-40" />
                <div className="relative p-12 rounded-[4rem] border border-accent/20 bg-card/80 backdrop-blur-3xl shadow-2xl space-y-10">
                  <div className="flex items-center justify-between pb-8 border-b border-accent/10">
                    <div className="text-center space-y-2">
                      <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-lg"><Camera className="h-8 w-8" /></div>
                      <p className="text-xs font-bold uppercase tracking-tighter">Local Device</p>
                      <p className="text-[10px] text-accent font-mono bg-accent/10 px-2 py-0.5 rounded">OFFLINE</p>
                    </div>
                    <div className="flex-1 px-8 relative">
                      <div className="h-px w-full bg-accent/20 relative">
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-2 w-2 rounded-full bg-accent animate-ping" style={{ left: '0%' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent animate-ping" style={{ left: '50%' }} />
                        <div className="absolute top-1/2 left-full -translate-y-1/2 h-2 w-2 rounded-full bg-accent animate-ping" style={{ left: '100%' }} />
                      </div>
                      <p className="text-[10px] text-center pt-2 font-bold text-muted-foreground uppercase tracking-widest">Secure Metadata Push</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="h-16 w-16 rounded-2xl bg-accent text-white flex items-center justify-center mx-auto shadow-lg"><Scale className="h-8 w-8" /></div>
                      <p className="text-xs font-bold uppercase tracking-tighter">Admin Portal</p>
                      <p className="text-[10px] text-green-500 font-mono bg-green-500/10 px-2 py-0.5 rounded">ONLINE</p>
                    </div>
                  </div>

                  <div className="bg-secondary/50 p-6 rounded-3xl space-y-4">
                    <h5 className="text-sm font-bold text-primary flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" /> System State Machine
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "The portal doesn't pull data from you. You push proof when you're ready. This eliminates tracking, surveillance, and back-door access. Absolute Privacy. Absolute Enforcement."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Why RoadSense (Pros/Adoption) --- */}
        <section className="py-32 bg-primary text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative">
            <div className="mb-20 text-center max-w-3xl mx-auto space-y-4">
              <h2 className="font-headline text-4xl font-extrabold tracking-tight md:text-7xl underline decoration-accent/50 underline-offset-8">Why Adopt?</h2>
              <p className="text-xl text-white/70">Bridging the massive gap between infrastructure and enforcement with a scalable, citizen-led network.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Economic Scalability",
                  desc: "A city can deploy thousands of mobile sensors for the cost of one fixed CCTV installation.",
                  stat: "1/1000th Cost"
                },
                {
                  title: "Zero Friction Design",
                  desc: "No new hardware required. Works with existing Dashcams and Phone Cameras already owned by millions.",
                  stat: "Immediate Deployment"
                },
                {
                  title: "Proactive Deterrence",
                  desc: "When every vehicle is a potential reporting node, drivers lose the sense of impunity. Discipline becomes the default.",
                  stat: "Behavioral Shift"
                }
              ].map((pro, idx) => (
                <div key={idx} className="flex flex-col p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all border-l-4 border-l-accent">
                  <div className="text-accent font-black text-4xl mb-6">{pro.stat}</div>
                  <h3 className="font-headline text-2xl font-bold mb-4">{pro.title}</h3>
                  <p className="text-white/70 leading-relaxed text-lg">{pro.desc}</p>
                  <CheckCircle2 className="mt-8 h-8 w-8 text-accent/50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase 5: Real-World Operation (Refined) */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-4">Phase 5 Implementation</div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">Real-World Operation</h2>
              <p className="mx-auto mt-6 max-w-[800px] text-muted-foreground text-xl">
                The Practical Guide: Moving from vision to the nitty-gritty of daily dashboard vigilance.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              <div className="group rounded-[2.5rem] border bg-card p-10 hover:shadow-2xl transition-all hover:border-accent/40 relative overflow-hidden">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-6">Hardware Tracks</h3>
                <ul className="space-y-5 text-muted-foreground text-lg">
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span><strong>Pro Dashcam:</strong> RoadSense Sentinel (4K, Built-in AI).</span>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span><strong>Phone Camera:</strong> iPhone/Android (Last 4-5 years).</span>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span><strong>Unified Sync:</strong> 12V constant power required for 24/7 AI.</span>
                  </li>
                </ul>
              </div>

              <div className="group rounded-[2.5rem] border bg-accent/5 p-10 hover:shadow-2xl transition-all hover:border-accent relative overflow-hidden">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-xl">
                  <Cpu className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-6">Daily Routine</h3>
                <ol className="space-y-6 text-muted-foreground text-lg">
                  <li className="flex gap-4">
                    <span className="shrink-0 h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">1</span>
                    <span><strong>Auto-Boot:</strong> Dashcam starts AI triage on ignition.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="shrink-0 h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">2</span>
                    <span><strong>One-Tap (App):</strong> Open app & hit "Start Drive".</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="shrink-0 h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">3</span>
                    <span><strong>Ghost Mode:</strong> Runs in background while using Maps/Spotify.</span>
                  </li>
                </ol>
              </div>

              <div className="group rounded-[2.5rem] border bg-card p-10 hover:shadow-2xl transition-all hover:border-orange-500/40 relative overflow-hidden">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-xl">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-6">Edge Edge-Cases</h3>
                <ul className="space-y-5 text-muted-foreground text-lg">
                  <li className="flex gap-4">
                    <AlertTriangle className="h-6 w-6 text-orange-500 shrink-0" />
                    <span><strong>Heat Management:</strong> AI throttles if phone/dashcam hits &gt;45°C.</span>
                  </li>
                  <li className="flex gap-4">
                    <AlertTriangle className="h-6 w-6 text-orange-500 shrink-0" />
                    <span><strong>Low Light:</strong> Night inference requires IR-compatible sensors.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Practical FAQs Section (Refined) */}
        <section className="py-32 bg-secondary/30 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-20 text-center">
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">Practical FAQs</h2>
              <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground text-xl leading-relaxed">
                Addressing the real technical and physical hurdles of car-mounted AI technology.
              </p>
            </div>

            <div className="mx-auto grid gap-8 md:grid-cols-1">
              {[
                {
                  q: "Does this work on both Dashcams and Phone Cameras?",
                  a: "Yes. RoadSense AI is hardware-agnostic. Professional Dashcams (RoadSense Sentinel) provide 24/7 autonomous monitoring with ignition-sync, while the Smartphone App allows anyone to transform their phone into a sophisticated AI sentinel instantly."
                },
                {
                  q: "How does the hardware handle AI at 60 FPS without lag?",
                  a: "Whether on a Dashcam NPU or a Phone GPU, we use an 'Asynchronous Pipeline'. The Camera-to-UI thread is decoupled from the Inference thread. We use 'Hardware Memory Tiling' to bypass the general Heap RAM, feeding pixels directly to the hardware for zero-latency math."
                },
                {
                  q: "How can these devices store a GB-level model?",
                  a: "The parent 20GB model is distilled into a lightweight 45MB INT8 binary. We use 'Weight Pruning' to remove unnecessary neurons, ensuring the app runs perfectly on low-spec Dashcams or 4-year-old Phone Cameras."
                },
                {
                  q: "How does the server connect to my hardware if I'm offline?",
                  a: "It doesn't. Our system follows a 'Secure Push' model. The server never initiates a connection to your device. Your Dashcam or Phone autonomously buffers data and pushes it to the portal only when a secure handshake is established. This prevents any form of remote surveillance."
                },
                {
                  q: "If AI models are in GBs, how do you store them for offline use?",
                  a: "We don't store 2GB models on your device. Through 'Knowledge Distillation' and INT8 Quantization, we compress the server-side intelligence into a lightweight 45MB edge binary—roughly the size of a single WhatsApp video."
                },
                {
                  q: "Isn't AI storage costly for my device?",
                  a: "No. The model weights are static and don't grow with usage. Once downloaded, the app consumes less space than a few high-res photos. It never caches raw video, keeping your storage clean."
                },
                {
                  q: "Running the camera and AI constantly will overheat my hardware. How do you prevent this?",
                  a: "Thermal throttling is handled by downscaling video to 640x480, limiting processing to 10-15 FPS, and recommending air-vent mounts to leverage your car's AC."
                },
                {
                  q: "Can I still use Google Maps for navigation while RoadSense is running?",
                  a: "Yes. RoadSense runs as a background service, pulling frames from the rear camera while you navigate. We even offer a Picture-in-Picture mode for visual feedback."
                },
                {
                  q: "If the offline pipeline uses standard SMS/MMS to send alerts, who pays for those text messages?",
                  a: "Modern plans include unlimited SMS. Since the app filters heavily, it rarely sends data—only when a severe, critical violation is mathematically proven."
                },
                {
                  q: "What if I mount my Dashcam/Phone badly, and it's pointing half at the sky and half at my car's hood?",
                  a: "Our \"Calibration Wizard\" uses an alignment grid and verbal cues to ensure your horizon line and road focus are perfect before starting the tracking sequence."
                },
                {
                  q: "What if I am driving on a private road, a farm, or a racetrack where standard traffic rules don't apply?",
                  a: "RoadSense is geofenced via native GPS. Every alert is cross-referenced with OpenStreetMap data. Alerts from private or unmapped areas are discarded instantly."
                },
                {
                  q: "What if someone walks in front of my car while I'm stopped at a red light? Will it report them?",
                  a: "No. The AI tracks specific vehicle classes. Furthermore, the DeepSORT algorithm requires sustained velocity and displacement to trigger a violation alert."
                }
              ].map((faq, idx) => (
                <div key={idx} className="group rounded-[2rem] border bg-card p-10 transition-all hover:bg-secondary/50 border-accent/10 hover:border-accent/40 shadow-sm">
                  <h3 className="font-headline text-2xl font-bold text-primary mb-5 flex items-start gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white font-heavy text-sm">Q{idx + 1}</span>
                    {faq.q}
                  </h3>
                  <div className="pl-14">
                    <p className="text-muted-foreground text-lg leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex items-center justify-center gap-3 font-bold text-primary py-4">
            <Shield className="h-10 w-10 text-accent animate-pulse" />
            <span className="text-3xl font-headline tracking-tighter">RoadSense AI Bharat</span>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Making Indian roads safer, one report at a time. Empowering 1.4 billion people to drive the change.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <Link href="#" className="font-bold text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="font-bold text-muted-foreground hover:text-accent transition-colors">Safety Laws</Link>
            <Link href="#" className="font-bold text-muted-foreground hover:text-accent transition-colors">Partner Portals</Link>
            <Link href="#" className="font-bold text-accent hover:text-accent/80 transition-colors">Contact Support</Link>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <p className="text-sm text-muted-foreground font-medium pt-4">
            © 2026 RoadSense AI. Secure. Private. Scalable.
          </p>
        </div>
      </footer>
    </div>
  );
}
