// Simple image cache to prevent re-downloading the same images
class ImageCache {
    private cache = new Map<string, string>();
    private maxSize = 50; // Maximum number of cached images

    set(key: string, url: string): void {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                const oldUrl = this.cache.get(firstKey);
                if (oldUrl) URL.revokeObjectURL(oldUrl);
                this.cache.delete(firstKey);
            }
        }
        
        this.cache.set(key, url);
    }

    get(key: string): string | undefined {
        return this.cache.get(key);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        // Revoke all object URLs before clearing
        this.cache.forEach(url => URL.revokeObjectURL(url));
        this.cache.clear();
    }

    delete(key: string): boolean {
        const url = this.cache.get(key);
        if (url) URL.revokeObjectURL(url);
        return this.cache.delete(key);
    }
}

export const imageCache = new ImageCache();
