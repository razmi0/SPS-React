import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const calcPriceFromString = (n1: string | number, n2: string | number): number => {
    const temp1 = typeof n1 === "string" ? parseFloat(n1) : n1;
    const temp2 = typeof n2 === "string" ? parseFloat(n2) : n2;
    return temp1 * temp2;
};

/**
 * Throttle function: limits how often a function can be called
 * @param func - The function to throttle
 * @param delay - Minimum time (ms) between function calls
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(func: T, delay: number): T {
    let lastCall = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return ((...args: Parameters<T>) => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;

        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func(...args);
        } else {
            // Clear any pending timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Schedule the call for when the delay period has passed
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func(...args);
            }, delay - timeSinceLastCall);
        }
    }) as T;
}

/**
 * Debounce function: delays execution until after a period of inactivity
 * @param func - The function to debounce
 * @param delay - Time (ms) to wait after the last call before executing
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return ((...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    }) as T;
}
