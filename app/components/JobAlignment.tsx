import React from 'react';

interface JobAlignmentProps {
    alignment: {
        matchingKeywords: string[];
        missingKeywords: string[];
        alignmentScore: number;
        weakSections: string[];
    };
}

const JobAlignment: React.FC<JobAlignmentProps> = ({ alignment }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full p-8 border-2 border-green-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">JD Alignment matched</span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-gray-900 italic">Target Match</h2>
                </div>
                <div className="flex items-center gap-4 bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Alignment Score</p>
                        <p className="text-3xl font-black text-green-700">{alignment.alignmentScore}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">✅ Matching Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {alignment.matchingKeywords.map((kw, i) => (
                            <span key={i} className="text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">⚠️ Missing Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                        {alignment.missingKeywords.map((kw, i) => (
                            <span key={i} className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {alignment.weakSections.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-3 italic">Weak alignment within sections:</h4>
                    <div className="flex gap-4">
                        {alignment.weakSections.map((section, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
                                <span className="text-xs font-bold text-gray-700 uppercase">{section}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobAlignment;
