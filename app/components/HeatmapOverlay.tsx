import React, { useState } from 'react';

interface HeatmapZone {
    type: "risk" | "neutral" | "strength";
    label: string;
    explanation: string;
    top: number;
    left: number;
    width: number;
    height: number;
}

interface HeatmapOverlayProps {
    zones: HeatmapZone[];
    imageWidth: number;
    imageHeight: number;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ zones }) => {
    const [hoveredZone, setHoveredZone] = useState<HeatmapZone | null>(null);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-lg">
            {zones.map((zone, idx) => (
                <div
                    key={idx}
                    className={`absolute pointer-events-auto cursor-help transition-all duration-300 border-2 ${zone.type === 'risk' ? 'bg-red-500/10 border-red-500/30' :
                            zone.type === 'strength' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                'bg-blue-500/10 border-blue-500/30'
                        }`}
                    style={{
                        top: `${zone.top}%`,
                        left: `${zone.left}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                    }}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                >
                    {hoveredZone === zone && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-black/90 backdrop-blur-md text-white text-[10px] rounded-xl shadow-2xl z-20 border border-white/20 animate-in fade-in slide-in-from-top-2">
                            <div className="font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${zone.type === 'risk' ? 'bg-red-500' :
                                        zone.type === 'strength' ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`}></span>
                                {zone.label}
                            </div>
                            <p className="font-medium text-gray-300 leading-relaxed">{zone.explanation}</p>
                        </div>
                    )}
                </div>
            ))}

            {/* Grid simulation for "Deep Scan" feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
    );
};

export default HeatmapOverlay;
