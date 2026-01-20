import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { usePuterStore } from "~/lib/puter";

// Lazy load components for better performance
const Summary = lazy(() => import("~/components/Summary"));
const Details = lazy(() => import("~/components/Details"));
const FixItMode = lazy(() => import("~/components/FixItMode"));
const ATSEmulator = lazy(() => import("~/components/ATSEmulator"));
const IntelligenceDashboard = lazy(() => import("~/components/IntelligenceDashboard"));
const JobAlignment = lazy(() => import("~/components/JobAlignment"));
const AuditPanel = lazy(() => import("~/components/AuditPanel"));
const HeatmapOverlay = lazy(() => import("~/components/HeatmapOverlay"));
const TemplateIntelligence = lazy(() => import("~/components/TemplateIntelligence"));

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [scoreDelta, setScoreDelta] = useState<number | null>(null);
    const [jobDescription, setJobDescription] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const isMountedRef = useRef(true);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated, navigate, id])

    useEffect(() => {
        const loadResume = async () => {
            if (!isMountedRef.current) return;

            try {
                setLoading(true);
                setError(null);

                const resumeData = await kv.get(`resume:${id}`);
                if (!resumeData) {
                    if (isMountedRef.current) {
                        setError('Resume not found');
                        setLoading(false);
                    }
                    return;
                }

                const data = JSON.parse(resumeData);
                setJobDescription(data.jobDescription);

                // Score Delta Logic: Find previous versions
                if (data.fileHash) {
                    try {
                        const history = await kv.list(`resume:*`, true) as KVItem[];
                        if (history) {
                            const versions = history
                                .map(item => {
                                    try { return JSON.parse(item.value); } catch { return null; }
                                })
                                .filter(v => v && v.fileHash === data.fileHash && v.id !== data.id)
                                .sort((a, b) => b.timestamp - a.timestamp);

                            if (versions.length > 0) {
                                const prevScore = versions[0].feedback?.overallScore || 0;
                                const currentScore = data.feedback?.overallScore || 0;
                                setScoreDelta(currentScore - prevScore);
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to load version history:', e);
                    }
                }

                const resumeBlob = await fs.read(data.resumePath);
                if (!resumeBlob) {
                    if (isMountedRef.current) {
                        setError('Failed to load resume file');
                        setLoading(false);
                    }
                    return;
                }

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });

                if (isMountedRef.current) {
                    setResumeUrl((prev: string) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(pdfBlob);
                    });
                } else {
                    URL.revokeObjectURL(URL.createObjectURL(pdfBlob));
                }

                const imageBlob = await fs.read(data.imagePath);
                if (!imageBlob) {
                    if (isMountedRef.current) {
                        setError('Failed to load image');
                        setLoading(false);
                    }
                    return;
                }

                if (isMountedRef.current) {
                    setImageUrl((prev: string) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(imageBlob);
                    });

                    setFeedback(data.feedback);
                    setLoading(false);
                } else {
                    URL.revokeObjectURL(URL.createObjectURL(imageBlob));
                }
            } catch (error) {
                console.error('Failed to load resume:', error);
                if (isMountedRef.current) {
                    setError('Failed to load resume');
                    setLoading(false);
                }
            }
        }

        loadResume();

        return () => {
            isMountedRef.current = false;
            setResumeUrl((prev: string) => {
                if (prev) URL.revokeObjectURL(prev);
                return '';
            });
            setImageUrl((prev: string) => {
                if (prev) URL.revokeObjectURL(prev);
                return '';
            });
        };
    }, [id, kv, fs]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse bg-gray-50/30">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {loading ? (
                        <div className="gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : imageUrl && resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl shadow-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    ) : null}
                </section>
                <section className="feedback-section !p-12">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Analysis Complete</p>
                            <h2 className="text-5xl !text-black font-black tracking-tighter italic">Deep Review.</h2>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Version History</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-gray-900 tracking-widest uppercase">Analysis v2.1</p>
                                {scoreDelta !== null && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreDelta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {scoreDelta >= 0 ? '+' : ''}{scoreDelta} pts
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-8">
                            <div className="bg-white rounded-2xl shadow-md w-full p-4 animate-pulse h-40"></div>
                            <div className="bg-white rounded-2xl shadow-md w-full p-6 animate-pulse h-64"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-blue-600 hover:text-blue-800 underline">Retry</button>
                        </div>
                    ) : feedback ? (
                        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                            {/* 1. Job Alignment (if JD was provided) */}
                            {feedback.jobAlignment && (
                                <Suspense fallback={<div className="h-40 animate-pulse bg-white rounded-2xl"></div>}>
                                    <JobAlignment alignment={feedback.jobAlignment} />
                                </Suspense>
                            )}

                            {/* 2. Overall Summary */}
                            <Suspense fallback={<div className="h-40 animate-pulse bg-white rounded-2xl"></div>}>
                                <Summary feedback={feedback} />
                            </Suspense>

                            {/* Template Intelligence (NEW) */}
                            <Suspense fallback={<div className="h-40 animate-pulse bg-white rounded-2xl"></div>}>
                                <TemplateIntelligence
                                    persona={feedback.persona?.type || 'Experienced'}
                                    atsType={feedback.atsSpecific ? 'Standard' : 'Generic'}
                                />
                            </Suspense>

                            {/* 3. ATS Emulator Engine */}
                            {feedback.atsSpecific && (
                                <Suspense fallback={<div className="h-64 animate-pulse bg-white rounded-2xl"></div>}>
                                    <ATSEmulator
                                        scores={feedback.atsSpecific}
                                        passProbability={feedback.atsSpecific.passProbability}
                                        riskFlags={feedback.atsSpecific.riskFlags}
                                    />
                                </Suspense>
                            )}

                            {/* 4. Intelligence Metrics */}
                            {feedback.intelligence && (
                                <Suspense fallback={<div className="h-40 animate-pulse bg-white rounded-2xl"></div>}>
                                    <IntelligenceDashboard
                                        persona={feedback.persona}
                                        rejection={feedback.rejectionSimulation}
                                        metrics={{
                                            passiveVoice: feedback.intelligence.passiveVoicePercentage,
                                            quantification: feedback.intelligence.quantificationScore,
                                            leadership: feedback.intelligence.leadershipScore
                                        }}
                                    />
                                </Suspense>
                            )}

                            {/* 5. Fix It Mode */}
                            {feedback.fixItMode && feedback.fixItMode.length > 0 && (
                                <Suspense fallback={<div className="h-64 animate-pulse bg-white rounded-2xl"></div>}>
                                    <FixItMode suggestions={feedback.fixItMode} />
                                </Suspense>
                            )}

                            {/* 6. Legacy / Additional Details */}
                            <Suspense fallback={<div className="h-40 animate-pulse bg-white rounded-2xl"></div>}>
                                <Details feedback={feedback} />
                            </Suspense>

                            {/* Audit Panel for Developers */}
                            <Suspense fallback={null}>
                                <AuditPanel data={feedback} />
                            </Suspense>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full max-w-md mx-auto" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
