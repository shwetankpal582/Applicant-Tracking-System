import React from 'react';

interface IntelligenceProps {
    persona: {
        type: string;
        description: string;
    };
    rejection: {
        reason: string;
        severity: "Critical" | "Major" | "Minor";
    }[];
    metrics: {
        passiveVoice: number;
        quantification: number;
        leadership: number;
    };
}

const IntelligenceDashboard: React.FC<IntelligenceProps> = ({ persona, rejection, metrics }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Persona Detection */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Persona detected</span>
                    <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{persona.type}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{persona.description}</p>
            </div>

            {/* Language & Impact Metrics */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-50 px-3 py-1 rounded-full">Impact Metrics</span>
                    <span className="text-2xl">⚡</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Passive Voice</span>
                        <span className={`text-xs font-bold ${metrics.passiveVoice > 25 ? 'text-red-500' : 'text-green-500'}`}>{metrics.passiveVoice}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Quantification</span>
                        <span className="text-xs font-bold text-blue-500">{metrics.quantification}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Leadership Score</span>
                        <span className="text-xs font-bold text-orange-500">{metrics.leadership}%</span>
                    </div>
                </div>
            </div>

            {/* Rejection Simulator */}
            <div className="bg-black p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full font-mono">Rejection Simulator</span>
                    <span className="text-2xl">🚫</span>
                </div>
                <div className="space-y-3">
                    {rejection.length > 0 ? (
                        rejection.map((r, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className={`text-[8px] font-black uppercase tracking-wider ${r.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                    {r.severity} Risk
                                </span>
                                <p className="text-[11px] text-gray-300 font-medium leading-tight">{r.reason}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-green-400 font-mono">No simulation triggers found. Clean run expected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IntelligenceDashboard;
