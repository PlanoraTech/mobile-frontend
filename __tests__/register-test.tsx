import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/app/(tabs)/register';
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


describe('Register', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockImplementation(() => ({
            register: jest.fn(),
        }));
    });

    test('renders correctly', () => {
        render(<RegisterScreen />);
    });

    test('register button fails to call register if email is invalid', async () => {
        const user = userEvent.setup();
        const registerScreen = render(<RegisterScreen />);
        const registerButton = registerScreen.getByTestId('register-button');
        const emailInput = registerScreen.getByPlaceholderText('Email');
        const passwordInput = registerScreen.getByPlaceholderText('Jelszó');
        const mockRegister = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                register: mockRegister, user: null, loading: false, logout: jest.fn(), login: jest.fn()
            }));
        await user.type(emailInput, 'invalid-email');
        await user.type(passwordInput, '123');
        await user.press(registerButton);
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('register button fails to call register if password is invalid', async () => {
        const user = userEvent.setup();
        const registerScreen = render(<RegisterScreen />);
        const registerButton = registerScreen.getByTestId('register-button');
        const emailInput = registerScreen.getByPlaceholderText('Email');
        const passwordInput = registerScreen.getByPlaceholderText('Jelszó');
        const mockRegister = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                register: mockRegister, user: null, loading: false, logout: jest.fn(), login: jest.fn()
            }));
        await user.type(emailInput, 'test@test.com');
        await user.type(passwordInput, '123');
        await user.press(registerButton);
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('register button calls register with correct data', async () => {
        const user = userEvent.setup();
        const registerScreen = render(<RegisterScreen />);
        const registerButton = registerScreen.getByTestId('register-button');
        const emailInput = registerScreen.getByPlaceholderText('Email');
        const passwordInput = registerScreen.getByPlaceholderText('Jelszó');
        const confirmPasswordInput = registerScreen.getByPlaceholderText('Jelszó megerősítése');
        const mockRegister = jest.fn();
        (useAuth as jest.MockedFunction<typeof useAuth>)
            .mockImplementation(() => ({
                register: mockRegister, user: null, loading: false, logout: jest.fn(), login: jest.fn()
            }));
        await user.type(emailInput, 'test@test.com');
        await user.type(passwordInput, 'StrongPassword123!');
        await user.type(confirmPasswordInput, 'StrongPassword123!');
        await user.press(registerButton);
        expect(mockRegister).toHaveBeenCalledWith({ email: 'test@test.com', password: 'StrongPassword123!', confirmPassword: 'StrongPassword123!' });
    });
});


