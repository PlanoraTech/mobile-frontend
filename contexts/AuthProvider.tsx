import { createContext, useContext, useState, useEffect } from 'react';
import { Credentials, RegisterData, User } from '@/types/User';
import { StandardAuthAdapter } from './StandardAuthAdapter';
import * as SecureStore from 'expo-secure-store';
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: Credentials) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, authAdapter }: { children: React.ReactNode, authAdapter: StandardAuthAdapter }) {
    const [user, setUser] = useState<User | null>(null);
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
        await authAdapter.register(data);
        await loadUser();
    };

    const login = async (credentials: Credentials) => {
        await authAdapter.login(credentials);
        await loadUser();
        return true;
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

