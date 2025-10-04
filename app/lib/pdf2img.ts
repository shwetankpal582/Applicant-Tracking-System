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

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // Wait for idle time before starting heavy processing
        await waitForIdle();
        
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // Reduce scale to improve performance (was 4, now 2)
        const viewport = page.getViewport({ scale: 2 });
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
        await page.render({ canvasContext: context!, viewport }).promise;

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
                    0.8 // Reduced quality for better performance
                );
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(createBlob, { timeout: 3000 });
            } else {
                setTimeout(createBlob, 0);
            }
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
