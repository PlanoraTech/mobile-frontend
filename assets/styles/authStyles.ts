import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
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
        backgroundColor: '#007AFF',
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
        color: '#666',
        fontSize: 14,
    },
    switchAuthLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
