import React from 'react';

interface TemplateRecommendation {
    name: string;
    description: string;
    atsScoreImpact: string;
    features: string[];
    suitability: string[];
}

const TemplateIntelligence: React.FC<{ persona: string, atsType: string }> = ({ persona, atsType }) => {
    const recommendations: TemplateRecommendation[] = [
        {
            name: "The Executive Standard",
            description: "A single-column, hyper-traditional layout designed for legacy ATS like Taleo and Workday.",
            atsScoreImpact: "+14%",
            features: ["No columns", "Standard fonts", "Quantified bullets"],
            suitability: ["Managerial", "Experienced"]
        },
        {
            name: "The Tech Innovator",
            description: "Modern but parsable layout optimized for Greenhouse and Lever.",
            atsScoreImpact: "+8%",
            features: ["Clean headers", "Skill tags", "Project-centric"],
            suitability: ["Software Engineer", "Fresher"]
        },
        {
            name: "Academic Precision",
            description: "High-density layout for researchers and education professionals.",
            atsScoreImpact: "+12%",
            features: ["Publication list", "Grant section", "Structured fonts"],
            suitability: ["PhD Career", "Professor"]
        }
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-blue-900 leading-none mb-1">Template Intelligence.</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Persona-Targeted Layouts</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                    AI Recommended
                </div>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-2xl border transition-all duration-300 group cursor-pointer ${rec.suitability.includes(persona)
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-gray-800 tracking-tight">{rec.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{rec.description}</p>
                            </div>
                            <span className="text-emerald-600 font-black text-xs">{rec.atsScoreImpact} Score</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {rec.features.map((feat, fIdx) => (
                                <span key={fIdx} className="text-[9px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500 group-hover:border-blue-300 transition-colors">
                                    {feat}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                    View All Enterprise Templates →
                </button>
            </div>
        </div>
    );
};

export default TemplateIntelligence;
