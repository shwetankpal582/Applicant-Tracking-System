import { type FormEvent, useState, useEffect } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { useToast } from "~/hooks/useToast";
import Toast from "~/components/Toast";
import { redactText } from "~/lib/redact";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv, refreshCredits, deductCredit, updateJobStatus, credits } = usePuterStore();
    const navigate = useNavigate();
    const { toasts, addToast, removeToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [atsType, setAtsType] = useState('Standard');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (auth.isAuthenticated) {
            refreshCredits();
        }
    }, [auth.isAuthenticated, refreshCredits]);

    const generateFileHash = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ file, jobDescription, atsType }: { file: File, jobDescription?: string, atsType: string }) => {
        if (credits <= 0) {
            addToast({ type: 'error', message: 'Insufficient AI credits. Please upgrade.' });
            return;
        }

        const uuid = generateUUID();
        try {
            setIsProcessing(true);
            await updateJobStatus(uuid, 'pending');

            setStatusText('Applying Privacy Redaction Shield...');
            const safeJD = jobDescription ? redactText(jobDescription) : '';
            await new Promise(r => setTimeout(r, 600));

            setStatusText('Checking for existing analysis...');
            const fileHash = await generateFileHash(file);
            const cacheKey = `cache:${fileHash}:${atsType}:${safeJD.slice(0, 50)}`;
            const cachedResult = await kv.get(cacheKey);

            if (cachedResult) {
                setStatusText('Found cached analysis, redirecting...');
                const data = JSON.parse(cachedResult);
                data.id = uuid;
                data.timestamp = Date.now();
                await kv.set(`resume:${uuid}`, JSON.stringify(data));
                addToast({ type: 'success', message: 'Loaded cached analysis!' });
                await updateJobStatus(uuid, 'completed');
                navigate(`/resume/${uuid}`);
                return;
            }

            await updateJobStatus(uuid, 'processing');
            setStatusText('Uploading the file...');

            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) {
                addToast({ type: 'error', message: 'Failed to upload file.' });
                await updateJobStatus(uuid, 'failed');
                return;
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            const uploadedImage = imageFile.file ? await fs.upload([imageFile.file]) : null;

            setStatusText(`Querying ${atsType} AI Model...`);
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions(safeJD, atsType)
            );

            if (!feedback) {
                addToast({ type: 'error', message: 'AI failed to respond.' });
                await updateJobStatus(uuid, 'failed');
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            const resumeData: Resume = {
                id: uuid,
                fileHash,
                jobDescription: safeJD,
                atsType,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage?.path || '',
                feedback: JSON.parse(feedbackText),
                timestamp: Date.now(),
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));
            await kv.set(cacheKey, JSON.stringify(resumeData));
            await deductCredit();

            setStatusText('Analysis complete, redirecting...');
            await updateJobStatus(uuid, 'completed');
            addToast({ type: 'success', message: 'Resume analyzed successfully!' });
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error('Upload error:', error);
            addToast({ type: 'error', message: 'An unexpected error occurred.' });
            await updateJobStatus(uuid, 'failed');
        } finally {
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        handleAnalyze({ file, jobDescription, atsType });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            {/* Toast notifications */}
            {toasts.map((toast: any) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}

            <section className="main-section">
                <div className="page-heading py-16">
                    <div className="flex justify-between items-center w-full max-w-2xl mx-auto mb-4 bg-white/50 p-2 rounded-2xl border border-white/20 backdrop-blur-sm">
                        <h1 className="text-2xl !mb-0">Enterprise-Grade Audit</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase text-gray-400">Available Credits</span>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-500/30">{credits}</span>
                        </div>
                    </div>
                    {isProcessing ? (
                        <>
                            <h2 className="animate-pulse">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-[400px] mx-auto opacity-80" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score, JD alignment, and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 max-w-2xl mx-auto w-full">
                            <div className="form-div">
                                <label htmlFor="uploader" className="text-lg font-semibold">Upload Resume (PDF)</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="form-div">
                                    <label htmlFor="ats-type" className="text-lg font-semibold">ATS Model Target</label>
                                    <select
                                        id="ats-type"
                                        value={atsType}
                                        onChange={(e) => setAtsType(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 bg-white/50 focus:border-blue-500 focus:ring-0 transition-all outline-none font-bold uppercase tracking-widest text-xs"
                                    >
                                        <option value="Standard">Standard (General)</option>
                                        <option value="Greenhouse">Greenhouse (Strict Formatting)</option>
                                        <option value="Workday">Workday (Parser Optimized)</option>
                                        <option value="Lever">Lever (Keyword Heavy)</option>
                                        <option value="Taleo">Taleo (Enterprise Legacy)</option>
                                    </select>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="jd" className="text-lg font-semibold">Job Description (Optional)</label>
                                    <textarea
                                        id="jd"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste JD for alignment matching..."
                                        className="w-full h-14 p-4 rounded-xl border-2 border-dashed border-gray-300 bg-white/50 focus:border-blue-500 focus:ring-0 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                className={`primary-button flex items-center justify-center gap-2 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={!file}
                            >
                                {file ? '🚀 Analyze Resume' : '📎 Please select a file'}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
