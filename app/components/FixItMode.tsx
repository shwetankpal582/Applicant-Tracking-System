import React from 'react';

interface FixItSuggestion {
    original: string;
    improved: string;
    reason: string;
}

interface FixItModeProps {
    suggestions: FixItSuggestion[];
}

const FixItMode: React.FC<FixItModeProps> = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold italic tracking-tight text-blue-900 ml-1">"Fix It" Mode</h2>
            </div>

            <p className="text-gray-600 border-l-4 border-blue-500 pl-4 py-1 italic">
                AI-rewritten bullet points to maximize your impact score.
            </p>

            <div className="space-y-6">
                {suggestions.map((item, index) => (
                    <div key={index} className="group relative bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">❌ Original</span>
                                <p className="text-sm text-gray-500 italic line-through decoration-red-200 decoration-2">{item.original}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">✅ Improved (Use this!)</span>
                                <p className="text-md font-semibold text-gray-800 leading-relaxed text-blue-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">{item.improved}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">{item.reason}</span>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(item.improved)}
                                className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2"
                            >
                                Copy →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FixItMode;
