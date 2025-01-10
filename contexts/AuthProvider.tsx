import { createContext, useContext, useState, useEffect } from 'react';
import { Credentials, RegisterData, User } from '@/types/User';
import { JWTAuthAdapter } from './JWTAuthAdapter';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: Credentials) => Promise<any>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, authAdapter }: { children: React.ReactNode, authAdapter: JWTAuthAdapter }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await authAdapter.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Hiba a felhasználó betöltése során:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        const result = await authAdapter.register(data);
        await loadUser();
        return result;
    };

    const login = async (credentials: Credentials) => {
        const result = await authAdapter.login(credentials);
        await loadUser();
        return result;
    };

    const logout = async () => {
        await authAdapter.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error();
    }
    return context;
};

