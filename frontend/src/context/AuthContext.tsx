import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
}

interface AuthContextType extends AuthState {
    login: (token: string, userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tokens that are considered invalid (from prototype era)
const INVALID_TOKENS = ['simulated-token', 'dummy-token-for-mvp'];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthState>(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        // Invalidate stale prototype tokens
        if (!token || INVALID_TOKENS.includes(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { isAuthenticated: false, token: null, user: null };
        }
        return {
            isAuthenticated: true,
            token: token,
            user: user ? JSON.parse(user) : null,
        };
    });

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({ isAuthenticated: true, token, user: userData });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ isAuthenticated: false, token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
