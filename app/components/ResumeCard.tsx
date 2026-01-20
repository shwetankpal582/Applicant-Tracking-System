import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import { usePuterStore } from "~/lib/puter";
import { imageCache } from "~/lib/imageCache";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath, atsType, jobDescription } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const loadResume = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setIsLoading(true);
            setError(null);

            // Check cache first
            if (imageCache.has(imagePath)) {
                const cachedUrl = imageCache.get(imagePath);
                if (cachedUrl && isMountedRef.current) {
                    setResumeUrl(cachedUrl);
                    setIsLoading(false);
                    return;
                }
            }

            const blob = await fs.read(imagePath);
            if (!blob) {
                if (isMountedRef.current) {
                    setError('Failed to load image');
                    setIsLoading(false);
                }
                return;
            }

            const url = URL.createObjectURL(blob);

            // Only update state if component is still mounted
            if (isMountedRef.current) {
                // Cache the URL
                imageCache.set(imagePath, url);

                // Clean up previous URL only if it's not cached
                setResumeUrl(prev => {
                    if (prev && !imageCache.has(imagePath)) {
                        URL.revokeObjectURL(prev);
                    }
                    return url;
                });
                setIsLoading(false);
            } else {
                // Component unmounted, clean up the URL immediately
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to load resume image:', error);
            if (isMountedRef.current) {
                setError('Failed to load image');
                setIsLoading(false);
            }
        }
    }, [fs, imagePath]);

    useEffect(() => {
        loadResume();

        // Cleanup function to revoke URL when component unmounts
        return () => {
            isMountedRef.current = false;
            setResumeUrl(prev => {
                if (prev && !imageCache.has(imagePath)) {
                    URL.revokeObjectURL(prev);
                }
                return '';
            });
        };
    }, [loadResume]);

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card animate-in fade-in duration-1000 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`View resume for ${companyName || 'position'} - Score: ${feedback.overallScore}/100`}
        >
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        {atsType && (
                            <span className="bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {atsType} Target
                            </span>
                        )}
                        {jobDescription && (
                            <span className="bg-emerald-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                JD Matched
                            </span>
                        )}
                    </div>
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume Analysis</h2>}
                </div>
                <div className="flex-shrink-0" aria-label={`Overall score: ${feedback.overallScore} out of 100`}>
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {isLoading ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-center">
                            <p className="text-gray-500 mb-2">Failed to load image</p>
                            <button
                                onClick={loadResume}
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            ) : resumeUrl ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt={`Resume preview for ${companyName || 'position'}`}
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            loading="lazy"
                            onError={() => {
                                if (isMountedRef.current) {
                                    setError('Image failed to load');
                                }
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">No image available</p>
                    </div>
                </div>
            )}
        </Link>
    )
}

export default memo(ResumeCard);
