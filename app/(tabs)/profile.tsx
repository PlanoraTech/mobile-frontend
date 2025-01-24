import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Switch,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles, lightTheme } from '@/assets/styles/themes';

const ProfileScreen = ({ isLoggedIn = false, FelhasználóType = 'vendég' }) => {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const themeStyles = getThemeStyles(theme);

    const toggleNotifications = () => {
        setIsNotificationsEnabled(previousState => !previousState);
    };

    return (
        <View style={[styles.container, themeStyles.background]}>
            <View style={[styles.content, themeStyles.content]}>
                <View style={styles.nameContainer}>
                    <Text style={[styles.name, { color: theme === 'dark' ? '#fff' : '#333' }]}>
                        {isLoggedIn ? 'John Doe' : 'Vendég'}
                    </Text>
                    {isLoggedIn && (
                        <Pressable onPress={() => console.log('Edit name')}>
                            <MaterialIcons
                                name="edit"
                                size={24}
                                color={theme === 'dark' ? '#adadad' : '#666'}
                            />
                        </Pressable>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#333' }]}>Szerep</Text>
                    <Text style={[styles.value, { color: theme === 'dark' ? '#fff' : '#333' }]}>
                        {FelhasználóType === 'Előadó' ? 'Előadó' :
                            FelhasználóType === 'Felhasználó' ? 'Felhasználó' : 'Vendég'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#333' }]}>Téma</Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{
                            false: '#767577',
                            true: '#81b0ff'
                        }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#333' }]}>Értesítések</Text>
                    <Switch
                        value={isNotificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{
                            false: '#767577',
                            true: '#81b0ff'
                        }}
                    />
                </View>

                <View style={styles.authSection}>
                    {!isLoggedIn ? (
                        <>
                            <Pressable
                                style={[styles.authButton, styles.button, { backgroundColor: theme === 'dark' ? '#11137d' : '#007AFF' }]}
                                onPress={() => router.push('/screens/login')}
                            >
                                <Text style={styles.buttonText}>Bejelentkezés</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.authButton, styles.button, { backgroundColor: theme === 'dark' ? '#11137d' : '#007AFF' }]}
                                onPress={() => router.push('/screens/register')}
                            >
                                <Text style={styles.buttonText}>Regisztráció</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            style={[styles.authButton, { backgroundColor: theme === 'dark' ? '#BA0021' : '#EF0107' }]}
                            onPress={() => console.log('Logout')}
                        >
                            <Text style={styles.buttonText}>Kijelentkezés</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    authSection: {
        marginTop: 30,
        gap: 20,
    },
    authButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;