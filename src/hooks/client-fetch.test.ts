import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

describe("clientFetch", () => {
    let clientFetch: typeof import("./client-fetch").default;

    beforeEach(async () => {
        vi.clearAllMocks();
        // Reset module to clear refreshPromise state
        vi.resetModules();
        const module = await import("./client-fetch");
        clientFetch = module.default;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should make a fetch request with credentials", async () => {
        const mockResponse = { ok: true, status: 200 };
        (global.fetch as any).mockResolvedValue(mockResponse);

        await clientFetch("/api/test");

        expect(global.fetch).toHaveBeenCalledWith("/api/test", {
            credentials: "include",
            headers: {},
        });
    });

    it("should prepend slash to paths without it", async () => {
        const mockResponse = { ok: true, status: 200 };
        (global.fetch as any).mockResolvedValue(mockResponse);

        await clientFetch("api/test");

        expect(global.fetch).toHaveBeenCalledWith("/api/test", expect.any(Object));
    });

    it("should handle 401 errors and attempt token refresh", async () => {
        const mockRefreshResponse = { ok: true, status: 200 };
        const mockRetryResponse = { ok: true, status: 200 };

        // First call returns 401, refresh succeeds, retry succeeds
        (global.fetch as any)
            .mockResolvedValueOnce({ ok: false, status: 401 })
            .mockResolvedValueOnce(mockRefreshResponse)
            .mockResolvedValueOnce(mockRetryResponse);

        const response = await clientFetch("/api/test");

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(response).toEqual(mockRetryResponse);
    });

    it("should not attempt refresh for refresh endpoint", async () => {
        const mockResponse = { ok: false, status: 401 };
        (global.fetch as any).mockResolvedValue(mockResponse);

        const response = await clientFetch("/api/auth/refresh");

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(401);
    });

    it("should dispatch logout event if refresh fails", async () => {
        const dispatchEventSpy = vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);

        (global.fetch as any)
            .mockResolvedValueOnce({ ok: false, status: 401 })
            .mockResolvedValueOnce({ ok: false, status: 401 }); // Refresh fails

        await clientFetch("/api/test");

        // Wait for the async dispatch in the finally block
        await new Promise((resolve) => setTimeout(resolve, 1100)); // Wait longer than the setTimeout delay

        expect(dispatchEventSpy).toHaveBeenCalled();
        const calls = dispatchEventSpy.mock.calls;
        const logoutCall = calls.find((call) => {
            const event = call[0] as CustomEvent;
            return event?.type === "auth:logout";
        });
        expect(logoutCall).toBeDefined();

        dispatchEventSpy.mockRestore();
    });

    it("should handle concurrent 401 requests with single refresh", async () => {
        const mockRefreshResponse = { ok: true, status: 200 };
        const mockRetryResponse = { ok: true, status: 200 };

        // Setup: 2 initial 401s, then 1 refresh success, then 2 retry successes
        (global.fetch as any)
            .mockResolvedValueOnce({ ok: false, status: 401 }) // First request gets 401
            .mockResolvedValueOnce({ ok: false, status: 401 }) // Second request gets 401
            .mockResolvedValueOnce(mockRefreshResponse) // Refresh succeeds (shared promise)
            .mockResolvedValueOnce(mockRetryResponse) // First retry succeeds
            .mockResolvedValueOnce(mockRetryResponse); // Second retry succeeds

        // Make two concurrent requests - they should share the same refresh promise
        await Promise.all([clientFetch("/api/test1"), clientFetch("/api/test2")]);

        // Wait for all async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check all fetch calls
        const allCalls = (global.fetch as any).mock.calls;
        const refreshCalls = allCalls.filter((call: any[]) => {
            const url = typeof call[0] === "string" ? call[0] : call[0]?.toString();
            return url === "/api/auth/refresh";
        });

        // Should only call refresh once because both requests share the refreshPromise
        expect(refreshCalls.length).toBe(1);
    });

    it("should preserve custom headers and options", async () => {
        const mockResponse = { ok: true, status: 200 };
        (global.fetch as any).mockResolvedValue(mockResponse);

        await clientFetch("/api/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: "data" }),
        });

        expect(global.fetch).toHaveBeenCalledWith(
            "/api/test",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({ test: "data" }),
            })
        );
    });
});
