import RegisterScreen from "@/app/(tabs)/register";
import { render } from "@testing-library/react-native";


jest.mock('@/contexts/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        register: jest.fn(),
    })),
}));

jest.mock('@/contexts/ThemeProvider', () => ({
    useTheme: jest.fn(() => ({
        theme: 'light',
    })),
}));



describe('Register', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<RegisterScreen />);
    });
});


