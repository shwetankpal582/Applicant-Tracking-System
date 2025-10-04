import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState, useRef, lazy, Suspense} from "react";
import {usePuterStore} from "~/lib/puter";

// Lazy load components for better performance
const Summary = lazy(() => import("~/components/Summary"));
const ATS = lazy(() => import("~/components/ATS"));
const Details = lazy(() => import("~/components/Details"));

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const isMountedRef = useRef(true);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated, navigate, id])

    useEffect(() => {
        const loadResume = async () => {
            if (!isMountedRef.current) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const resume = await kv.get(`resume:${id}`);
                if(!resume) {
                    if (isMountedRef.current) {
                        setError('Resume not found');
                        setLoading(false);
                    }
                    return;
                }

                const data = JSON.parse(resume);

                const resumeBlob = await fs.read(data.resumePath);
                if(!resumeBlob) {
                    if (isMountedRef.current) {
                        setError('Failed to load resume file');
                        setLoading(false);
                    }
                    return;
                }

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                
                if (isMountedRef.current) {
                    // Clean up previous URLs
                    setResumeUrl(prev => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(pdfBlob);
                    });
                } else {
                    URL.revokeObjectURL(URL.createObjectURL(pdfBlob));
                }

                const imageBlob = await fs.read(data.imagePath);
                if(!imageBlob) {
                    if (isMountedRef.current) {
                        setError('Failed to load image');
                        setLoading(false);
                    }
                    return;
                }
                
                if (isMountedRef.current) {
                    setImageUrl(prev => {
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
        
        // Cleanup function to revoke URLs when component unmounts
        return () => {
            isMountedRef.current = false;
            setResumeUrl(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return '';
            });
            setImageUrl(prev => {
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
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
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
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                    onError={() => {
                                        if (isMountedRef.current) {
                                            setError('Image failed to load');
                                        }
                                    }}
                                />
                            </a>
                        </div>
                    ) : null}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {loading ? (
                        <div className="flex flex-col gap-8">
                            <div className="bg-white rounded-2xl shadow-md w-full p-4 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-md w-full p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-32 w-full"></div>}>
                                <Summary feedback={feedback} />
                            </Suspense>
                            <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-32 w-full"></div>}>
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            </Suspense>
                            <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-32 w-full"></div>}>
                                <Details feedback={feedback} />
                            </Suspense>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
