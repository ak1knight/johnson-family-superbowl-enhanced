import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounce utility function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
): T & { cancel: () => void } {
    let timeout: NodeJS.Timeout | null = null;

    const debounced = function (this: any, ...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };

        const callNow = immediate && !timeout;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    } as T & { cancel: () => void };

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

/**
 * Throttle utility function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): T & { cancel: () => void } {
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;

    const throttled = function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = wait - (now - previous);

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    } as T & { cancel: () => void };

    throttled.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        previous = 0;
    };

    return throttled;
}

/**
 * React hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * React hook for debounced callbacks
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    deps: React.DependencyList = []
): T & { cancel: () => void } {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [callback, delay, ...deps]
    ) as T & { cancel: () => void };

    debouncedCallback.cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
}

/**
 * React hook for throttled callbacks
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    deps: React.DependencyList = []
): T {
    const lastRun = useRef(Date.now());

    return useCallback(
        (...args: Parameters<T>) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = Date.now();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [callback, delay, ...deps]
    ) as T;
}

/**
 * React hook for input validation with debouncing
 */
export function useDebouncedValidation<T>(
    value: T,
    validator: (value: T) => string | null,
    delay: number = 300
): {
    isValidating: boolean;
    error: string | null;
    isValid: boolean;
} {
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedValue = useDebounce(value, delay);

    useEffect(() => {
        if (debouncedValue !== value) {
            setIsValidating(true);
            setError(null);
        }
    }, [value, debouncedValue]);

    useEffect(() => {
        if (debouncedValue === value) {
            setIsValidating(false);
            const validationError = validator(debouncedValue);
            setError(validationError);
        }
    }, [debouncedValue, value, validator]);

    return {
        isValidating,
        error,
        isValid: !error && !isValidating
    };
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string, enabled: boolean = false) {
    const renderCount = useRef(0);
    const startTime = useRef<number>(0);

    useEffect(() => {
        if (enabled) {
            renderCount.current++;
            startTime.current = performance.now();
        }
    });

    useEffect(() => {
        if (enabled) {
            const endTime = performance.now();
            const renderTime = endTime - startTime.current;
            
            if (renderTime > 16) { // Longer than 1 frame at 60fps
                console.warn(
                    `${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
                );
            }
        }
    });

    return {
        renderCount: renderCount.current,
        logPerformance: () => {
            if (enabled) {
                console.log(`${componentName} performance:`, {
                    totalRenders: renderCount.current,
                    avgRenderTime: (performance.now() - startTime.current) / renderCount.current
                });
            }
        }
    };
}

/**
 * Memoization utility with LRU cache
 */
export class LRUCache<K, V> {
    private maxSize: number;
    private cache = new Map<K, V>();

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key)!;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return undefined;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

/**
 * Memoize function with LRU cache
 */
export function memoizeWithLRU<T extends (...args: any[]) => any>(
    fn: T,
    maxSize: number = 100,
    getKey?: (...args: Parameters<T>) => string
): T {
    const cache = new LRUCache<string, ReturnType<T>>(maxSize);
    
    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = getKey ? getKey(...args) : JSON.stringify(args);
        
        let result = cache.get(key);
        if (result === undefined) {
            result = fn(...args) as ReturnType<T>;
            if (result !== undefined) {
                cache.set(key, result);
            }
        }
        
        return result as ReturnType<T>;
    }) as T;
}