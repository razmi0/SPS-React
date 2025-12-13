import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./auth-context";
import clientFetch from "./client-fetch";

// Mock clientFetch
vi.mock("./client-fetch", () => ({
    default: vi.fn(),
}));

const TestComponent = () => {
    const auth = useAuth();
    return (
        <div>
            <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : "null"}</div>
            <button
                onClick={async () => {
                    const result = await auth.login("test@example.com", "password");
                    console.log(result);
                }}>
                Login
            </button>
        </div>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Ensure clientFetch always returns a valid response by default
        (clientFetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Not authenticated" }),
        });
    });

    afterEach(() => {
        // Clean up any pending async operations
        vi.clearAllTimers();
    });

    it("should throw error when useAuth is used outside provider", () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useAuth must be used within an AuthProvider");

        consoleSpy.mockRestore();
    });

    it("should provide auth context when used within provider", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("user")).toBeInTheDocument();
    });

    it("should fetch user profile on mount", async () => {
        const mockUser = {
            email: "test@example.com",
            lastName: "Doe",
            firstName: "John",
            company: null,
            newsletterOptin: false,
            isVerified: false,
            isAnonymous: false,
            roles: ["ROLE_USER"],
            createdAt: { date: "2024-01-01", timezone_type: 3, timezone: "UTC" },
            updatedAt: null,
        };

        (clientFetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockUser }),
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(
            () => {
                expect(clientFetch).toHaveBeenCalledWith("/api/user/me");
            },
            { timeout: 2000 }
        );

        // Wait for any async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle login successfully", async () => {
        const mockUser = {
            email: "test@example.com",
            lastName: "Doe",
            firstName: "John",
            company: null,
            newsletterOptin: false,
            isVerified: false,
            isAnonymous: false,
            roles: ["ROLE_USER"],
            createdAt: { date: "2024-01-01", timezone_type: 3, timezone: "UTC" },
            updatedAt: null,
        };

        (clientFetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Login successful" }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockUser }),
            });

        const { useAuth } = await import("./auth-context");
        let authResult: any;

        const LoginTest = () => {
            const auth = useAuth();
            return (
                <button
                    onClick={async () => {
                        authResult = await auth.login("test@example.com", "password");
                    }}>
                    Login
                </button>
            );
        };

        render(
            <AuthProvider>
                <LoginTest />
            </AuthProvider>
        );

        // Wait for initial profile fetch
        await waitFor(() => {
            expect(clientFetch).toHaveBeenCalled();
        });

        // Clear mocks to test login
        vi.clearAllMocks();
        (clientFetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Login successful" }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockUser }),
            });

        const button = screen.getByText("Login");
        button.click();

        await waitFor(() => {
            expect(authResult).toBeDefined();
            expect(authResult?.success).toBe(true);
        });
    });

    it("should handle login failure", async () => {
        // Mock initial profile fetch
        (clientFetch as any).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Not authenticated" }),
        });

        const { useAuth } = await import("./auth-context");
        let authResult: any;

        const LoginTest = () => {
            const auth = useAuth();
            return (
                <button
                    onClick={async () => {
                        authResult = await auth.login("test@example.com", "wrong");
                    }}>
                    Login
                </button>
            );
        };

        render(
            <AuthProvider>
                <LoginTest />
            </AuthProvider>
        );

        // Wait for initial profile fetch
        await waitFor(() => {
            expect(clientFetch).toHaveBeenCalledWith("/api/user/me");
        });

        // Set up login failure - this will be the next call
        (clientFetch as any).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Invalid credentials" }),
        });

        const button = screen.getByText("Login");
        button.click();

        await waitFor(
            () => {
                expect(authResult).toBeDefined();
                expect(authResult?.success).toBe(false);
            },
            { timeout: 3000 }
        );
    });

    it("should handle logout", async () => {
        (clientFetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: null }),
        });

        const { useAuth } = await import("./auth-context");
        let userAfterLogout: any;

        const LogoutTest = () => {
            const auth = useAuth();
            return (
                <button
                    onClick={async () => {
                        await auth.logout();
                        userAfterLogout = auth.user;
                    }}>
                    Logout
                </button>
            );
        };

        render(
            <AuthProvider>
                <LogoutTest />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(clientFetch).toHaveBeenCalled();
        });

        vi.clearAllMocks();
        (clientFetch as any).mockResolvedValueOnce({
            ok: true,
        });

        const button = screen.getByText("Logout");
        button.click();

        await waitFor(() => {
            expect(clientFetch).toHaveBeenCalledWith("/api/auth/logout", {
                method: "POST",
            });
            expect(userAfterLogout).toBeNull();
        });
    });

    it("should update user data", async () => {
        const mockUser = {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            company: null,
            newsletterOptin: false,
            isVerified: false,
            isAnonymous: false,
            roles: ["ROLE_USER"],
            createdAt: { date: "2024-01-01", timezone_type: 3, timezone: "UTC" },
            updatedAt: null,
        };

        (clientFetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockUser }),
        });

        const { useAuth } = await import("./auth-context");

        const UpdateTest = () => {
            const auth = useAuth();
            return (
                <div>
                    <div data-testid="user-firstname">{auth.user?.firstName}</div>
                    <button
                        onClick={() => {
                            auth.updateUser({ firstName: "Jane" });
                        }}>
                        Update
                    </button>
                </div>
            );
        };

        render(
            <AuthProvider>
                <UpdateTest />
            </AuthProvider>
        );

        // Wait for initial profile fetch and user to be set
        await waitFor(
            () => {
                expect(screen.getByTestId("user-firstname")).toHaveTextContent("John");
            },
            { timeout: 2000 }
        );

        const button = screen.getByText("Update");
        button.click();

        await waitFor(
            () => {
                expect(screen.getByTestId("user-firstname")).toHaveTextContent("Jane");
            },
            { timeout: 2000 }
        );

        // Wait for any async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
    });
});
