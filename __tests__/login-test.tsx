import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '@/app/(tabs)/login';
import * as AsyncStorage from '@/__mocks__/@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';




jest.mock('@/contexts/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        login: jest.fn(),
    })),
}));

jest.mock('@/assets/styles/authStyles', () => ({
    createAuthStyles: jest.fn(() => ({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    })),
}));

describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        (AsyncStorage.default.getItem as jest.Mock).mockResolvedValue(null);
        render(<LoginScreen />);
    });

    test('login button fails to call login if email is invalid', () => {
        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));
        fireEvent.changeText(emailInput, 'testtest.com');
        fireEvent.changeText(passwordInput, 'StrongPassword123!');
        fireEvent.press(loginButton);
        expect(loginScreen.getByTestId('email-error').props.children).toBe('Érvényes emailt adj meg!');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    test('login button fails to call login if password is invalid', () => {
        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));
        fireEvent.changeText(emailInput, 'test@test.com');
        fireEvent.changeText(passwordInput, '123');
        fireEvent.press(loginButton);
        expect(loginScreen.getByTestId('password-error').props.children).toBe('A jelszónak minimum 6 betűből kell állnia!');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    test('login button calls login if email and password are valid', () => {
        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));
        fireEvent.changeText(emailInput, 'test@test.com');
        fireEvent.changeText(passwordInput, 'StrongPassword123!');
        fireEvent.press(loginButton);
        expect(mockLogin).toHaveBeenCalled();
    });

    test('login button calls login with correct data', () => {
        const mockLogin = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                login: mockLogin, user: null, loading: false, logout: jest.fn(), register: jest.fn()
            }));

        const loginScreen = render(<LoginScreen />);
        const loginButton = loginScreen.getByTestId('login-button');
        const emailInput = loginScreen.getByPlaceholderText('Email');
        const passwordInput = loginScreen.getByPlaceholderText('Jelszó');

        fireEvent.changeText(emailInput, 'test@test.com');
        fireEvent.changeText(passwordInput, 'StrongPassword123!');
        fireEvent.press(loginButton);
        expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'StrongPassword123!' });
    });
});









