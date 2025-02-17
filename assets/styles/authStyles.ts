import { useTheme } from '@/contexts/ThemeProvider';
import { StyleSheet } from 'react-native';
import { getThemeStyles } from './themes';
export const createAuthStyles = () => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    return StyleSheet.create({
        statusBar: {
            ...themeStyles.background,
        },

        container: {
            flex: 1,
            ...themeStyles.content,
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        formContainer: {
            width: '100%',
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            ...themeStyles.text,
            marginBottom: 8,


        },
        subtitle: {
            fontSize: 16,
            ...themeStyles.textSecondary,
            marginBottom: 32,

        },
        errorText: {
            color: '#ff3b30',
            fontSize: 14,
            marginTop: -12,
            marginBottom: 16,
            marginLeft: 16,
        },
        forgotPassword: {
            alignSelf: 'flex-end',
            marginBottom: 24,
            color: '#007AFF',
            fontSize: 14,
        },
        authButton: {
            ...themeStyles.button,
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,

        },
        authButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
        switchAuthContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        switchAuthText: {
            ...themeStyles.textSecondary,
            fontSize: 14,
        },

        switchAuthLink: {
            color: '#007AFF',
            fontSize: 14,
            fontWeight: '600',
        },
        suboptionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        checkboxContainer: {
            flexDirection: 'row',
            gap: 5
        },
        checkbox: {
            borderRadius: 5
        }
    });

};
