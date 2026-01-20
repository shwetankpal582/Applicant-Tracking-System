import React, { useState } from 'react';

interface AuditPanelProps {
    data: any;
    prompt?: string;
}

const AuditPanel: React.FC<AuditPanelProps> = ({ data, prompt }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'json' | 'prompt'>('json');

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-transform z-50 border border-gray-800"
            >
                🛠️ Audit Mode
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] p-8 flex items-center justify-center">
            <div className="bg-[#111] border border-gray-800 w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setView('json')}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${view === 'json' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            Raw Data (JSON)
                        </button>
                        <button
                            onClick={() => setView('prompt')}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${view === 'prompt' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            System Prompt
                        </button>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-white text-xl font-bold p-2"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 font-mono text-[11px] leading-relaxed">
                    {view === 'json' ? (
                        <pre className="text-green-400">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    ) : (
                        <div className="text-blue-300 whitespace-pre-wrap">
                            {prompt || "System prompt not available for this session."}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Debug Panel | Engineering Maturity v1.0</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
                        className="text-[9px] font-bold text-gray-400 hover:text-white uppercase tracking-widest"
                    >
                        Copy to clipboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditPanel;
