import * as SecureStore from 'expo-secure-store';

export interface User {
    credentials?: AuthData,
    token?: string
    institutions: string[]
    role: string
}

export interface AuthData {
    email: string,
    password: string
}

export interface AuthResponse {
    token: string;
    user: User;
}

export class StandardAuthAdapter {
    private readonly apiUrl: string;

    constructor(apiUrl: string = 'http://192.168.61.192:3000') {
        this.apiUrl = apiUrl;
    }


    private async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST',
        body?: object
    ): Promise<T> {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`Request to ${endpoint} failed with status ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }


    private async storeAuthToken(token: string): Promise<void> {
        await SecureStore.setItemAsync('auth_tokens', token);
    }


    async register(data: AuthData): Promise<void> {
        try {
            const response = await this.makeRequest<AuthResponse>('/register', 'POST', data);
            await this.storeAuthToken(response.token);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials: AuthData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest<AuthResponse>('/login', 'POST', credentials);
            await this.storeAuthToken(response.token);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }

    async logout(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync('auth_tokens');
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Logout failed');
        }
    }

    async getCurrentUser(): Promise<any | null> {
        try {
            const token = await SecureStore.getItemAsync('auth_tokens');
            if (!token) return null;
            const response = await this.makeRequest<any>('/login', 'POST', { token: token });
            return { ...response.user, token };


        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }
}