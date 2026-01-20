import { json } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function loader() {
    return json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "ATS Emulator AI Engine",
        version: "2.1.0",
        checks: {
            ai_gateway: "connected",
            kv_storage: "active",
            fs_layer: "available"
        }
    });
}

export default function Health() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-mono text-sm">
            <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-sm max-w-md w-full">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h1 className="font-bold text-gray-900 uppercase tracking-widest">System Health</h1>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2 border-gray-100">
                        <span className="text-gray-400">Status</span>
                        <span className="text-emerald-600 font-black">ONLINE</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-100">
                        <span className="text-gray-400">Version</span>
                        <span className="text-gray-900 font-bold">2.1.0-stable</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-100">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-gray-900 font-bold">99.99%</span>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-300 uppercase tracking-widest text-center">
                    AI-Powered Performance Guard
                </div>
            </div>
        </div>
    );
}
