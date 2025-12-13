/**
 * Client-side fetch utility
 * Uses relative paths (proxied in dev via Vite proxy, direct and relative in production)
 * Automatically includes credentials for cookie-based authentication
 * Handles token refresh on 401 errors
 * Throttles requests per endpoint to prevent spam
 */

let refreshPromise: Promise<boolean> | null = null;

// Throttle tracking: maps endpoint paths to their last call time and pending timeout
const throttleMap = new Map<string, { lastCall: number; timeoutId: ReturnType<typeof setTimeout> | null }>();

// Throttle delay in milliseconds (1000ms = 1 second minimum between calls to the same endpoint)
const THROTTLE_DELAY = 1000;

/**
 * Throttles a request to a specific endpoint
 * Returns a promise that resolves when the request can proceed
 */
function throttleRequest(path: string): Promise<void> {
    return new Promise((resolve) => {
        const now = Date.now();
        const throttleInfo = throttleMap.get(path);

        if (!throttleInfo) {
            // First request to this endpoint, allow it immediately
            throttleMap.set(path, { lastCall: now, timeoutId: null });
            resolve();
            return;
        }

        const timeSinceLastCall = now - throttleInfo.lastCall;

        if (timeSinceLastCall >= THROTTLE_DELAY) {
            // Enough time has passed, allow the request
            throttleInfo.lastCall = now;
            resolve();
        } else {
            // Clear any pending timeout
            if (throttleInfo.timeoutId) {
                clearTimeout(throttleInfo.timeoutId);
            }
            // Schedule the request for when the delay period has passed
            throttleInfo.timeoutId = setTimeout(() => {
                throttleInfo.lastCall = Date.now();
                throttleInfo.timeoutId = null;
                resolve();
            }, THROTTLE_DELAY - timeSinceLastCall);
        }
    });
}

async function attemptRefresh(): Promise<boolean> {
    // If already refreshing, wait for the existing refresh
    if (refreshPromise) {
        return refreshPromise;
    }

    // Start a new refresh
    refreshPromise = (async () => {
        try {
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                return true;
            } else {
                // Refresh failed, clear user state
                if (typeof window !== "undefined") {
                    // Dispatch a custom event to notify auth context
                    window.dispatchEvent(new CustomEvent("auth:logout"));
                }
                return false;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("auth:logout"));
            }
            return false;
        } finally {
            // Reset refresh state after a delay to allow concurrent requests to complete
            setTimeout(() => {
                refreshPromise = null;
            }, 1000);
        }
    })();

    return refreshPromise;
}

export default async function clientFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let path = input.toString();
    if (path[0] !== "/") path = `/${path}`;

    // Skip refresh for the refresh endpoint itself to avoid infinite loops
    const isRefreshEndpoint = path === "/api/auth/refresh" || path.includes("/api/auth/refresh");

    // Throttle requests (except for refresh endpoint to avoid blocking auth)
    if (!isRefreshEndpoint) {
        await throttleRequest(path);
    }

    const options: RequestInit = {
        credentials: "include",
        ...init,
        headers: {
            ...init?.headers,
        },
    };

    let response = await fetch(path, options);

    // If we get a 401 and it's not the refresh endpoint, try to refresh the token
    if (response.status === 401 && !isRefreshEndpoint) {
        const refreshSuccess = await attemptRefresh();
        if (refreshSuccess) {
            // Retry the original request with the new token
            response = await fetch(path, options);
        }
    }

    return response;
}
