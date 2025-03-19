import * as SecureStore from 'expo-secure-store';
import { BASE_URL_AUTH } from '@/constants';
import { unsubscribeFromPushNotifications } from '@/utils/notificationUtil';

export interface User {
    credentials?: AuthData,
    token?: string
    institutions: {
        institutionId: string,
        role: string,
        presentatorId: string | null
    }[]
    role: string
}

export interface AuthData {
    email: string,
    password: string
}

export interface AuthResponse {
    token: string;
    user: User;
    status: number;
}

export class StandardAuthAdapter {
    private readonly apiUrl: string;

    constructor(apiUrl: string = BASE_URL_AUTH) {
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
                console.error(`Request to ${endpoint} failed with status ${response.status}`);
                if (response.status === 409) {
                    throw new Error('A felhasználó már létezik');
                }

                if (response.status === 404) {
                    throw new Error('Hibás email cím vagy jelszó');
                }

                if (response.status === 500) {
                    throw new Error('Szerver hiba. Kérlek próbáld újra később.');
                }

                throw new Error('Valami hiba történt... Kérlek próbáld újra később.');
            }
            return response.json();
        } catch (error: any) {
            console.error('Request error:', error);
            throw new Error(error.message);
        }
    }

    private async storeAuthToken(token: string): Promise<void> {
        await SecureStore.setItemAsync('auth_tokens', token);
    }

    async register(data: AuthData): Promise<void> {
        try {
            const response = await this.makeRequest<AuthResponse>('/register', 'POST', data);
            await this.storeAuthToken(response.token);
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Regisztráció sikertelen');
        }
    }

    async login(credentials: AuthData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest<AuthResponse>('/login', 'POST', credentials);
            await this.storeAuthToken(response.token);
            return response;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Sikertelen belépés');
        }
    }

    async logout(): Promise<void> {
        try {
            const token = await SecureStore.getItemAsync('auth_tokens');
            unsubscribeFromPushNotifications(token!);
            await SecureStore.deleteItemAsync('auth_tokens');
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Sikertelen kijelentkezés');
        }
    }

    async getCurrentUser(): Promise<any | null> {
        try {
            const token = await SecureStore.getItemAsync('auth_tokens');
            if (!token) return null;
            const response = await this.makeRequest<any>('/login', 'POST', { token: token });
            console.log('Current user:', response.user);
            return { ...response.user, token };
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }
}