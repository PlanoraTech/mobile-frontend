
import { Credentials, RegisterData} from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class JWTAuthAdapter {
    constructor(private apiUrl: string = 'localhost:3000') {}

    async register(data: RegisterData) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
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
                refreshToken: responseData.refreshToken,
            }));
    
            return responseData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(credentials: Credentials) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
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
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }));

            return data;
        } catch (error) {
            console.error('Hiba a bejelentkezés során: ', error);
            throw error;
        }
    }

    async logout() {
        await AsyncStorage.removeItem('auth_tokens');
    }

    async getCurrentUser() {
        try {
            const tokens = await AsyncStorage.getItem('auth_tokens');
            if (!tokens) return null;

            const { accessToken } = JSON.parse(tokens);
            const response = await fetch(`${this.apiUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Nem sikerült betölteni a jelenlegi felhasználót');
            }
            const user = await response.json();
            user.accessToken = accessToken;
            return user
        } catch (error) {
            console.error('Hiba a felhasználó betöltése során: ', error);
            return null;
        }
    }

    

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
}