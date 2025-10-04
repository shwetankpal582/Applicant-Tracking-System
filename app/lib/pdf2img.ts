export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

// Helper function to wait for idle time
function waitForIdle(): Promise<void> {
    return new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => resolve(), { timeout: 5000 });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => resolve(), 0);
        }
    });
}

// Helper function to yield control back to the browser
function yieldToMain(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 0);
    });
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // Wait for idle time before starting heavy processing
        await waitForIdle();
        
        const lib = await loadPdfJs();

        // Yield control after loading PDF.js
        await yieldToMain();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        
        // Yield control after loading PDF
        await yieldToMain();
        
        const page = await pdf.getPage(1);

        // Reduce scale to improve performance (was 4, now 1.5 for better balance)
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "medium"; // Reduced from "high"
        }

        // Use requestIdleCallback for rendering
        await waitForIdle();
        
        // Break up the rendering process to prevent blocking
        const renderTask = page.render({ 
            canvasContext: context!, 
            viewport,
            // Add interrupt handling for better performance
            intent: 'display'
        });
        
        // Yield control during rendering
        await yieldToMain();
        await renderTask.promise;

        return new Promise((resolve) => {
            // Use requestIdleCallback for blob creation
            const createBlob = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Create a File from the blob with the same name as the pdf
                            const originalName = file.name.replace(/\.pdf$/i, "");
                            const imageFile = new File([blob], `${originalName}.png`, {
                                type: "image/png",
                            });

                            resolve({
                                imageUrl: URL.createObjectURL(blob),
                                file: imageFile,
                            });
                        } else {
                            resolve({
                                imageUrl: "",
                                file: null,
                                error: "Failed to create image blob",
                            });
                        }
                    },
                    "image/png",
                    0.7 // Further reduced quality for better performance
                );
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(createBlob, { timeout: 3000 });
            } else {
                setTimeout(createBlob, 0);
            }
        });
    } catch (err) {
        console.error('PDF conversion error:', err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
