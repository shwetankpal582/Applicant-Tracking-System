import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import { useToast } from "~/hooks/useToast";
import Toast from "~/components/Toast";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const { toasts, addToast, removeToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ file }: { file: File  }) => {
        try {
            setIsProcessing(true);
            setStatusText('Uploading the file...');

            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                addToast({ type: 'error', message: 'Failed to upload file. Please try again.' });
                setStatusText('Error: Failed to upload file');
                return;
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                const errorMsg = imageFile.error || 'Failed to convert PDF to image. Please check your file.';
                addToast({ type: 'error', message: errorMsg });
                setStatusText(`Error: ${errorMsg}`);
                return;
            }

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) {
                addToast({ type: 'error', message: 'Failed to upload image. Please try again.' });
                setStatusText('Error: Failed to upload image');
                return;
            }

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing...');

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions()
            );
            if (!feedback) {
                addToast({ type: 'error', message: 'Failed to analyze resume. Please try again.' });
                setStatusText('Error: Failed to analyze resume');
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            try {
                data.feedback = JSON.parse(feedbackText);
            } catch (parseError) {
                console.error('Failed to parse feedback:', parseError);
                addToast({ type: 'error', message: 'Failed to parse analysis results. Please try again.' });
                setStatusText('Error: Failed to parse analysis results');
                return;
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            
            addToast({ type: 'success', message: 'Resume analyzed successfully!' });
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
            addToast({ type: 'error', message: errorMessage });
            setStatusText(`Error: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        if(!file) return;

        handleAnalyze({ file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            
            {/* Toast notifications */}
            {toasts.map((toast) => (
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
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
