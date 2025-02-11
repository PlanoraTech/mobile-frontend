import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/(tabs)/login';
import * as AsyncStorage from '@/__mocks__/@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { userEvent } from '@testing-library/react-native';
import '@testing-library/jest-dom'
import { router } from 'expo-router';


jest.mock('@/contexts/AuthProvider');

jest.mock('@/assets/styles/authStyles', () => ({
    createAuthStyles: jest.fn(() => ({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    })),
}));

jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn()
    },
    Link: () => null
}));


describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockImplementation(() => ({
            login: jest.fn(),
        }));

    });

    test('renders correctly', () => {
        (AsyncStorage.default.getItem as jest.Mock).mockResolvedValue(null);
        render(<LoginScreen />);
    });

    test('login button fails to call login if email is invalid', async () => {
        const user = userEvent.setup();
        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));
        await user.type(emailInput, 'testtest.com');
        await user.type(passwordInput, 'StrongPassword123!');
        await user.press(loginButton);
        expect(loginScreen.getByTestId('email-error').props.children).toBe('Érvényes emailt adj meg!');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    test('login button fails to call login if password is invalid', async () => {
        const user = userEvent.setup();
        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));
        await user.type(emailInput, 'test@test.com');
        await user.type(passwordInput, '123');
        await user.press(loginButton);
        expect(loginScreen.getByTestId('password-error').props.children).toBe('A jelszónak minimum 6 betűből kell állnia!');
        expect(mockLogin).not.toHaveBeenCalled();
    });



    test('login button calls login with correct data', async () => {
        const user = userEvent.setup();
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));

        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockReplace = jest.fn();
        (router as jest.Mocked<typeof router>).replace.mockImplementation(mockReplace);
        await user.type(emailInput, 'test@test.com');
        await user.type(passwordInput, 'StrongPassword123!');
        await user.press(loginButton);
        expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'StrongPassword123!' });
        expect(mockReplace).toHaveBeenCalledWith('/profile');
    });

});









