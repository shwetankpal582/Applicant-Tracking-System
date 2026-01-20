import React from 'react';

interface ATSEmulatorProps {
    scores: {
        keywordDensity: number;
        sectionStructure: number;
        experienceRelevance: number;
        formattingParsability: number;
        actionVerbStrength: number;
    };
    passProbability: "High" | "Medium" | "Low";
    riskFlags: string[];
}

const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>{label}</span>
            <span>{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-1000 ${score > 79 ? 'bg-green-500' : score > 59 ? 'bg-blue-500' : score > 39 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const ATSEmulator: React.FC<ATSEmulatorProps> = ({ scores, passProbability, riskFlags }) => {
    const probColor = passProbability === "High" ? "text-green-600 bg-green-50" : passProbability === "Medium" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full p-8 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${probColor}`}>
                    Pass Probability: {passProbability}
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="bg-black text-white p-3 rounded-xl rotate-3">
                    <span className="text-2xl font-black">ATS</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Emulator Engine 4.0</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enterprise Parser Simulation</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <ScoreBar label="Keyword Density" score={scores.keywordDensity} />
                    <ScoreBar label="Section Structure" score={scores.sectionStructure} />
                    <ScoreBar label="Experience Relevance" score={scores.experienceRelevance} />
                    <ScoreBar label="Formatting Parsability" score={scores.formattingParsability} />
                    <ScoreBar label="Action Verb Strength" score={scores.actionVerbStrength} />
                </div>

                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Risk Flags Identified
                    </h3>

                    {riskFlags.length > 0 ? (
                        <div className="space-y-3">
                            {riskFlags.map((flag, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-red-50 shadow-sm text-xs font-medium text-gray-700">
                                    <span className="text-red-400 text-lg">⚠️</span>
                                    {flag}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs font-medium text-gray-400 italic">No major risks detected. Your formatting is clean.</div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
                            *This simulation models Greenhouse, Workday, and Lever parser behavior. Results reflect typical filtering thresholds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSEmulator;
