// Simple image cache to prevent re-downloading the same images
class ImageCache {
    private cache = new Map<string, string>();
    private maxSize = 20; // Reduced maximum number of cached images to prevent memory issues
    private accessOrder = new Map<string, number>(); // Track access order for LRU
    private accessCounter = 0;

    set(key: string, url: string): void {
        // Remove oldest entries if cache is full (LRU eviction)
        if (this.cache.size >= this.maxSize) {
            // Find the least recently used item
            let oldestKey = '';
            let oldestAccess = Infinity;
            
            for (const [cacheKey, accessTime] of this.accessOrder) {
                if (accessTime < oldestAccess) {
                    oldestAccess = accessTime;
                    oldestKey = cacheKey;
                }
            }
            
            if (oldestKey) {
                const oldUrl = this.cache.get(oldestKey);
                if (oldUrl) URL.revokeObjectURL(oldUrl);
                this.cache.delete(oldestKey);
                this.accessOrder.delete(oldestKey);
            }
        }
        
        this.cache.set(key, url);
        this.accessOrder.set(key, ++this.accessCounter);
    }

    get(key: string): string | undefined {
        const url = this.cache.get(key);
        if (url) {
            // Update access time for LRU
            this.accessOrder.set(key, ++this.accessCounter);
        }
        return url;
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        // Revoke all object URLs before clearing
        this.cache.forEach(url => URL.revokeObjectURL(url));
        this.cache.clear();
        this.accessOrder.clear();
        this.accessCounter = 0;
    }

    delete(key: string): boolean {
        const url = this.cache.get(key);
        if (url) URL.revokeObjectURL(url);
        this.accessOrder.delete(key);
        return this.cache.delete(key);
    }

    // Get cache statistics for debugging
    getStats(): { size: number; maxSize: number; keys: string[] } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            keys: Array.from(this.cache.keys())
        };
    }
}

export const imageCache = new ImageCache();
