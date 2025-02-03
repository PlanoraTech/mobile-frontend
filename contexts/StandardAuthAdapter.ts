import { Credentials, RegisterData, User, AuthResponse } from '@/types/User';
import * as SecureStore from 'expo-secure-store';

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_tokens'
} as const;

export class StandardAuthAdapter {
    private readonly apiUrl: string;

    constructor(apiUrl: string = 'http:/192.168.61.248:3000') {
        this.apiUrl = apiUrl;
    }

    private async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST',
        body?: object
    ): Promise<T> {
        console.log(body)
        const response = await fetch(`${this.apiUrl}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request to ${endpoint} failed with status ${response.status}`);
        }
        
        return response.json();
    }

    private async storeAuthToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    async register(data: RegisterData): Promise<void> {
        try {
            const response = await this.makeRequest<AuthResponse>('/register', 'POST', data);
            await this.storeAuthToken(response.token);
            console.log('Registration successful');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials: Credentials): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest<AuthResponse>('/login', 'POST', credentials);
            await this.storeAuthToken(response.token);
            console.log("login role" + response.token)
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }

    async logout(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Logout failed');
        }
    }

    async getCurrentUser(): Promise<any | null> {
        try {
            const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
            if (!token) return null;
            console.log("token: "+token);
            const response = await this.makeRequest<any>('/login', 'POST', { token: token });
            return {...response.user, token};
            
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }
}