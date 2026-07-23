import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface EcgCanvasProps {
  waveType?: string;
  height?: number;
  interactive?: boolean;
  bpm?: number;
  showGrid?: boolean;
  title?: string;
}

export const EcgCanvas: React.FC<EcgCanvasProps> = ({
  waveType = 'NSR',
  height = 200,
  interactive = true,
  bpm = 75,
  showGrid = true,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [offset, setOffset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedLead, setSelectedLead] = useState<'Lead II' | 'Lead V1' | 'Lead V5'>('Lead II');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 2) % 1200);
    }, 25);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Generate waveform point (y value for a given x position)
  const getWaveY = (x: number, type: string, lead: string): number => {
    // Normalization parameters
    const cycleLength = 300 / (bpm / 75); // base cycle length ~300px
    const posInCycle = (x + offset) % cycleLength;
    const norm = posInCycle / cycleLength; // 0.0 to 1.0

    const centerY = height / 2;
    const amp = 35 * zoom;

    const normalizedType = type.toUpperCase();

    // Baseline noise / irregularity
    let noise = Math.sin(x * 0.1) * 0.5;

    // ATRIAL FIBRILLATION
    if (normalizedType.includes('AFIB') || normalizedType.includes('AF')) {
      const fibrillatoryWave = Math.sin(x * 0.2) * 3 + Math.cos(x * 0.45) * 2;
      // Irregularly irregular beats (R-R interval variation)
      const isBeat = posInCycle < 25 && (x + offset) % (cycleLength * 0.8) < 25;
      if (isBeat) {
        if (posInCycle < 5) return centerY - posInCycle * (amp * 0.1); // Q
        if (posInCycle < 12) return centerY - (12 - posInCycle) * amp * 2.2; // R
        if (posInCycle < 18) return centerY + (posInCycle - 12) * amp * 0.6; // S
      }
      return centerY + fibrillatoryWave;
    }

    // VENTRICULAR TACHYCARDIA
    if (normalizedType.includes('VT') || normalizedType.includes('TACHY')) {
      const vtCycle = 120;
      const vtNorm = ((x + offset) % vtCycle) / vtCycle;
      const vtWave = Math.sin(vtNorm * Math.PI * 2) * (amp * 1.8);
      return centerY + vtWave;
    }

    // NORMAL SINUS RHYTHM (NSR)
    if (norm < 0.12) {
      // P wave
      const pNorm = norm / 0.12;
      return centerY - Math.sin(pNorm * Math.PI) * (amp * 0.22);
    } else if (norm < 0.20) {
      // PR segment
      return centerY;
    } else if (norm < 0.23) {
      // Q wave
      return centerY + (norm - 0.20) * 10 * (amp * 0.3);
    } else if (norm < 0.29) {
      // R wave
      const rNorm = (norm - 0.23) / 0.06;
      if (rNorm < 0.5) {
        return centerY - rNorm * 2 * (amp * 2.2);
      } else {
        return centerY - (1 - rNorm) * 2 * (amp * 2.2);
      }
    } else if (norm < 0.33) {
      // S wave
      const sNorm = (norm - 0.29) / 0.04;
      return centerY + Math.sin(sNorm * Math.PI) * (amp * 0.5);
    } else if (norm < 0.40) {
      // ST Segment
      if (normalizedType.includes('STEMI') || normalizedType.includes('ELEVATION')) {
        return centerY - amp * 0.9; // Tombstone ST Elevation!
      } else if (normalizedType.includes('PERICARDITIS')) {
        return centerY - amp * 0.4; // Concave ST elevation
      } else if (normalizedType.includes('ISCHEMIA') || normalizedType.includes('DEPRESSION')) {
        return centerY + amp * 0.5; // ST Depression
      }
      return centerY;
    } else if (norm < 0.60) {
      // T wave
      const tNorm = (norm - 0.40) / 0.20;
      if (normalizedType.includes('HYPERKALEMIA') || normalizedType.includes('PEAKED')) {
        // Tall, peaked, narrow T wave
        return centerY - Math.pow(Math.sin(tNorm * Math.PI), 3) * (amp * 2.0);
      } else if (normalizedType.includes('INVERSION') || normalizedType.includes('WELLENS')) {
        // T-wave inversion
        return centerY + Math.sin(tNorm * Math.PI) * (amp * 0.8);
      }
      // Normal T wave
      return centerY - Math.sin(tNorm * Math.PI) * (amp * 0.45);
    }

    // LBBB Specific (Broad notched R wave in Lead V5/V6 or Lead II)
    if (normalizedType.includes('LBBB')) {
      if (norm > 0.20 && norm < 0.38) {
        const lbbbNorm = (norm - 0.20) / 0.18;
        if (lead === 'Lead V1') {
          // Broad deep QS wave
          return centerY + Math.sin(lbbbNorm * Math.PI) * (amp * 1.8);
        }
        // Notch in R wave
        const notch = Math.sin(lbbbNorm * Math.PI * 2) * (amp * 0.3);
        return centerY - Math.sin(lbbbNorm * Math.PI) * (amp * 1.9) + notch;
      }
    }

    // WPW Specific (Delta wave slurred upstroke)
    if (normalizedType.includes('WPW')) {
      if (norm > 0.12 && norm < 0.25) {
        // Slurred early upstroke
        const wpwNorm = (norm - 0.12) / 0.13;
        return centerY - wpwNorm * (amp * 1.6);
      }
    }

    return centerY + noise;
  };

  // Generate SVG polyline path string
  const width = 800;
  const step = 2;
  const points: string[] = [];

  for (let x = 0; x <= width; x += step) {
    const y = getWaveY(x, waveType, selectedLead);
    points.push(`${x},${y.toFixed(1)}`);
  }

  const pathData = `M ${points.join(' L ')}`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-[#070F1E] shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0C192E] border-b border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold tracking-wider text-emerald-400 uppercase">{waveType}</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-semibold">{selectedLead}</span>
          <span className="text-slate-500">|</span>
          <span>{bpm} BPM</span>
          <span className="text-slate-500">|</span>
          <span>25mm/s @ 10mm/mV</span>
        </div>

        {interactive && (
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-800/80 p-0.5">
              {(['Lead II', 'Lead V1', 'Lead V5'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLead(l)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                    selectedLead === l ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
              title={isPlaying ? 'Pause Sweep' : 'Play Sweep'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setZoom((z) => (z === 1 ? 1.4 : z === 1.4 ? 0.7 : 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
              title="Toggle Vertical Gain"
            >
              <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas / SVG Grid Container */}
      <div className="relative w-full overflow-x-auto bg-[#0A1220]" style={{ height }}>
        {/* ECG Grid Background (1mm & 5mm) */}
        {showGrid && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Small grid 1mm (approx 5px) */}
              <pattern id="grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(239, 68, 68, 0.12)" strokeWidth="0.5" />
              </pattern>
              {/* Large grid 5mm (50px) */}
              <pattern id="grid-large" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#grid-small)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-large)" />
          </svg>
        )}

        {/* Dynamic Sweep Line Indicator */}
        {isPlaying && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/80 shadow-[0_0_12px_#38bdf8] pointer-events-none transition-all duration-75"
            style={{ left: `${((offset * (width / 1200)) % width)}px` }}
          />
        )}

        {/* ECG Trace Line */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="relative w-full h-full min-w-[600px] preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Subtle Glow Under Trace */}
          <path
            d={pathData}
            fill="none"
            stroke="rgba(20, 184, 166, 0.3)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main Neon Green / Teal Trace */}
          <path
            d={pathData}
            fill="none"
            stroke="#14B8A6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Calibration Mark on Left */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-70 pointer-events-none">
          <div className="w-2 h-10 border-l-2 border-t-2 border-b-2 border-emerald-400"></div>
          <span className="text-[9px] font-mono text-emerald-400/80 uppercase">1 mV</span>
        </div>
      </div>

      {title && (
        <div className="px-4 py-1.5 bg-[#0C192E] border-t border-slate-800 text-[11px] font-medium text-slate-400 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-teal-400 text-[10px]">Interactive Simulation</span>
        </div>
      )}
    </div>
  );
};
