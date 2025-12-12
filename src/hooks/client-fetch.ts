/**
 * Client-side fetch utility that uses VITE_API_URL from environment variables
 * Automatically includes credentials for cookie-based authentication
 * Handles token refresh on 401 errors
 */

let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
    // If already refreshing, wait for the existing refresh
    if (refreshPromise) {
        return refreshPromise;
    }

    // Start a new refresh
    refreshPromise = (async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "";
            const response = await fetch(`${apiUrl}/api/auth/refresh`, {
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

    // Get API URL from environment, fallback to empty string for proxy in dev
    const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_API_URL || "" : ""; // Production: relative paths (same domain)

    // Merge options with defaults
    const options: RequestInit = {
        credentials: "include", // Always include cookies for authentication
        ...init,
        headers: {
            ...init?.headers,
        },
    };

    let response = await fetch(`${apiUrl}${path}`, options);

    // If we get a 401 and it's not the refresh endpoint, try to refresh the token
    if (response.status === 401 && !isRefreshEndpoint) {
        const refreshSuccess = await attemptRefresh();

        if (refreshSuccess) {
            // Retry the original request with the new token
            response = await fetch(`${apiUrl}${path}`, options);
        }
    }

    return response;
}
