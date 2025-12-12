import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { APIResponse } from "../types";
import clientFetch from "./client-fetch";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
    user: APIResponse["USER_PROFILE"] | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (form: RegisterForm) => Promise<AuthResponse>;
    updateUser: (updatedFields: Partial<APIResponse["USER_PROFILE"]>) => void;
    logout: () => Promise<void>;
}

interface RegisterForm {
    company: string;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type AuthResponse = {
    success: boolean;
    message: string;
    errors?: { [key: string]: string };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<APIResponse["USER_PROFILE"] | null>(null);

    const fetchProfile = async () => {
        const res = await clientFetch("/api/user/me");
        if (res.ok) {
            const json = await res.json();
            setUser(json.data); // Utiliser "data", pas tout le json
        } else {
            setUser(null); // Si erreur, on reset l'utilisateur
        }
    };

    useEffect(() => {
        fetchProfile();

        // Listen for logout events from token refresh failures
        const handleLogout = () => {
            setUser(null);
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => {
            window.removeEventListener("auth:logout", handleLogout);
        };
    }, []);

    const login = async (email: string, password: string): Promise<AuthResponse> => {
        const res = await clientFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        try {
            const json = await res.json();

            if (res.ok) {
                await fetchProfile();
                return { success: true, message: json.message || "Connexion réussie" };
            } else {
                return { success: false, message: json.message || "Erreur lors de la connexion" };
            }
        } catch (error) {
            return { success: false, message: "Erreur de communication avec le serveur" };
        }
    };

    const register = async (form: RegisterForm): Promise<AuthResponse> => {
        const res = await clientFetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        try {
            const json = await res.json();

            if (res.status === 201) {
                await fetchProfile();
                return { success: true, message: json.message || "Inscription réussie" };
            } else {
                return {
                    success: false,
                    message: json.message || "Erreur lors de l'inscription",
                    errors: json.errors || {},
                };
            }
        } catch (error) {
            return { success: false, message: "Erreur de communication avec le serveur" };
        }
    };

    const updateUser = (updatedFields: Partial<APIResponse["USER_PROFILE"]>) => {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : prevUser));
    };

    const logout = async () => {
        await clientFetch("/api/auth/logout", { method: "POST" });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
