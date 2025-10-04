import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState, useCallback} from "react";
import {usePuterStore} from "~/lib/puter";
import {imageCache} from "~/lib/imageCache";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadResume = useCallback(async () => {
        try {
            setIsLoading(true);
            
            // Check cache first
            if (imageCache.has(imagePath)) {
                const cachedUrl = imageCache.get(imagePath);
                if (cachedUrl) {
                    setResumeUrl(cachedUrl);
                    setIsLoading(false);
                    return;
                }
            }
            
            const blob = await fs.read(imagePath);
            if(!blob) return;
            
            const url = URL.createObjectURL(blob);
            
            // Cache the URL
            imageCache.set(imagePath, url);
            
            // Clean up previous URL
            setResumeUrl(prev => {
                if (prev && !imageCache.has(imagePath)) {
                    URL.revokeObjectURL(prev);
                }
                return url;
            });
        } catch (error) {
            console.error('Failed to load resume image:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fs, imagePath]);

    useEffect(() => {
        loadResume();
        
        // Cleanup function to revoke URL when component unmounts
        return () => {
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
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
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
            ) : resumeUrl ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt={`Resume preview for ${companyName || 'position'}`}
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            loading="lazy"
                        />
                    </div>
                </div>
            ) : (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Failed to load image</p>
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
