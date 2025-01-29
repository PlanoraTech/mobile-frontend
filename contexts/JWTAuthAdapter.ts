
import { Credentials, RegisterData } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class JWTAuthAdapter {
    constructor(private apiUrl: string = 'http://192.168.11.153:3000') { }

    async register(data: RegisterData) {
        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const responseData = await response.json();

            await AsyncStorage.setItem('auth_tokens', JSON.stringify({
                accessToken: responseData.accessToken,
            }));
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials: Credentials) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                throw new Error('Sikertelen bejelentkezés');
            }

            const data = await response.json();
            await AsyncStorage.setItem('auth_tokens', JSON.stringify({
                token: data.token,
            }));
        } catch (error) {
            console.error('Hiba a bejelentkezés során: ', error);
            throw error;
        }
    }

    async logout() {
        await AsyncStorage.removeItem('auth_tokens');
        console.log('Kijelentkezve');
    }

    async getCurrentUser() {
        try {
            const token = await AsyncStorage.getItem('auth_tokens');
            if (!token) return null;
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: token,
            });

            if (!response.ok) {
                console.log(response);
                throw new Error('Nem sikerült betölteni a jelenlegi felhasználót');
            }
            const user = await response.json();
            user.token = token;
            return user
        } catch (error) {
            console.error('Hiba a felhasználó betöltése során: ', error);
            return null;
        }
    }


    /*
    async refreshToken() {
        try {
            const tokens = await AsyncStorage.getItem('auth_tokens');
            if (!tokens) return null;

            const { refreshToken } = JSON.parse(tokens);
            const response = await fetch(`${this.apiUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Nem sikerült frissíteni a tokent.');
            }

            const newTokens = await response.json();
            await AsyncStorage.setItem('auth_tokens', JSON.stringify(newTokens));
            return newTokens;
        } catch (error) {
            console.error('Token frissítési hiba: ', error);
            throw error;
        }
    }
        */
}