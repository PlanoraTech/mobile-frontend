import { useTheme } from '@/contexts/ThemeProvider';
import { StyleSheet } from 'react-native';

export const createAuthStyles = () => {
    const {theme} = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a',
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        formContainer: {
            width: '100%',
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme === 'light' ? '#333' : '#fff',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color:  theme === 'light' ? '#666' : '#999',
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
            backgroundColor: theme === 'light' ? '#007AFF' : '#11137d',
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
            color: theme === 'light' ? '#666' : '#999',
            fontSize: 14,
        },
        switchAuthLink: {
            color: '#007AFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });
    
};
