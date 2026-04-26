"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ChevronRight } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = React.useState<string>("");

  useEffect(() => {
    const renderChart = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
        });

        // Use a unique ID for each render to avoid conflicts
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: generatedSvg } = await mermaid.render(id, chart);
        setSvg(generatedSvg);
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="w-full bg-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-inner">
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[70vh] p-2 md:p-8 custom-scrollbar scrollbar-hide md:scrollbar-default">
        {svg ? (
          <div 
            dangerouslySetInnerHTML={{ __html: svg }} 
            className="flex justify-center min-w-[850px] md:min-w-0 py-4"
          />
        ) : (
          <div className="animate-pulse flex flex-col items-center py-24 justify-center w-full gap-4">
            <div className="h-1.5 w-32 bg-white/10 rounded-full"></div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest animate-pulse">Generating Blueprint...</p>
          </div>
        )}
      </div>
      
      {/* Mobile Scroll Hint */}
      <div className="md:hidden flex items-center justify-center gap-3 py-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-1.5 animate-pulse">
          <ChevronRight className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Swipe to Explore Architecture</span>
          <ChevronRight className="h-3 w-3 text-accent" />
        </div>
      </div>
    </div>
  );
}
